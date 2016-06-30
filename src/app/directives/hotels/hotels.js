'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'filtersService', 'bookingService',
  'propertyService', 'preloaderFactory', '_', 'user',
  '$q', 'modalService', '$controller', 'breadcrumbsService', 'scrollService', '$location', '$timeout', '$rootScope', '$stateParams', 'contentService', 'Settings', 'locationService', 'userPreferenceService', 'chainService',
  function($state, filtersService, bookingService, propertyService,
    preloaderFactory, _, user, $q, modalService, $controller,
    breadcrumbsService, scrollService, $location, $timeout, $rootScope, $stateParams, contentService, Settings, locationService, userPreferenceService, chainService){

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){

      breadcrumbsService.clear().addBreadCrumb('Hotel Search');

      $controller('SSOCtrl', {$scope: scope});
      $controller('MainCtrl', {$scope: scope});
      //TODO: remove PreferenceCtrl and PreferenceService when fully switched to userPreferenceService
      //$controller('PreferenceCtrl', {$scope: scope});
      $controller('RatesCtrl', {$scope: scope});

      var mobiusUserPreferences = userPreferenceService.getCookie();

      scope.filterConfig = Settings.UI.hotelFilters;
      scope.displayPropertyChainBranding = Settings.UI.generics.applyChainClassToBody;
      scope.Math = window.Math;
      scope.config = Settings.UI.viewsSettings.hotels;
      
      scope.initSortingOptions = function(options){

        scope.sortingOptions = [
          {
            name: options.availability,
            sort: function(hotel){
              return -hotel.available;
            }
          },
          {
            name: options.priceLowToHigh,
            sort: function(hotel){
              return hotel.priceFrom;
            }
          },
          {
            name: options.priceHighToLow,
            sort: function(hotel){
              return 0 - hotel.priceFrom;
            }
          },
          {
            name: options.starRatingLowToHigh,
            sort: function(hotel){
              return hotel.rating;
            }
          },
          {
            name: options.starRatingHighToLow,
            sort: function(hotel){
              return 0 - hotel.rating;
            }
          },
          {
            name: 'A - Z',
            sort: function(hotel){
              return hotel.nameShort;
            }
          },
          {
            name: 'Z - A',
            sort: function(hotel){
              return -hotel.nameShort;
            }
          }
        ];

        /*
        USER PREFERENCE SETTINGS
        */

        // Default sorting by availability or price
        var defaultOrder = bookingService.APIParamsHasDates() ? 0 : 1;

        //order switch default value
        if(mobiusUserPreferences && mobiusUserPreferences.hotelsCurrentOrder){
          var index = _.findIndex(scope.sortingOptions, function(option) {
            return option.name === mobiusUserPreferences.hotelsCurrentOrder;
          });
          $timeout(function(){
            scope.currentOrder = scope.sortingOptions[index !== -1 ? index : defaultOrder];
          }, 0);
        }
        else{
          $timeout(function(){
            scope.currentOrder = scope.sortingOptions[defaultOrder];
          }, 0);
        }

        //save order switch value to cookies when changed
        scope.orderSwitchChange = function(selected){
          scope.currentOrder = selected;
          userPreferenceService.setCookie('hotelsCurrentOrder', selected.name);
        };
      };

      //hotel view default value
      if(mobiusUserPreferences && mobiusUserPreferences.hotelViewMode){
        scope.hotelViewMode = mobiusUserPreferences.hotelViewMode;
      }
      else{
        scope.hotelViewMode = 'tiles';
      }
      
      scope.setHotelViewMode = function(mode){
        userPreferenceService.setCookie('hotelViewMode', mode);
        scope.hotelViewMode = mode;
      };
      //scope.preference.setDefault('hotels-view-mode', 'tiles');

      scope.MIN_STARS = Settings.UI.hotelFilters.minStars;
      scope.MAX_STARS = Settings.UI.hotelFilters.maxStars;
      scope.MIN_RATING = Settings.UI.hotelFilters.minTaRating;
      scope.MAX_RATING = Settings.UI.hotelFilters.maxTaRating;

      scope.minStars = scope.MIN_STARS;
      scope.maxStars = scope.MAX_STARS;
      scope.minRating = scope.MIN_RATING;
      scope.maxRating = scope.MAX_RATING;

      //Handle region/location description
      if($stateParams.region && Settings.UI.viewsSettings.hotels.showRegionDescription){
        locationService.getRegion($stateParams.region).then(function(region){
          scope.regionDetails = region;
        });
      }


      function getProperties(params){

        // Loading hotels
        var hotelsPromise = propertyService.getAll(params).then(function(hotels){
          // Now API always returns full list of hotels, that will change in the future. Uncomment the line below to test future behaviour
          // hotels = undefined;

          chainService.getAll().then(function(chains){

            //Pick random merchandizing banner if any
            //assign chainTitle to be used on view
            _.each(hotels, function(hotel){

              //merchandizing banner
              if(hotel.merchandisingBanners && hotel.merchandisingBanners.length){
                hotel.merchandisingBanner = hotel.merchandisingBanners.length === 1 ? hotel.merchandisingBanners[0] : hotel.merchandisingBanners[Math.floor(hotel.merchandisingBanners.length * Math.random())];
              }

              //chain title
              _.each(chains, function(chain){
                if(hotel.chainCode === chain.code){
                  hotel.chainTitle = chain.title;
                }
              });

            });

            if($stateParams.locationSlug){
              scope.regionSlug = $stateParams.regionSlug || null;
              //Get locations
              locationService.getLocations().then(function(locations){
                var curLocation = _.find(locations, function(location){ return location.meta.slug === $stateParams.locationSlug; });
                
                if(curLocation){
                  if(Settings.UI.viewsSettings.hotels.showLocationDescription){
                    //hero slider
                    scope.updateHeroContent(curLocation.images);
                    //details
                    locationService.getLocation(curLocation.code).then(function(location){
                      scope.locationDetails = location;
                    });
                    //gallery
                    scope.previewImages = contentService.getLightBoxContent(curLocation.images, 300, 150, 'fill');
                  }
                  //filter hotels by location
                  scope.hotels = _.where(hotels, {locationCode: curLocation.code});
                }
                else{
                  scope.hotels = hotels || [];
                }
                
              });
            }
            else{
              scope.hotels = hotels || [];
            }

            //We need the region name to display
            if(scope.config.displayHotelRegionName){
              getHotelRegionName();
            }

            if(Settings.UI.generics.singleProperty){
              scope.navigateToHotel(scope.hotels[0].meta.slug);
            }

            //check if offer is limited to only one property and if so navigate to it
            if($stateParams.promoCode){
              var offerLimitedToOneProperty = [];
              var limitedToProperty = [];
              var limitedToPropertyCode = '';
              var currentOffer = '';

              contentService.getOffers().then(function(response) {
                var offersList = _.sortBy(response, 'prio').reverse();

                offerLimitedToOneProperty = _.filter(offersList, function(offer){
                  return offer.meta.slug === $stateParams.promoCode && offer.limitToPropertyCodes.length === 1;
                });

                if(offerLimitedToOneProperty.length){
                  limitedToPropertyCode = offerLimitedToOneProperty[0].limitToPropertyCodes[0];
                }

                limitedToProperty = _.find(hotels, function(hotel){ return hotel.code === limitedToPropertyCode; });

                if(limitedToProperty){
                  scope.navigateToHotel(limitedToProperty.meta.slug);
                  return;
                }

                if(currentOffer){
                  scope.hotels = _.filter(scope.hotels, function(hotel){
                    return _.contains(currentOffer.limitToPropertyCodes, hotel.code);
                  });
                }
              });
            }

            if(Settings.UI.hotelFilters.price){
              scope.minPrice = Math.floor(_.chain(scope.hotels).pluck('priceFrom').min());
              scope.maxPrice = Math.ceil(_.chain(scope.hotels).pluck('priceFrom').max());
              scope.minSelectedPrice = scope.minPrice;
              scope.maxSelectedPrice = scope.maxPrice;
            }
            
            //scroll to element if set in url scrollTo param
            var scrollToValue = $location.search().scrollTo || null;
            if (scrollToValue) {
              $timeout(function(){
                scrollService.scrollTo(scrollToValue, 20);
              }, 500);
            }

          });

          
        });

        preloaderFactory(hotelsPromise);
      }

      function getHotelRegionName(){
        locationService.getRegions().then(function(regions){
          locationService.getLocations().then(function(locations){
            _.each(scope.hotels, function(hotel){
              var hotelLocation = _.find(locations, function(location){ return location.code === hotel.locationCode; });
              var hotelRegion = _.find(regions, function(region){ return region.code === hotelLocation.regionCode; });
              hotel.regionName = hotelRegion.nameShort;
            });
          });
        });
      }

/*
      filtersService.getProducts(true).then(function(data) {
        scope.rates = data || [];
      });

      scope.onRateChange = function(){
        // Server side filtering
        var bookingParams = bookingService.getAPIParams(true);
        bookingParams.productGroupId = scope.selectedRate.id;

        // NOTE: Server side filtering by rate
        getProperties(bookingParams);

        updateRateFilteringInfo(scope.selectedRate);
      };

      // Updating notification bar
      function updateRateFilteringInfo(rate){
        notificationService.show('You are filtering by: ' + rate.name, 'notification-rate-filter-removed');
      }
*/

      scope.openGallery = function(slideIndex){
        modalService.openGallery(
          contentService.getLightBoxContent(scope.regionDetails.images),
          slideIndex);
      };

      // This function invoked from RatesCtrl
      scope.onRateChanged = function(rate){
        var bookingParams = bookingService.getAPIParams(true);

        bookingParams.productGroupId = rate?rate.id:scope.rates.defaultRate.id;
        getProperties(bookingParams);
      };

      scope.resetFilters = function() {
        scope.setMinStars(scope.MIN_STARS);
        scope.setMaxStars(scope.MAX_STARS);
        scope.setMinRating(scope.MIN_RATING);
        scope.setMaxRating(scope.MAX_RATING);
        scope.rates.selectedRate = null;
        filtersService.getBestRateProduct().then(function(rate){
          if(rate){
            scope.onRateChanged(rate);
          }
        });
      };

      scope.navigateToHotel = function(propertySlug){
        // Getting the current hotel
        var selectedHotel = _.find(scope.hotels, function (item) {
          return item && item.meta && item.meta.slug === propertySlug;
        });

        // Getting rate details from RateCtrl
        var stateParams = {
          property: selectedHotel ? selectedHotel.code : null,
          propertySlug: propertySlug,
          rate: (scope.rates && scope.rates.selectedRate)?scope.rates.selectedRate.id:null,
          promoCode: $stateParams.promoCode ? $stateParams.promoCode : null,
          corpCode: $stateParams.corpCode ? $stateParams.corpCode : null,
          groupCode: $stateParams.groupCode ? $stateParams.groupCode : null
        };

        if($state.params && $state.params.hasOwnProperty('fromSearch') && typeof $state.params.fromSearch !== 'undefined') {
          stateParams.scrollTo = 'jsRooms';
        }

        //if hotel details set active booking bar
        // TODO: Check if this is needed and how same codes should be
        // broadcasted?
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', stateParams);

        $state.go('hotel', stateParams);
      };

      /*
      scope.loadLocation = function() {
        //if(scope.location && scope.location.code) {
        //  preloaderFactory(locationService.getLocation(scope.location.code).then(function(location) {
        //    scope.locationDetails = location;
        //  }));
        //} else {
        //  scope.locationDetails = null;
        //}
      };*/

      // Getting the details from booking widget
      var bookingParams = bookingService.getAPIParams(true);

      if(bookingParams.productGroupId){
        getProperties(bookingParams);
      } else{
        // productGroupId is not set by the widget - getting default BAR
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }

          getProperties(bookingParams);
        });
      }

      scope.setMinStars = function(stars) {
        scope.minStars = stars;
        if(scope.maxStars < scope.minStars) {
          scope.maxStars = scope.minStars;
        }
      };

      scope.setMaxStars = function(stars) {
        scope.maxStars = stars;
        if(scope.minStars > scope.maxStars) {
          scope.minStars = scope.maxStars;
        }
      };

      scope.setMinRating = function(rating) {
        scope.minRating = rating;
        if(scope.maxRating < scope.minRating) {
          scope.maxRating = scope.minRating;
        }
      };

      scope.setMaxRating = function(rating) {
        scope.maxRating = rating;
        if(scope.minRating > scope.maxRating) {
          scope.minRating = scope.maxRating;
        }
      };

      scope.hotelFilter = function(hotel) {
        return (
          (Settings.UI.hotelFilters.price ? (scope.minSelectedPrice <= hotel.priceFrom && hotel.priceFrom <= scope.maxSelectedPrice) : true) &&
          (Settings.UI.hotelFilters.stars ? (scope.minStars <= hotel.rating && hotel.rating < (scope.maxStars + 1)) : true) &&
          (Settings.UI.hotelFilters.tripAdvisor ? (scope.minRating <= hotel.tripAdvisorRating && hotel.tripAdvisorRating < (scope.maxRating + 1)) : true) &&
          (!scope.location || !scope.location.code || (scope.location.code === hotel.locationCode)) &&
          (!bookingParams.regionCode || (bookingParams.regionCode === hotel.regionCode))
        );
      };

      scope.hasDates = function(){
        return bookingService.APIParamsHasDates();
      };

      scope.hotelAvailable = function(){
        var isAvailable = false;
        _.find(scope.hotels, function(hotel){
          if(hotel.available){
            isAvailable = true;
            return isAvailable;
          }
        });
        return isAvailable;
      };

      scope.showFilter = function(filter){
        return Settings.UI.hotelFilters[filter];
      };

      scope.selectDates = function(){
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
          openBookingTab: true,
          openDatePicker: true,
          promoCode: $stateParams.promoCode || null,
          corpCode: $stateParams.corpCode || null,
          groupCode: $stateParams.groupCode || null
        });
      };

      scope.openLocationDetail = modalService.openLocationDetail;
    }
  };
}]);
