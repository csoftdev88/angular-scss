'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

.controller('OffersCtrl', function($rootScope, $scope, $controller, $location, contentService, $state, $stateParams,
                                   _, breadcrumbsService, metaInformationService, bookingService, scrollService,
                                   $timeout, chainService, Settings, propertyService, cookieFactory, $window,
                                   locationService, routerService, stateService) {


  //////////////////////////
  ///Scope variables
  //////////////////////////

  //Inherit SSOCtrl to access infiniti methods
  $controller('SSOCtrl', {
    $scope: $scope
  });

  //Assign offers setting as scope config
  $scope.config = Settings.UI.offers;

  //Used by view to define whether we are on a specific offer vs overview
  $scope.showDetail = $stateParams.code ? true : false;

  //Used by view to define whether we are on a property specific offer
  $scope.property = null;

  //Catch previous state data for back button - see goToOffersList
  var previousState = {
    state: $state.fromState,
    params: $state.fromParams
  };

  //Number of offers to display in "You may also be interested in" section when viewing a specific offer
  var NUMBER_OF_RELEVANT_OFFERS = 3;

  //global date separator string used in booking params
  var DATES_SEPARATOR = '_';

  //Index of currently selected offer in offerList array
  var selectedOfferIndex;

  $scope.isHotDeals = $state.current.name === 'hotDeals' || $state.current.name === 'propertyHotDeals';

  //object to hold offer availability model e.g. properties to include in dropdown
  $scope.selectedOfferAvailabilityData = {};

  //Initial breadcrumbs
  breadcrumbsService.clear()
    .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');

  if (Settings.UI.offers && Settings.UI.offers.scrollToBreadcrumbs) {
    scrollService.scrollToBreadcrumbs();
  } else {
    scrollService.scrollTo('top');
  }

  //////////////////////////
  ///Main offers filtering logic
  //////////////////////////
  contentService.getOffers().then(function(offers) {

    //Remove offers that have expired
    var today = new Date();
    offers = _.reject(offers, function(offer) {
      return new Date(offer.expirationDate) < today;
    });

    //Pick random merchandizing banner if any
    _.each(offers, function(offer) {
      if (offer.merchandisingBanners && offer.merchandisingBanners.length) {
        offer.merchandisingBanner = offer.merchandisingBanners.length === 1 ? offer.merchandisingBanners[0] : offer.merchandisingBanners[Math.floor(offer.merchandisingBanners.length * Math.random())];
      }
    });

    if ($stateParams.propertySlug && !$scope.isHotDeals) {
      if ($state.current.name !== 'propertyOffers') {
        propertyService.getAll().then(function(properties) {
          var property = _.find(properties, function(prop) {
            return prop.meta.slug === $stateParams.propertySlug;
          });
          $scope.property = property;
          $state.go('propertyOffers', {
            propertySlug: property.meta.slug,
            code: $stateParams.code
          });
        });
      } else {
        propertyService.getAll().then(function(properties) {

          //property details
          var property = _.find(properties, function(prop) {
            return prop.meta.slug === $stateParams.propertySlug;
          });
          $scope.property = property;
          $scope.updateHeroContent(_.filter(property.images, {
            includeInSlider: true
          }));

          //offers
          offers = _.filter(offers, function(offer, index) {
            var availability = _.find(offer.offerAvailability, function(availability) {
              return availability.property === property.code;
            });
            offers[index].availability = availability && (availability.showOnOffersPage || offer.meta.slug === $stateParams.code) ? availability : null;
            return availability && (availability.showOnOffersPage || offer.meta.slug === $stateParams.code);
          });

          $scope.offersList = _.sortBy(offers, 'prio').reverse();

          _.each($scope.offersList, function(offer) {
            if(offer.offerAvailability[0])
            {
              if(offer.meta.slug === $stateParams.code){
                offer.hideFromExtraOffers = true;
              }
              else{
                offer.hideFromExtraOffers = !offer.offerAvailability[0].showOnOffersPage;
              }
            }
            else {
              offer.hideFromExtraOffers = true;
            }
            setOfferUrl(offer);
          });

          if (!$stateParams.code) {
            setBreadCrumbs(null, null, property);

            //Set meta data using info from property
            updateMetaData(property);
          }

          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        });
      }
    } else {
      //show all offers if single property
      if (Settings.UI.generics.singleProperty) {
        $scope.offersList = _.sortBy(offers, 'prio').reverse();
        if ($stateParams.code) {
          selectOffer(bookingService.getCodeFromSlug($stateParams.code));
        }
      } else {
        if ($scope.isHotDeals) {
          //Hotdeal offers logic
          //https://2pventures.tpondemand.com/entity/12353
          var filteredOffers = angular.copy(offers);

          //We need the property availability name to display
          propertyService.getAll().then(function(properties) {

            filteredOffers = _.each(filteredOffers, function(offer) {
              //If that offer is not featured and only has 1 property availability, we will display the property name on thumbnail
              if (offer.offerAvailability && offer.offerAvailability.length === 1) {
                var property = _.find(properties, function(prop) {
                  return prop.code === offer.offerAvailability[0].property;
                });
                if(property)
                {
                  offer.propertyName = property.nameShort;
                }
              }
              //assign a locationCode to each availability
              _.each(offer.offerAvailability, function(availability) {
                var property = _.find(properties, function(prop) {
                  return prop.code === availability.property;
                });
                if (property) {
                  availability.locationCode = property.locationCode;
                }
              });
            });
            if ($stateParams.propertySlug) {
              var curProperty = _.find(properties, function(prop) {
                return prop.meta.slug === $stateParams.propertySlug;
              });
              //remove any availability associated with a property that is not the current property
              _.each(filteredOffers, function(offer) {

                //if specific hotdeal, ignore showOnOffersPage so it can be accessed from elsewhere but won't show on overview page, otherwise remove availabilities with showOnOffersPage: false
                if ($stateParams.code) {
                  offer.offerAvailability = _.reject(offer.offerAvailability, function(availability) {
                    return availability.property !== curProperty.code;
                  });
                  if(offer.offerAvailability[0])
                  {
                    if(offer.meta.slug === $stateParams.code){
                      offer.hideFromExtraOffers = true;
                    }
                    else{
                      offer.hideFromExtraOffers = !offer.offerAvailability[0].showOnOffersPage;
                    }
                  }
                  else {
                    offer.hideFromExtraOffers = true;
                  }
                } else {
                  offer.offerAvailability = _.reject(offer.offerAvailability, function(availability) {
                    return availability.property !== curProperty.code || !availability.showOnOffersPage;
                  });
                }

                if (offer.offerAvailability.length === 1) {
                  var property = _.find(properties, function(prop) {
                    return prop.code === offer.offerAvailability[0].property;
                  });
                  //assign propertyName to offer for view display
                  offer.propertyName = property.nameShort;
                  //Assign single availability at top level for view display
                  offer.availability = offer.offerAvailability[0];
                  //if only one availability, override main prio value with availability prio value
                  offer.prio = _.isFinite(offer.offerAvailability[0].prio) ? offer.offerAvailability[0].prio : offer.prio;
                }
              });

              //Now remove offers with no availability unless featured
              filteredOffers = _.reject(filteredOffers, function(offer) {
                return !offer.offerAvailability.length;
              });

              $scope.offersList = _.sortBy(filteredOffers, 'prio').reverse();

              _.each($scope.offersList, function(offer) {
                setOfferUrl(offer);
              });

              //breadcrumbs
              if (!$stateParams.code) {
                setBreadCrumbs(null, null, curProperty);

                //Set meta data using info from property
                updateMetaData(curProperty);
              }

              //if offer code, go to offer
              if ($stateParams.code) {
                selectOffer(bookingService.getCodeFromSlug($stateParams.code));
              }

              //hero slider
              $scope.updateHeroContent(_.filter(curProperty.images, {
                includeInSlider: true
              }));
            } else {

              //If an offer is not featured at chain level, remove any property availability that is not featured
              _.each(filteredOffers, function(offer) {
                if (!offer.featured) {
                  offer.offerAvailability = _.reject(offer.offerAvailability, function(availability) {
                    return !availability.featured;
                  });
                  //if not a featured offer, and only one of the property availability is featured, set the property availability content as the offer content
                  if (offer.offerAvailability && offer.offerAvailability.length === 1) {
                    var property = _.find(properties, function(prop) {
                      return prop.code === offer.offerAvailability[0].property;
                    });
                    //assign propertyName to offer for view display
                    offer.propertyName = property.nameShort;
                    //Assign single availability at top level for view display
                    offer.availability = offer.offerAvailability[0];
                    //if only one availability, override main prio value with availability prio value
                    offer.prio = _.isFinite(offer.offerAvailability[0].prio) ? offer.offerAvailability[0].prio : offer.prio;
                  }
                }
              });

              //Remove offers with no availability
              filteredOffers = _.reject(filteredOffers, function(offer) {
                return !offer.offerAvailability || !offer.offerAvailability.length;
              });

              $scope.offersList = _.sortBy(filteredOffers, 'prio').reverse();

              _.each($scope.offersList, function(offer) {
                setOfferUrl(offer);
              });

              //breadcrumbs
              if (!$stateParams.code) {
                setBreadCrumbs();
              }
              //if offer code, go to offer
              if ($stateParams.code) {
                selectOffer(bookingService.getCodeFromSlug($stateParams.code));
              }
            }

          });
        } else if (!$scope.isHotDeals) {
          //remove offer property availability
          _.each(offers, function(offer) {
            if (offer.availability) {
              delete offer.availability;
            }
          });
          offers = _.sortBy(offers, 'prio').reverse();

          //Filter out offers that aren't showAtChainLevel and showOnOffersPage unless it is the current URL offer
          $scope.offersList = _.filter(offers, function(offer) {
            return (offer.showAtChainLevel && offer.showOnOffersPage) || offer.meta.slug === $stateParams.code;
          });

          _.each($scope.offersList, function(offer) {
            setOfferUrl(offer);
          });

          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        }
      }
    }
  });

  function setOfferUrl(offer) {
    var slug = offer.availability && offer.availability.slug && offer.availability.slug !== '' ? offer.availability.slug : offer.meta.slug;
    var code = bookingService.getCodeFromSlug(slug);

    var selectedOfferIndex = _.findIndex($scope.offersList, {
      code: code
    });
    if (selectedOfferIndex < 0) {
      return $state.href($scope.isHotDeals ? 'hotDeals' : 'offers', {
        code: null
      });
    }

    var offerHasFeaturedProperties = false;
    _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability) {
      if (availability.featured) {
        offerHasFeaturedProperties = true;
      }
    });

    var paramsData = {};
    var stateParams = {};

    if ($stateParams.propertySlug && !$scope.isHotDeals) {
      offer.url = $state.href('propertyOffers', {
        code: slug,
        propertySlug: $stateParams.propertySlug
      });
    }
    //if a hotdeal but also a chain level offer, go to offer page to avoid duplicated content, unless offer has featured property availability
    else if ($scope.offersList[selectedOfferIndex].showAtChainLevel && $scope.isHotDeals && !offerHasFeaturedProperties && !$stateParams.propertySlug) {
      offer.url = $state.href('offers', {
        code: slug
      });
    } else if ($stateParams.propertySlug && $scope.isHotDeals) {
      stateParams.code = slug;
      propertyService.getAll().then(function(properties) {
        paramsData.property = _.find(properties, function(prop) {
          return prop.meta.slug === $stateParams.propertySlug;
        });
        routerService.buildStateParams('propertyHotDeals', paramsData).then(function(params) {
          stateParams = _.extend(stateParams, params);
          delete stateParams.property; //Remove property parameter as this adds a queryString param that we do not require
          offer.url = $state.href('propertyHotDeals', stateParams, {
            reload: true
          });
        });
      });
    } else if ($scope.offersList[selectedOfferIndex].offerAvailability.length === 1 && $scope.isHotDeals) {
      stateParams.code = slug;
      propertyService.getAll().then(function(properties) {
        paramsData.property = _.find(properties, function(prop) {
          return prop.code === $scope.offersList[selectedOfferIndex].offerAvailability[0].property;
        });
        routerService.buildStateParams('propertyHotDeals', paramsData).then(function(params) {
          stateParams = _.extend(stateParams, params);
          delete stateParams.property; //Remove property parameter as this adds a queryString param that we do not require
          offer.url = $state.href('propertyHotDeals', stateParams, {
            reload: true
          });
        });
      });
    } else {
      offer.url = $state.href($scope.isHotDeals ? 'hotDeals' : 'offers', {
        code: slug
      });
    }
  }


  //////////////////////////
  ///Main function to handle specific offer selection
  //////////////////////////
  function selectOffer(code) {

    selectedOfferIndex = _.findIndex($scope.offersList, {
      code: code
    });

    if (selectedOfferIndex < 0) {
      //If on a location hotDeal page, take user back to location hotDeals page
      if($stateParams && $stateParams.locationSlug && $stateParams.regionSlug && $stateParams.propertySlug){
        var paramsData = {
          'code': null,
          'locationSlug': $stateParams.locationSlug,
          'regionSlug': $stateParams.regionSlug,
          'propertySlug': $stateParams.propertySlug
        };
        return $state.go('propertyHotDeals', paramsData, {
          reload: true
        });
      }
      else {
        return $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {
          code: null
        });
      }
    }

    //handle wrong slug
    //because we use the code part of the slug, using bookingService.getCodeFromSlug, the first part of the slug could technically be anything and still lead to the correct offer, resulting in possible diplicate urls
    if ($stateParams.code !== $scope.offersList[selectedOfferIndex].meta.slug) {
      stateService.correctStateParam('code', $scope.offersList[selectedOfferIndex].meta.slug);
    }


    propertyService.getAll().then(function(properties) {

      //Get current property data
      var currentProperty = null;
      if ($stateParams.propertySlug) {
        currentProperty = _.find(properties, function(property) {
          return property.meta.slug === $stateParams.propertySlug;
        });
      }

      //create offer property selection select options
      if ($scope.config.includeOfferAvailabilityPropertyDropdown) {
        setOfferAvailabilityPropertiesDropdown(properties);
      }

      //get current property availability if any
      var availability = null;
      if (currentProperty) {
        availability = _.find($scope.offersList[selectedOfferIndex].offerAvailability, function(availability) {
          return availability.property === currentProperty.code;
        });
      }

      //assign current property availability if any
      if (!$scope.isHotDeals) {
        $scope.offersList[selectedOfferIndex].availability = availability;
      }

      //apply selected offer data to scope
      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];

      //Add offer code to booking params
      bookingService.setBookingOffer($scope.selectedOffer);
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
        promoCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.promoCode ? $scope.offersList[selectedOfferIndex].availability.promoCode : $scope.offersList[selectedOfferIndex].promoCode,
        corpCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.corpCode ? $scope.offersList[selectedOfferIndex].availability.corpCode : $scope.offersList[selectedOfferIndex].corpCode || null,
        groupCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.groupCode ? $scope.offersList[selectedOfferIndex].availability.groupCode : $scope.offersList[selectedOfferIndex].groupCode || null
      });

      //Save offer discount code in cookie if any
      if ($scope.selectedOffer.discountCode) {
        var cookieValue = cookieFactory('discountCode') && cookieFactory('discountCode').indexOf($scope.selectedOffer.discountCode) === -1 ? cookieFactory('discountCode') + '|' + $scope.selectedOffer.discountCode : $scope.selectedOffer.discountCode;

        var cookieExpiryDate = null;
        if (Settings.UI.offers.discountCodeCookieExpiryDays && Settings.UI.offers.discountCodeCookieExpiryDays !== 0) {
          cookieExpiryDate = new Date();
          cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.offers.discountCodeCookieExpiryDays);
        }
        $window.document.cookie = 'discountCode=' + cookieValue + (!cookieExpiryDate ? '' : '; expires=' + cookieExpiryDate.toUTCString()) + '; path=/';
      }

      //page meta data
      metaInformationService.setMetaDescription(availability && availability.metaDescription && availability.metaDescription !== '' ? availability.metaDescription : $scope.selectedOffer.meta.description);
      metaInformationService.setMetaKeywords(availability && availability.keywords && availability.keywords !== '' ? availability.keywords : $scope.selectedOffer.meta.keywords);
      metaInformationService.setPageTitle(availability && availability.pagetitle && availability.pagetitle !== '' ? availability.pagetitle : $scope.selectedOffer.meta.pagetitle);
      $scope.selectedOffer.meta.microdata.og = {};
      $scope.selectedOffer.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedOffer.meta.microdata.og);

      //Get offer title for breadcrumbs
      var offerTitle = $scope.selectedOffer.availability && $scope.selectedOffer.availability.title && $scope.selectedOffer.availability.title !== '' ? $scope.selectedOffer.availability.title : $scope.selectedOffer.title;

      //Update breadcrumbs and hero slider
      if ($stateParams.propertySlug) {
        propertyService.getAll().then(function(properties) {
          //Get current property
          var property = _.find(properties, function(prop) {
            return prop.meta.slug === $stateParams.propertySlug;
          });
          //Breadcrumbs
          setBreadCrumbs(null, null, property, offerTitle);
          //hero slider
          $scope.updateHeroContent(_.filter(property.images, {
            includeInSlider: true
          }));
        });
      } else {
        //Breadcrumbs
        setBreadCrumbs(null, null, null, offerTitle);
        //hero slider
        if ($scope.config.displayOfferImageInHeroSlider && !_.isEmpty($scope.selectedOffer.image)) {
          $scope.updateHeroContent([$scope.selectedOffer.image]);
        }

      }

    });

  }



  //////////////////////////
  ///Main function to handle book now button
  //////////////////////////
  $scope.goToHotels = function(offer) {
    bookingParams = bookingService.getAPIParams();

    var stateParams = {};
    var paramsData = {};
    stateParams.adults = bookingParams.adults;
    stateParams.children = bookingParams.children;
    stateParams.promoCode = offer.availability && offer.availability.promoCode ? offer.availability.promoCode : offer.promoCode;
    stateParams.groupCode = offer.availability && offer.availability.groupCode ? offer.availability.groupCode : offer.groupCode;
    stateParams.corpCode = offer.availability && offer.availability.corpCode ? offer.availability.corpCode : offer.corpCode;
    if (bookingParams.from && bookingParams.to) {
      stateParams.dates = bookingParams.from + DATES_SEPARATOR + bookingParams.to;
    }

    if (bookingParams.propertyCode && !$scope.config.includeOfferAvailabilityPropertyDropdown) {
      propertyService.getPropertyDetails($scope.isHotDeals ? offer.offerAvailability[0].property : bookingParams.propertyCode)
        .then(function(details) {
          stateParams.scrollTo = 'jsRooms';
          paramsData.property = details;
          routerService.buildStateParams('hotel', paramsData).then(function(params) {
            stateParams = _.extend(stateParams, params);
            $state.go('hotel', stateParams, {
              reload: true
            });
          });
        });
    } else if ($scope.config.includeOfferAvailabilityPropertyDropdown && $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty) {

      var propertyCode = bookingService.getCodeFromSlug($scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty);

      propertyService.getPropertyDetails(propertyCode)
        .then(function(details) {
          stateParams.scrollTo = 'jsRooms';
          paramsData.property = details;
          routerService.buildStateParams('hotel', paramsData).then(function(params) {
            stateParams = _.extend(stateParams, params);
            $scope.prefillBookingWidgetProperty(stateParams.propertySlug);
            $state.go('hotel', stateParams, {
              reload: true
            });
          });
        });
    } else {
      stateParams.scrollTo = 'hotels';
      $state.go('allHotels', stateParams);
    }
  };

  // Checking if user have selected dates
  var bookingParams = bookingService.getAPIParams();
  $scope.hasDates = false;
  if (!bookingParams.from || !bookingParams.to) {
    // Dates are not yet selected
    $scope.selectDates = function() {
      bookingService.setBookingOffer($scope.selectedOffer);
      if ($scope.config.includeOfferAvailabilityPropertyDropdown && $stateParams.propertySlug) {
        $scope.prefillBookingWidgetProperty($stateParams.propertySlug);
      }
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
        openBookingTab: true,
        openDatePicker: true,
        promoCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.promoCode ? $scope.selectedOffer.availability.promoCode : $scope.selectedOffer.promoCode || null,
        corpCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.corpCode ? $scope.selectedOffer.availability.corpCode : $scope.selectedOffer.corpCode || null,
        groupCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.groupCode ? $scope.selectedOffer.availability.groupCode : $scope.selectedOffer.groupCode || null
      });
    };
  } else {
    $scope.hasDates = true;
  }


  //back button
  $scope.goToOffersList = function() {
    if (previousState && previousState.state && previousState.state.name !== '') {
      $state.go(previousState.state, previousState.params);
    } else {
      $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {
        code: ''
      }, {
        reload: true
      });
    }
  };


  /////////////////////////
  //Helper functions
  /////////////////////////

  //watch for showDetail model and scroll to offer detail when true
  $scope.$watch(function() {
    return $scope.showDetail;
  }, function() {
    if ($scope.showDetail) {
      $timeout(function() {
        scrollService.scrollTo('offer-detail', 20);
      });
    }
  });

  $scope.bindHtmlClick = function(event) {
    if (event.target.attributes['ng-click'] && event.target.attributes['ng-click'].value === 'login()') {
      $scope.sso.login();
    }
  };

  $scope.prefillBookingWidgetProperty = function(propertySlug) {
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
      property: bookingService.getCodeFromSlug(propertySlug),
      keepPromoCode: true
    });
  };

  function setOfferAvailabilityPropertiesDropdown(properties) {
    //Creating property availability dropdown
    // 1) if offer is featured, include all property availability
    // 2) if offer is not featured only include featured property availabilities
    // 3) Order as per https://2pventures.tpondemand.com/entity/12644
    $scope.offerAvailabilityProperties = [];
    $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = null;
    var filteredProperties = [];
    if ($scope.offersList[selectedOfferIndex].offerAvailability.length > 1) {
      _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability) {

        var property = _.find(properties, function(property) {
          return availability.property === property.code;
        });

        if(property){
          //If is hotdeal and the offer is featured at chain level or if it's a chainwide offer, include all property availability
          if ($scope.isHotDeals && $scope.offersList[selectedOfferIndex].featured || !$scope.isHotDeals) {
            filteredProperties.push({
              'name': property.nameShort,
              'slug': property.meta.slug,
              'code': property.code,
              'locationCode': property.locationCode,
              'type': 'property',
              'chainCode': property.chainCode
            });
          }
          //If is hotdeal and the offer is not featured at chain level, include featured property availability
          else if ($scope.isHotDeals && availability.featured) {
            filteredProperties.push({
              'name': property.nameShort,
              'slug': property.meta.slug,
              'code': property.code,
              'locationCode': property.locationCode,
              'type': 'property',
              'chainCode': property.chainCode
            });
          }
        }

      });

      if (stateService.isMobile()) {
        $scope.offerAvailabilityProperties = _.sortBy(filteredProperties, 'name');
        //select current property in dropdown
        if ($stateParams.propertySlug) {
          $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = $stateParams.propertySlug;
        }
      } else {
        //sort properties by chain then nameShort
        var propertiesSortedByChain = [];
        _.each(Settings.UI.chains, function(chain) {
          var chainProperties = _.filter(filteredProperties, function(property) {
            return property.chainCode === chain;
          });
          chainProperties = _.sortBy(chainProperties, 'nameShort');
          propertiesSortedByChain = propertiesSortedByChain.concat(chainProperties);
        });
        filteredProperties = propertiesSortedByChain;

        //Create location items, then add properties to their location
        var propertyLocations = _.chain(filteredProperties).pluck('locationCode').unique().value();
        var filteredLocations = [];
        locationService.getRegions().then(function(regions) {
          locationService.getLocations().then(function(locations) {

            _.each(propertyLocations, function(propertyLocation) {

              var curLocation = _.find(locations, function(location) {
                return location.code === propertyLocation;
              });
              var curRegion = _.find(regions, function(region) {
                return region.code === curLocation.regionCode;
              });

              filteredLocations.push({
                'name': curLocation.nameShort + ', ' + curRegion.nameShort,
                'code': propertyLocation,
                'type': 'location'
              });

            });
            filteredLocations = _.sortBy(filteredLocations, 'name');

            //Assign data to scope
            _.each(filteredLocations, function(filteredLocation) {
              _.each(filteredProperties, function(filteredProperty) {
                if (filteredProperty.locationCode === filteredLocation.code) {
                  var availability = _.find($scope.selectedOffer.offerAvailability, function(availability) {
                    return availability.property === filteredProperty.code;
                  });
                  //Only display an offer if at least one of the following options is checked
                  if (availability && (availability.featured || availability.showOnHotelPage || availability.showOnMenu || availability.showOnOffersPage)) {
                    $scope.offerAvailabilityProperties.push(filteredLocation);
                    $scope.offerAvailabilityProperties.push(filteredProperty);
                  }
                }
              });
            });

            //Remove duplicate locations
            $scope.offerAvailabilityProperties = _.uniq($scope.offerAvailabilityProperties);

            //select current property in dropdown
            if ($stateParams.propertySlug) {
              $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = $stateParams.propertySlug;
            }

          });
        });

      }
    } else {
      if ($stateParams.propertySlug) {
        $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = $stateParams.propertySlug;
      }
    }
  }

  function setBreadCrumbs(region, location, property, offerTitle) {

    if ($stateParams.code && !offerTitle) {
      return;
    }

    breadcrumbsService.clear();

    if (region && !location && !property) {
      //breadcrumbs
      breadcrumbsService
        .addBreadCrumb(region.nameShort, 'regions', {
          regionSlug: region.meta.slug,
          property: null
        })
        .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
    } else if (region && location && !property) {
      //breadcrumbs
      breadcrumbsService
        .addBreadCrumb(region.nameShort, 'regions', {
          regionSlug: region.meta.slug,
          property: null
        })
        .addBreadCrumb(location.nameShort, 'hotels', {
          regionSlug: region.meta.slug,
          locationSlug: location.meta.slug,
          property: null
        })
        .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
    } else if (property) {
      //Get property region/location data for breadcrumbs
      propertyService.getPropertyRegionData(property.locationCode).then(function(propertyRegionData) {

        if($stateParams.regionSlug && $stateParams.locationSlug)
        {
          breadcrumbsService
            .addBreadCrumb(propertyRegionData.region.nameShort, 'regions', {
              regionSlug: propertyRegionData.region.meta.slug,
              property: null
            })
            .addBreadCrumb(propertyRegionData.location.nameShort, 'hotels', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              property: null
            });
        }
        else {
          breadcrumbsService.addBreadCrumb('Hotels', 'hotels');
        }

        breadcrumbsService.addBreadCrumb(property.nameShort, 'hotel', {
          regionSlug: propertyRegionData.region.meta.slug,
          locationSlug: propertyRegionData.location.meta.slug,
          propertySlug: property.meta.slug
        });

        if(Settings.UI.viewsSettings.breadcrumbsBar.propertyHotDealsShowTitle)
        {
          breadcrumbsService.setHeader(property.nameLong);
        }

        if (offerTitle) {
          breadcrumbsService
            .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'propertyHotDeals' : 'propertyOffers', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              code: null
            })
            .addBreadCrumb(offerTitle);
        } else {
          breadcrumbsService.addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
        }

        if ($scope.isHotDeals) {
          breadcrumbsService
            .addAbsHref('Offers', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'jsOffers'
            });
        } else {
          //alt nav
          breadcrumbsService
            .addAbsHref('About', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'jsAbout'
            })
            .addAbsHref('Location', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'jsLocation'
            })
            .addAbsHref('Offers', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'jsOffers'
            })
            .addAbsHref('Rooms', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'jsRooms'
            })
            .addAbsHref('Gallery', 'hotel', {
              regionSlug: propertyRegionData.region.meta.slug,
              locationSlug: propertyRegionData.location.meta.slug,
              propertySlug: property.meta.slug,
              scrollTo: 'fnOpenLightBox'
            });
        }

      });
    } else {
      if (offerTitle) {
        breadcrumbsService
          .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'hotDeals' : 'offers', {
            code: null
          })
          .addBreadCrumb(offerTitle);
      } else {
        breadcrumbsService.addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
      }
    }
  }

  $scope.getRelevant = function(offer, index) {
    var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
    return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
  };

  //Function to update meta tags in page, adding relevant Offers / Hot deals info where required.
  function updateMetaData(property){
    if (!$stateParams.code) {
      chainService.getChain(Settings.API.chainCode).then(function(chain) {
        var chainData = chain;
        var offerPageType = $scope.isHotDeals ? 'Hot Deals | ' : 'Offers | ';
        var propertyName = property ? property.nameLong : null;

        chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        chainData.meta.microdata.og['og:title'] = formatMetaTitle(propertyName, offerPageType, chainData.meta.microdata.og['og:title']);

        metaInformationService.setOgGraph(chainData.meta.microdata.og);
        metaInformationService.setPageTitle(formatMetaTitle(propertyName, offerPageType, chain.meta.pagetitle));
        metaInformationService.setMetaDescription(chain.meta.description);
        metaInformationService.setMetaKeywords(chain.meta.keywords);
      });
    }
  }

  //Function to format title based on the existence of a property name and the offer type i.e. offers or hot-deals
  function formatMetaTitle(propertyName, offerPageType, title){
    //If we have a property name add this to the title along with the offer type, if not just add the offer type to the title
    return propertyName ? offerPageType + propertyName + ' | ' + title : offerPageType + title;
  }

  //Set meta data for the page
  updateMetaData();
});
