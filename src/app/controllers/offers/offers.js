'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.offers', [])

  .controller('OffersCtrl', function($rootScope, $scope, $controller, $location, contentService,
      $state, $stateParams, _, breadcrumbsService, metaInformationService, bookingService, scrollService, $timeout, chainService, Settings, propertyService, cookieFactory, $window, locationService, routerService) {

    //$controller('MainCtrl', {$scope: $scope});
    $controller('SSOCtrl', {$scope: $scope});

    $scope.config = Settings.UI.offers;
    $scope.isHotDeals = $state.current.name === 'hotDeals' || $state.current.name === 'propertyHotDeals';
    var hasHotDeals = Settings.UI.menu.showHotDeals;
    $scope.selectedOfferAvailabilityData = {};

    breadcrumbsService.clear()
      .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');

    var NUMBER_OF_RELEVANT_OFFERS = 3;
    var DATES_SEPARATOR = '_';

    var selectedOfferIndex;

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.property = null;
    $scope.allOffers = null;

    $scope.$watch(function(){
      return $scope.showDetail;
    }, function(){
      if($scope.showDetail) {
        $timeout(function () {
          scrollService.scrollTo('offer-detail', 20);
        });
      }
    });

    var previousState = {
      state: $state.fromState,
      params: $state.fromParams
    };

    contentService.getOffers().then(function(offers) {

      $scope.allOffers = offers;

      //Remove offers that have expired
      var today = new Date();
      offers = _.reject(offers, function(offer){
        return new Date(offer.expirationDate) < today;
      });

      if($stateParams.propertySlug && !$scope.isHotDeals){

        if($state.current.name !== 'propertyOffers'){
          propertyService.getAll().then(function(properties){
            var property = _.find(properties, function(prop){ return prop.meta.slug === $stateParams.propertySlug; });
            $scope.property = property;
            $state.go('propertyOffers', {propertySlug: property.meta.slug, code: $stateParams.code});
          });
        }
        else{
          

          propertyService.getAll().then(function(properties){
            //property details
            var property = _.find(properties, function(prop){ return prop.meta.slug === $stateParams.propertySlug; });
            $scope.property = property;
            $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));

            //offers
            offers = _.filter(offers, function(offer, index){
              var availability = _.find(offer.offerAvailability, function(availability){
                return availability.property === property.code;
              });
              offers[index].availability = availability && availability.showOnOffersPage ? availability : null;
              return availability && availability.showOnOffersPage;
            });

            $scope.offersList = _.sortBy(offers, 'prio').reverse();

            if(!$stateParams.code) {
              setBreadCrumbs(null, null, property);
            }

            if ($stateParams.code) {
              selectOffer(bookingService.getCodeFromSlug($stateParams.code));
            }
          });

        }

      }else{

        //show all offers if single property
        if(Settings.UI.generics.singleProperty){
          $scope.offersList = _.sortBy(offers, 'prio').reverse();
          if ($stateParams.code) {
            selectOffer(bookingService.getCodeFromSlug($stateParams.code));
          }
        }
        //Only show offers that have showAtChainLevel true if multiple properties
        else{

          if($scope.isHotDeals){

            //Hotdeal offers logic
            //https://2pventures.tpondemand.com/entity/12353
            var filteredOffers = angular.copy(offers);

            //We need the property availability name to display
            propertyService.getAll().then(function(properties){

              filteredOffers = _.each(filteredOffers, function(offer){
                //If that offer is not featured and only has 1 property availability, we will display the property name on thumbnail
                if (offer.offerAvailability && offer.offerAvailability.length === 1) {
                  var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property;});
                  offer.propertyName = property.nameShort;
                }
                //assign a locationCode to each availability
                _.each(offer.offerAvailability, function(availability){
                  var property = _.find(properties, function(prop){ return prop.code === availability.property;});
                  if (property) {
                    availability.locationCode = property.locationCode;
                  }
                });
              });

              //Filter offers by region if any and if no location or property is defined
              if($stateParams.regionSlug && !$stateParams.locationSlug && !$stateParams.propertySlug){


                locationService.getRegions().then(function(regions){
                  locationService.getLocations().then(function(locations){
                    var curRegion = _.find(regions, function(region){ return region.meta.slug === $stateParams.regionSlug; });
                    var regionLocations = _.where(locations, {regionCode: curRegion.code});

                    //remove any availability associated with a property not part of current region locations
                    var RegionOffers = [];

                    _.each(filteredOffers, function(offer){

                      var filteredAvailabilities = [];

                      _.each(regionLocations, function(location){

                        _.each(offer.offerAvailability, function(availability){

                          if(availability.locationCode === location.code && availability.showOnOffersPage){
                            filteredAvailabilities.push(availability);
                          }
                        });

                      });

                      offer.offerAvailability = filteredAvailabilities;

                      if(offer.offerAvailability.length === 1){
                        var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property;});
                        offer.propertyName = property.nameShort;
                      }

                      if(offer.offerAvailability.length && !_.contains(RegionOffers, offer)){
                        RegionOffers.push(offer);
                      }
                      
                    });

                    $scope.offersList = RegionOffers;
                    console.log('Hot deals Region page, number of hot-deals shown: ' + $scope.offersList.length);
                    //breadcrumbs
                    if(!$stateParams.code) {
                      setBreadCrumbs(curRegion);
                    }
                  });
                });
              }
              //Filter offers by location if any, not if property is defined
              else if($stateParams.regionSlug && $stateParams.locationSlug && !$stateParams.propertySlug){
                locationService.getRegions().then(function(regions){
                  locationService.getLocations().then(function(locations){
                    var curRegion = _.find(regions, function(region){ return region.meta.slug === $stateParams.regionSlug; });
                    var curLocation = _.find(locations, function(location){ return location.meta.slug === $stateParams.locationSlug; });

                    //remove any availability associated with a property not part of current region locations
                    var locationOffers = [];

                    _.each(filteredOffers, function(offer){

                      var filteredAvailabilities = [];

                      _.each(offer.offerAvailability, function(availability){

                        if(availability.locationCode === curLocation.code && availability.showOnOffersPage){
                          filteredAvailabilities.push(availability);
                        }
                      });

                      offer.offerAvailability = filteredAvailabilities;

                      if(offer.offerAvailability.length === 1){
                        var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property;});
                        offer.propertyName = property.nameShort;
                      }

                      if(offer.offerAvailability.length && !_.contains(locationOffers, offer)){
                        locationOffers.push(offer);
                      }
                    });
                    
                    $scope.offersList = locationOffers;
                    console.log('Hot deals locations page, number of hot-deals shown: ' + $scope.offersList.length);
                    //breadcrumbs
                    if(!$stateParams.code) {
                      setBreadCrumbs(curRegion, curLocation);
                    }
                  });
                });
              }
              else if($stateParams.propertySlug){
                
                var curProperty = _.find(properties, function(prop){ return prop.meta.slug === $stateParams.propertySlug;});
                //remove any availability associated with a property that is not the current property
                _.each(filteredOffers, function(offer){
                  offer.offerAvailability = _.reject(offer.offerAvailability, function(availability){
                    return availability.property !== curProperty.code;
                  });
                  if(offer.offerAvailability.length === 1){
                    var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property;});
                    offer.propertyName = property.nameShort;
                  }
                });
                //Now remove offers with no availability unless featured
                filteredOffers = _.reject(filteredOffers, function(offer){
                  return !offer.offerAvailability.length;
                });
                $scope.offersList = filteredOffers;
                console.log('Hot deals property page, number of hot-deals shown: ' + $scope.offersList.length);
                //breadcrumbs
                if(!$stateParams.code) {
                  setBreadCrumbs(null, null, curProperty);
                }
              }
              else {
                //$scope.offersList = _.where(offers, {showAtChainLevel: true, showOnOffersPage: true});

                //If an offer is not featured at chain level, remove any property availability that is not featured
                _.each(filteredOffers, function(offer){
                  if(!offer.featured){
                    offer.offerAvailability = _.reject(offer.offerAvailability, function(availability){
                      return !availability.featured || !availability.showOnOffersPage;
                    });
                    //if not a featured offer, and only one of the property availability is featured, set the property availability content as the offer content
                    if(offer.offerAvailability && offer.offerAvailability.length === 1){
                      var property = _.find(properties, function(prop){ return prop.code === offer.offerAvailability[0].property;});
                      offer.propertyName = property.nameShort;
                      offer.availability = offer.offerAvailability[0];
                    }
                  }
                });

                //Remove offers with no availability
                filteredOffers = _.reject(filteredOffers, function(offer){
                  return !offer.offerAvailability || !offer.offerAvailability.length;
                });

                $scope.offersList = filteredOffers;
                console.log('Main Hot deals page, number of hot-deals shown: ' + $scope.offersList.length);

                //breadcrumbs
                if(!$stateParams.code) {
                  setBreadCrumbs();
                }
              }

              if($stateParams.code) {
                selectOffer(bookingService.getCodeFromSlug($stateParams.code));
              }

            });
          }
          else if(!$scope.isHotDeals && hasHotDeals){
            $scope.offersList = _.where(offers, {showAtChainLevel: true, showOnOffersPage: true});
            if ($stateParams.code) {
              selectOffer(bookingService.getCodeFromSlug($stateParams.code));
            }
          }
        }
      }
    });

    //If not a specific offer, load chain data to apply meta data
    if(!$stateParams.code){
      chainService.getChain(Settings.API.chainCode).then(function(chain) {
        var chainData = chain;

        chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        chainData.meta.microdata.og['og:title'] = 'Offers: ' + chainData.meta.microdata.og['og:title'];
        chainData.meta.microdata.og['og:description'] = 'Offers: ' + chainData.meta.microdata.og['og:description'];

        metaInformationService.setOgGraph(chainData.meta.microdata.og);
        metaInformationService.setPageTitle(chain.meta.pagetitle);
        metaInformationService.setMetaDescription(chain.meta.description);
        metaInformationService.setMetaKeywords(chain.meta.keywords);

      });
    }

    function setBreadCrumbs(region, location, property, offerTitle){

      if($stateParams.code && !offerTitle) {
        return;
      }

      breadcrumbsService.clear();

      if(region && !location && !property){
        //breadcrumbs
        breadcrumbsService
          .addBreadCrumb(region.nameShort, 'regions', {regionSlug: region.meta.slug, property: null})
          .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
      }
      else if(region && location && !property){
        //breadcrumbs
        breadcrumbsService
          .addBreadCrumb(region.nameShort, 'regions', {regionSlug: region.meta.slug, property: null})
          .addBreadCrumb(location.nameShort, 'hotels', {regionSlug: region.meta.slug, locationSlug: location.meta.slug, property: null})
          .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
      }
      else if(property){
        //Get property region/location data for breadcrumbs
        propertyService.getPropertyRegionData(property.locationCode).then(function(propertyRegionData){

          //breadcrumbs
          breadcrumbsService
            .addBreadCrumb(propertyRegionData.region.nameShort, 'regions', {regionSlug: propertyRegionData.region.meta.slug, property: null})
            .addBreadCrumb(propertyRegionData.location.nameShort, 'hotels', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, property: null})
            .addBreadCrumb(property.nameShort, 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug});


          if(offerTitle){
            breadcrumbsService
              .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'propertyHotDeals' : 'propertyOffers', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, code: null})
              .addBreadCrumb(offerTitle);
          }
          else{
            breadcrumbsService.addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
          }

          //alt nav
          breadcrumbsService
          .addAbsHref('About', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, scrollTo: 'jsAbout'})
          .addAbsHref('Location', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, scrollTo: 'jsLocation'})
          .addAbsHref('Offers', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, scrollTo: 'jsOffers'})
          .addAbsHref('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, scrollTo: 'jsRooms'})
          .addAbsHref('Gallery', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: property.meta.slug, scrollTo: 'fnOpenLightBox'});

        });
      }
      else{
        if(offerTitle){
          breadcrumbsService
            .addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers', $scope.isHotDeals ? 'hotDeals' : 'offers', {code: null})
            .addBreadCrumb(offerTitle);
        }
        else{
          breadcrumbsService.addBreadCrumb($scope.isHotDeals ? 'Hot Deals' : 'Offers');
        }
      }
    }

    $scope.getRelevant = function(offer, index) {
      var offset = selectedOfferIndex < NUMBER_OF_RELEVANT_OFFERS ? 1 : 0;
      return selectedOfferIndex !== index && NUMBER_OF_RELEVANT_OFFERS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function (slug) {
      var code = bookingService.getCodeFromSlug(slug);

      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: null});
      }

      //Creating property availability dropdown
      /*
      $scope.offerAvailabilityProperties = [];
      if($scope.config.includeOfferAvailabilityPropertyDropdown && $scope.offersList[selectedOfferIndex].offerAvailability.length > 1){
        propertyService.getAll().then(function(properties){
          _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
            var property = _.find(properties, function(property){
              return availability.property === property.code;
            });
            $scope.offerAvailabilityProperties.push({
              'name': property.nameShort,
              'slug': property.meta.slug
            });
          });
        });
      }


      var availability = _.find($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
        return availability.property === $stateParams.property;
      });

      $scope.offersList[selectedOfferIndex].availability = availability;
      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];
      */


      var paramsData = {};
      var stateParams = {};

      if($stateParams.propertySlug && !$scope.isHotDeals){
        $state.go('propertyOffers', {code: slug, propertySlug: $stateParams.propertySlug});
      }
      else if($stateParams.propertySlug && $scope.isHotDeals){
        stateParams.code = slug;
        propertyService.getAll().then(function(properties){
          paramsData.property = _.find(properties, function(prop){ return prop.meta.slug === $stateParams.propertySlug; });
          routerService.buildStateParams('propertyHotDeals', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            $state.go('propertyHotDeals', stateParams, {reload: true});
          });
        });
      }
      else if($scope.offersList[selectedOfferIndex].offerAvailability.length === 1 && $scope.isHotDeals){
        stateParams.code = slug;
        propertyService.getAll().then(function(properties){
          paramsData.property = _.find(properties, function(prop){ return prop.code === $scope.offersList[selectedOfferIndex].offerAvailability[0].property; });
          routerService.buildStateParams('propertyHotDeals', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            $state.go('propertyHotDeals', stateParams, {reload: true});
          });
        });
      }
      else{
        $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: slug});
      }

      /*
      $timeout(function () {
        bookingService.setBookingOffer($scope.selectedOffer);
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          promoCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.promoCode ? $scope.selectedOffer.availability.promoCode : $scope.selectedOffer.promoCode,
          corpCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.corpCode ? $scope.selectedOffer.availability.corpCode : $scope.selectedOffer.corpCode || null,
          groupCode: $scope.selectedOffer.availability && $scope.selectedOffer.availability.groupCode ? $scope.selectedOffer.availability.groupCode : $scope.selectedOffer.groupCode || null
        });
      });
      */
    };

    $scope.goToOffersList = function() {
      if(previousState && previousState.state && previousState.state.name !== ''){
        $state.go(previousState.state, previousState.params);
      }
      else{
        $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: ''}, {reload: true});
      }
    };

    function selectOffer(code) {

      selectedOfferIndex = _.findIndex($scope.offersList, {code: code});
      if (selectedOfferIndex < 0) {
        return $state.go($scope.isHotDeals ? 'hotDeals' : 'offers', {code: null});
      }

      //Creating property availability dropdown
      // 1) if offer is featured, include all property availability
      // 2) if offer is not featured only include featured availabilities
      $scope.offerAvailabilityProperties = [];
      if($scope.config.includeOfferAvailabilityPropertyDropdown && $scope.offersList[selectedOfferIndex].offerAvailability.length > 1){
        propertyService.getAll().then(function(properties){
          _.each($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){

            var property = _.find(properties, function(property){
              return availability.property === property.code;
            });

            if($scope.offersList[selectedOfferIndex].featured){
              $scope.offerAvailabilityProperties.push({
                'name': property.nameShort,
                'slug': property.meta.slug
              });
            }
            else if(availability.featured){
              $scope.offerAvailabilityProperties.push({
                'name': property.nameShort,
                'slug': property.meta.slug
              });
            }

          });
        });
      }


      //select current property in dropdown
      if($scope.config.includeOfferAvailabilityPropertyDropdown && $stateParams.propertySlug){
        $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty = $stateParams.propertySlug;
      }

      var availability = _.find($scope.offersList[selectedOfferIndex].offerAvailability, function(availability){
        return availability.property === $stateParams.property;
      });
      if(!$scope.isHotDeals){
        $scope.offersList[selectedOfferIndex].availability = availability;
      }


      $scope.selectedOffer = $scope.offersList[selectedOfferIndex];

      bookingService.setBookingOffer($scope.selectedOffer);
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
        promoCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.promoCode ? $scope.offersList[selectedOfferIndex].availability.promoCode : $scope.offersList[selectedOfferIndex].promoCode,
        corpCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.corpCode ? $scope.offersList[selectedOfferIndex].availability.corpCode : $scope.offersList[selectedOfferIndex].corpCode || null,
        groupCode: $scope.offersList[selectedOfferIndex].availability && $scope.offersList[selectedOfferIndex].availability.groupCode ? $scope.offersList[selectedOfferIndex].availability.groupCode : $scope.offersList[selectedOfferIndex].groupCode || null
      });

      if($scope.selectedOffer.discountCode){
        var cookieValue = cookieFactory('discountCode') && cookieFactory('discountCode').indexOf($scope.selectedOffer.discountCode) === -1? cookieFactory('discountCode') + '|' + $scope.selectedOffer.discountCode : $scope.selectedOffer.discountCode;

        var cookieExpiryDate = null;
        if(Settings.UI.offers.discountCodeCookieExpiryDays && Settings.UI.offers.discountCodeCookieExpiryDays !== 0){
          cookieExpiryDate = new Date();
          cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.offers.discountCodeCookieExpiryDays);
        }
        $window.document.cookie = 'discountCode=' + cookieValue + (!cookieExpiryDate ? '' : '; expires=' + cookieExpiryDate.toUTCString()) + '; path=/';
      }

      metaInformationService.setMetaDescription(availability && availability.metaDescription && availability.metaDescription !== '' ? availability.metaDescription : $scope.selectedOffer.meta.description);
      metaInformationService.setMetaKeywords(availability && availability.keywords && availability.keywords !== '' ? availability.keywords : $scope.selectedOffer.meta.keywords);
      metaInformationService.setPageTitle(availability && availability.pagetitle && availability.pagetitle !== '' ? availability.pagetitle : $scope.selectedOffer.meta.pagetitle);
      $scope.selectedOffer.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedOffer.meta.microdata.og);

      //Get offer title
      var offerTitle = $scope.selectedOffer.availability && $scope.selectedOffer.availability.title &&  $scope.selectedOffer.availability.title !== '' ?  $scope.selectedOffer.availability.title : $scope.selectedOffer.title;

      if($stateParams.property){
        propertyService.getAll().then(function(properties){
          //Get current property
          var property = _.find(properties, function(prop){ return prop.code === $stateParams.property; });
          //Breadcrumbs
          setBreadCrumbs(null, null, property, offerTitle);
          //hero slider
          $scope.updateHeroContent(_.filter(property.images, {includeInSlider: true}));
        });
      }
      else{
        //Breadcrumbs
        setBreadCrumbs(null, null, null, offerTitle);
        //hero slider
        if($scope.config.displayOfferImageInHeroSlider && !_.isEmpty($scope.selectedOffer.image)){
          $scope.updateHeroContent([$scope.selectedOffer.image]);
        }

      }

    }

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

      if(bookingParams.propertyCode && !$scope.config.includeOfferAvailabilityPropertyDropdown){
        propertyService.getPropertyDetails($scope.isHotDeals ? offer.offerAvailability[0].property : bookingParams.propertyCode)
          .then(function(details){
            stateParams.scrollTo = 'jsRooms';
            paramsData.property = details;
            routerService.buildStateParams('hotel', paramsData).then(function(params){
              stateParams = _.extend(stateParams, params);
              $state.go('hotel', stateParams, {reload: true});
            });
          });
      }
      else if($scope.config.includeOfferAvailabilityPropertyDropdown && $scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty){

        var propertyCode = bookingService.getCodeFromSlug($scope.selectedOfferAvailabilityData.selectedOfferAvailabilityProperty);

        propertyService.getPropertyDetails(propertyCode)
          .then(function(details){
            stateParams.scrollTo = 'jsRooms';
            paramsData.property = details;
            routerService.buildStateParams('hotel', paramsData).then(function(params){
              stateParams = _.extend(stateParams, params);
              $scope.prefillBookingWidgetProperty(stateParams.propertySlug);
              $state.go('hotel', stateParams, {reload: true});
            });
          });
      }
      else{
        stateParams.scrollTo = 'hotels';
        $state.go('allHotels', stateParams);
      }
    };

    // Checking if user have selected dates
    var bookingParams = bookingService.getAPIParams();
    $scope.hasDates = false;
    if(!bookingParams.from || !bookingParams.to){
      // Dates are not yet selected
      $scope.selectDates = function(){
        bookingService.setBookingOffer($scope.selectedOffer);
        if($scope.config.includeOfferAvailabilityPropertyDropdown && $stateParams.propertySlug){
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
    }
    else{
      $scope.hasDates = true;
    }

    $scope.bindHtmlClick = function(event){
      if(event.target.attributes['ng-click'] && event.target.attributes['ng-click'].value === 'login()'){
        $scope.sso.login();
      }
    };

    $scope.prefillBookingWidgetProperty = function(propertySlug){
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
        property: bookingService.getCodeFromSlug(propertySlug)
      });
    };

  });
