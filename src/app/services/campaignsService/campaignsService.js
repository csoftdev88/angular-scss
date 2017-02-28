'use strict';
/*
 * This service sets applicable adverts and campaign visuals
 */
angular.module('mobiusApp.services.campaigns', [])
  .service('campaignsService', function($q, Settings, apiService, $rootScope, $stateParams, $state, bookingService, propertyService, routerService, contentService, user, $timeout, modalService, $window, cookieFactory, infinitiApeironService, stateService, _) {
    var activeCampaign = null;
    var savedCampaign = null;
    var savedLocations = null;
    var locationCode = null;

    function setCampaigns(loggedIn, locations) {
      savedLocations = locations;
      var locationMatch = _.find(savedLocations, function(location){
        return $stateParams.locationSlug === location.meta.slug;
      });
      locationCode = locationMatch ? locationMatch.code : null;
      activeCampaign = cookieFactory('ActiveCampaign');
      savedCampaign = activeCampaign !== null ? angular.fromJson(activeCampaign) : null;
      
      //Only request search specific campaigns if on one of the following pages
      var getAllCampaigns = true;
      switch($state.current.name){
        case 'hotel':
          getAllCampaigns = false;
          break;
        case 'hotels':
          getAllCampaigns = false;
          break;
        case 'hotelInfo':
          getAllCampaigns = false;
          break;
        case 'locationInfo':
          getAllCampaigns = false;
          break;
        case 'room':
          getAllCampaigns = false;
          break;
        case 'propertyOffers':
          getAllCampaigns = false;
          break;
        case 'propertyHotDeals':
          getAllCampaigns = false;
          break;
        default:
          getAllCampaigns = true;
      }
      
      getCampaigns(loggedIn, getAllCampaigns).then(function(data) {
        if (data.length && data[0] && data[0].criteria) {
          selectCampaign(data[0], loggedIn);
        } else {
          //If no campaign returned display previous campaign
          console.log('no campaign returned');    
          getSavedCampaign(getAllCampaigns);        
        }
      });
    }

    function getSavedCampaign(getAllCampaigns){
      if (savedCampaign) {
        getCampaigns(null, true).then(function(data) {
          var retrievedCampaign = null;
          if(data.length && data[0]){
            retrievedCampaign = _.find(data[0], function(thisCampaign) {
              return thisCampaign.code === savedCampaign.code;
            });
          }
          //If there is a saved campaign and we are on a non-search based page, display the saved campaign
          if (retrievedCampaign && getAllCampaigns) {
            console.log('display previous campaign');
            renderCampaign(retrievedCampaign);
          }
          //Otherwise disable the active campaign
          else {
            disableActiveCampaign();
          }
        });
      }
    }

    function getCampaigns(loggedIn, getAll) {
      var params = {};
      if (!getAll) {
        if ($stateParams.dates) {
          var dates = $stateParams.dates.split('_');
          params.from = dates[0];
          params.to = dates[1];
        }
        //if on a property based page add the property to campaign request params
        if ($stateParams.propertySlug) {
          params.property = bookingService.getCodeFromSlug($stateParams.propertySlug);
        }
        //if on a location page but not a property page add the location to campaign request params
        if(!$stateParams.propertySlug && $stateParams.locationSlug && locationCode) {
          params.location = locationCode;
        }    
      }
      params.loggedIn = loggedIn !== null ? loggedIn : user.isLoggedIn();

      return apiService.getThrottled(apiService.getFullURL('campaigns'), params);
    }

    function selectCampaign(campaign, loggedIn) {
      if(criteriaCheck(campaign, loggedIn))
      {
        renderCampaign(campaign);
      }
      else {
        disableActiveCampaign();
      }
    }

    function criteriaCheck(campaign, loggedIn, bookingDates, locationSlug, property, locations) {
      var criteriaPass = campaign.active ? checkActiveDates(campaign) : false;
      if (criteriaPass) {
        console.log('active dates check pass');
        criteriaPass = checkMemberOnly(campaign, loggedIn);
      } else {
        console.log('active dates check fail');
        return false;
      }
      if (criteriaPass) {
        console.log('member only check pass');
        criteriaPass = checkDateRestrictions(campaign, bookingDates);
      } else {
        console.log('member only check fail');
        return false;
      }
      if (criteriaPass) {
        console.log('booking date restrictions pass');
        criteriaPass = checkPropertyRestrictions(campaign, property);
        if(criteriaPass){
          console.log('property restrictions check pass');
          //If no properties selected in criteria but location is set
          if(!campaign.criteria.properties && campaign.criteria.locations){
            criteriaPass = checkLocationRestrictions(campaign, locationSlug, property, locations);
          }
        }
        else {
          console.log('property restrictions check fail');
          criteriaPass = checkLocationRestrictions(campaign, locationSlug, property, locations);
        }
      } else {
        console.log('booking date restrictions fail');
        return false;
      }
      if (criteriaPass) {
        console.log('location restrictions check pass');
        return true;
      } else {
        console.log('location restrictions check fail');
        return false;
      }
    }

    function checkLocationRestrictions(campaign, urlLocationSlug, property, locations) {
      urlLocationSlug = urlLocationSlug ? urlLocationSlug : $stateParams.locationSlug;

      if(locations) {
        savedLocations = locations;
        var relevantLocation = _.find(savedLocations, function(location){
          return $stateParams.locationSlug === location.meta.slug;
        });
        locationCode = relevantLocation ? relevantLocation.code : null;
      }

      if (campaign.criteria.locations) {
        if ($stateParams.locationSlug) {
          var criteriaLocations = campaign.criteria.locations;
          var criteriaLocationsArray = [];
          if (_.isArray(criteriaLocations)) {
            criteriaLocationsArray = criteriaLocations;
          } else {
            criteriaLocationsArray = criteriaLocations.split(',');
          }
          var locationMatch = _.find(criteriaLocationsArray, function(location) {
            return location === locationCode;
          });
          if (locationMatch) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      else if(property !== null) {
        return false;
      }
      else {
        return true;
      }
    }

    function checkPropertyRestrictions(campaign, urlProperty) {
      urlProperty = urlProperty ? urlProperty : $stateParams.property;
      if (campaign.criteria.properties) {
        if (urlProperty) {
          var criteriaProperties = campaign.criteria.properties;
          var criteriaPropertiesArray = [];
          if (_.isArray(criteriaProperties)) {
            criteriaPropertiesArray = criteriaProperties;
          } else {
            criteriaPropertiesArray = criteriaProperties.split(',');
          }
          var propertyMatch = _.find(criteriaPropertiesArray, function(property) {
            return property === urlProperty;
          });
          if (propertyMatch) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function checkDateRestrictions(campaign, bookingDates) {
      if (campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil) {
        bookingDates = bookingDates ? bookingDates : $stateParams.dates;
        if (bookingDates) {
          var bookedDate = bookingDates.split('_');
          if (bookedDate && bookedDate.length) {
            var bookingFromDate = parseInt($window.moment.tz(bookedDate[0], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var bookingToDate = parseInt($window.moment.tz(bookedDate[1], Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var criteriaFromDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsFrom).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            var criteriaToDate = parseInt($window.moment.tz($window.moment(campaign.criteria.bookingsUntil).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
            if (bookingFromDate >= criteriaFromDate && bookingToDate <= criteriaToDate) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function checkMemberOnly(campaign, loggedIn) {
      if (campaign.criteria.memberOnly && !loggedIn) {
        return false;
      } else {
        return true;
      }
    }

    function checkActiveDates(campaign) {
      var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
      var fromDate = parseInt($window.moment.tz($window.moment(campaign.active.from).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
      var toDate = parseInt($window.moment.tz($window.moment(campaign.active.to).format('YYYY-MM-DD'), Settings.UI.bookingWidget.timezone).startOf('day').valueOf());

      if (fromDate || toDate) {
        if (fromDate <= today && toDate >= today) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function renderCampaign(campaign) {
      $rootScope.campaign = campaign ? campaign : $rootScope.campaign;

      //Track our campaign display
      if($state.current.parent !== 'reservation'){
        infinitiApeironService.trackCampaignDisplay(campaign.code);
      }

      //Build the campaign URL and add to scope
      addCampaignUrl();

      if($rootScope.campaign.sideRails && $rootScope.campaign.sideRails.railImage && $rootScope.campaign.sideRails.railImage.uri && $state.current.parent !== 'reservation' && !stateService.isMobile())
      {
        $rootScope.campaign.sideRails.display = true;
        $timeout(function(){
          var heroSliderEl = $('#main-container > div > hero-slider');
          var mainHeaderHeight = $('#main-header').height();
          heroSliderEl.css('margin-top', mainHeaderHeight);
        }, 1500);
      }
      else{
        $rootScope.campaign.sideRails = {};
        $rootScope.campaign.sideRails.display = false;
      }
      //If not on an offer page show the rest of the campaign material
      if(!$stateParams.code && $state.current.parent !== 'reservation')
      {
        if(!$rootScope.campaign.sideRails.display && $rootScope.campaign.pageCurl && $rootScope.campaign.pageCurl.images && $rootScope.campaign.pageCurl.images.uri && !stateService.isMobile()) {
          $rootScope.campaign.pageCurl.display = true;
          $('body').addClass('campaign-folded-corner-active');
        }

        if($rootScope.campaign.interstitialAdvert && $rootScope.campaign.interstitialAdvert.images && $rootScope.campaign.interstitialAdvert.images.uri) {
          $rootScope.campaign.interstitialAdvert.display = true;
        }

        if($rootScope.campaign.headerBar && $rootScope.campaign.headerBar.headerText && !stateService.isMobile()){
          $rootScope.campaign.headerBar.display = true;
        }

        if($rootScope.campaign.bookingBar && $rootScope.campaign.bookingBar.tabTitle && !stateService.isMobile()) {
          $rootScope.campaign.bookingBar.display = true;
        }

        if ($rootScope.campaign.interstitialAdvert.display) {
          if (savedCampaign) {
            if (!savedCampaign.interstitialDismissed) {
              modalService.openCampaignDialog($rootScope.campaign);
            }
          } else {
            modalService.openCampaignDialog($rootScope.campaign);
          }
        }
      }
      else{
        disableActiveCampaign();
      }

      //Add new campaign cookie
      if (savedCampaign) {
        if (savedCampaign.code !== campaign.code) {
          addCampaignCookie($rootScope.campaign);
        }
      } else {
        addCampaignCookie($rootScope.campaign);
      }

      //Update booking bar with params
      $timeout(function() {
        // TODO: Check other code types
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', $stateParams);
      }, 0);

    }

    function disableActiveCampaign(){
      console.log('disable active campaign');
      if($rootScope.campaign){
        $rootScope.campaign.pageCurl = {};
        $rootScope.campaign.pageCurl.display = false;
        $rootScope.campaign.bookingBar = {};
        $rootScope.campaign.bookingBar.display = false;
        $rootScope.campaign.headerBar = {};
        $rootScope.campaign.headerBar.display = false;
        $rootScope.campaign.interstitialAdvert = {};
        $rootScope.campaign.interstitialAdvert.display = false;
        $rootScope.campaign.sideRails = {};
        $rootScope.campaign.sideRails.display = false;
      }
    }

    function addCampaignUrl() {
      if ($rootScope.campaign.association) {
        var offerCode = $rootScope.campaign.association.offerCode;
        var propertyCode = $rootScope.campaign.association.propertyCode;
        var contentCode = $rootScope.campaign.association.contentCode;

        //If there is an offer code but no property code from admin, use property code from URL
        if(offerCode && !propertyCode && $stateParams && $stateParams.property) {
          propertyCode = $stateParams.property;
          $rootScope.campaign.association.propertyCode = propertyCode;
        }

        if (offerCode && propertyCode) {
          propertyService.getPropertyDetails(propertyCode).then(function(details) {
            var paramsData = {};
            paramsData.property = details;

            contentService.getOffers().then(function(offers) {
              var selectedOfferIndex = _.findIndex(offers, {
                code: offerCode
              });
              var offer = offers[selectedOfferIndex];
              if(offer && offer.meta && offer.meta.slug){
                $stateParams.code = offer.meta.slug;
              }
            });

            routerService.buildStateParams('hotel', paramsData).then(function(params) {
              $stateParams = _.extend($stateParams, params);
              //$stateParams.property = null;
              var stateName = Settings.newUrlStructure ? 'propertyHotDeals' : 'propertyOffers';
              $rootScope.campaign.uri = $state.href(stateName, $stateParams, {
                reload: true
              });
            });
          });
        } else if (offerCode) {
          $rootScope.campaign.uri = $state.href('offers', {code: offerCode}, {
            reload: true
          });
        } else if (propertyCode) {
          propertyService.getPropertyDetails(propertyCode).then(function(details) {
            $stateParams.scrollTo = 'jsRooms';
            var paramsData = {};
            paramsData.property = details;
            routerService.buildStateParams('hotel', paramsData).then(function(params) {
              $stateParams = _.extend($stateParams, params);
              $stateParams.property = null;
              $rootScope.campaign.uri = $state.href('hotel', $stateParams, {
                reload: true
              });
            });
          });
        } else if (contentCode) {
          contentService.getStatic().then(function(response) {
            var staticContent = _.find(response, function(item) {
              return item.code === contentCode;
            });
            if (staticContent) {
              var slug = staticContent.meta.slug;
              var codeStartIndex = slug.lastIndexOf('-');
              slug = slug.substring(0, codeStartIndex);
              $rootScope.campaign.uri = $state.href('staticContent', {
                contentSlug: slug
              });
            }
          });
        }
      }
    }

    function addCampaignCookie(campaign) {
      var isPriority = campaign.criteria.bookingsFrom || campaign.criteria.bookingsUntil ? true : false;
      var campaignCookie = {
        'id': campaign.id,
        'code': campaign.code,
        'interstitialDismissed': false,
        'priority': isPriority
      };
      $window.document.cookie = 'ActiveCampaign' + '=' + angular.toJson(campaignCookie) + '; path=/';
    }

    // Public methods
    return {
      setCampaigns: setCampaigns,
      criteriaCheck: criteriaCheck
    };
  });
