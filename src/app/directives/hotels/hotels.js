/*global google */
'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'filtersService', 'bookingService',
  'propertyService', 'preloaderFactory', '_', 'user', 'NgMap',
  '$q', 'modalService', '$controller', 'breadcrumbsService', 'scrollService', '$location', '$timeout', '$rootScope', '$stateParams', 'contentService', 'Settings', 'locationService', 'userPreferenceService', 'chainService', 'routerService', 'stateService',
  function($state, filtersService, bookingService, propertyService,
    preloaderFactory, _, user, NgMap, $q, modalService, $controller,
    breadcrumbsService, scrollService, $location, $timeout, $rootScope, $stateParams, contentService, Settings, locationService, userPreferenceService, chainService, routerService, stateService) {

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/hotels/hotels.html',

      // Widget logic goes here
      link: function(scope) {

        breadcrumbsService.clear();

        $controller('SSOCtrl', {
          $scope: scope
        });
        $controller('MainCtrl', {
          $scope: scope
        });
        //TODO: remove PreferenceCtrl and PreferenceService when fully switched to userPreferenceService
        //$controller('PreferenceCtrl', {$scope: scope});
        $controller('RatesCtrl', {
          $scope: scope
        });

        var mobiusUserPreferences = userPreferenceService.getCookie();
        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';

        scope.hotelFilters = Settings.UI.hotelFilters;
        scope.filterConfig = {};
        _.each(Settings.UI.hotelFilters, function(filter) {
          scope.filterConfig[filter.type] = filter;
        });

        scope.displayPropertyChainBranding = Settings.UI.generics.applyChainClassToBody;
        scope.Math = window.Math;
        scope.config = Settings.UI.viewsSettings.hotels;
        scope.isMobile = stateService.isMobile();
        scope.compareEnabled = !scope.isMobile && scope.config.displayCompare && $stateParams.locationSlug;
        scope.isLocationPage = $stateParams.locationSlug ? true : false;
        scope.compareHotelLimit = 3;
        scope.comparisonIndex = 0;
        scope.selectedHotel = {};

        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport) {
          scope.isMobile = viewport.isMobile;
          scope.compareEnabled = !scope.isMobile && scope.config.displayCompare && $stateParams.locationSlug;
        });

        //Handle region/location description
        if ($stateParams.region && Settings.UI.viewsSettings.hotels.showRegionDescription) {
          locationService.getRegion($stateParams.region).then(function(region) {
            scope.regionDetails = region;
            scope.openGallery = function(slideIndex) {
              modalService.openGallery(
                contentService.getLightBoxContent(scope.regionDetails.images),
                slideIndex);
            };
          });
        }

        function getProperties(params) {

          //force request for amenities
          params.include = 'amenities';

          // Loading hotels
          var hotelsPromise = propertyService.getAll(params).then(function(hotels) {

            //Pick random merchandizing banner if any
            _.each(hotels, function(hotel) {

              hotel.userHidden = false;
              hotel.displayMarkerTooltip = false;

              //merchandizing banner
              if (hotel.merchandisingBanners && hotel.merchandisingBanners.length) {
                hotel.merchandisingBanner = hotel.merchandisingBanners.length === 1 ? hotel.merchandisingBanners[0] : hotel.merchandisingBanners[Math.floor(hotel.merchandisingBanners.length * Math.random())];
              }

              scope.setHotelUrl(hotel);
            });

            if ($stateParams.locationSlug) {
              scope.regionSlug = $stateParams.regionSlug || null;
              //Get locations
              locationService.getLocations().then(function(locations) {
                var curLocation = _.find(locations, function(location) {
                  return location.meta.slug === $stateParams.locationSlug;
                });

                //breadcrumbs
                addBreadCrumbs(curLocation);

                if (curLocation) {

                  //hero slider
                  scope.updateHeroContent(curLocation.images);

                  if (Settings.UI.viewsSettings.hotels.showLocationDescription) {

                    //get current location
                    locationService.getLocation(curLocation.code).then(function(location) {

                      //details
                      scope.locationDetails = location;

                      if (scope.config.bookingStatistics && scope.config.bookingStatistics.display && scope.locationDetails.statistics) {
                        $timeout(function() {
                          scope.$broadcast('STATS_GROWL_ALERT', scope.locationDetails.statistics);
                        });
                      }

                      //gallery
                      scope.previewImages = contentService.getLightBoxContent(location.images, 300, 150, 'fill');
                      //gallery lightbox
                      scope.openGallery = function(slideIndex) {
                        modalService.openGallery(
                          contentService.getLightBoxContent(location.images),
                          slideIndex);
                      };
                    });
                  }
                  //filter hotels by location
                  scope.hotels = _.where(hotels, {
                    locationCode: curLocation.code
                  });

                  scope.compareHotels = scope.hotels;
                  initPriceFilter();
                } else {
                  scope.hotels = hotels || [];
                  scope.compareHotels = scope.hotels;
                  initPriceFilter();
                }

              });
            } else {
              scope.hotels = hotels || [];
              scope.compareHotels = scope.hotels;
              initPriceFilter();
              addBreadCrumbs();
            }


            //We need the region name to display
            if (scope.config.displayHotelRegionName) {
              getHotelRegionName();
            }

            if (Settings.UI.generics.singleProperty) {
              scope.navigateToHotel(scope.hotels[0]);
            }

            //check if offer is limited to only one property and if so navigate to it
            if ($stateParams.promoCode) {
              var offerLimitedToOneProperty = [];
              var limitedToProperty = [];
              var limitedToPropertyCode = '';
              var currentOffer = '';

              contentService.getOffers().then(function(response) {
                var offersList = _.sortBy(response, 'prio').reverse();

                offerLimitedToOneProperty = _.filter(offersList, function(offer) {
                  return offer.meta.slug === $stateParams.promoCode && offer.limitToPropertyCodes.length === 1;
                });

                if (offerLimitedToOneProperty.length) {
                  limitedToPropertyCode = offerLimitedToOneProperty[0].limitToPropertyCodes[0];
                }

                limitedToProperty = _.find(hotels, function(hotel) {
                  return hotel.code === limitedToPropertyCode;
                });

                if (limitedToProperty) {
                  scope.navigateToHotel(limitedToProperty);
                  return;
                }

                if (currentOffer) {
                  scope.hotels = _.filter(scope.hotels, function(hotel) {
                    return _.contains(currentOffer.limitToPropertyCodes, hotel.code);
                  });
                  scope.compareHotels = scope.hotels;
                }
              });
            }

            //scroll to element if set in url scrollTo param
            var scrollToValue = $location.search().scrollTo || null;
            if (scrollToValue) {
              $timeout(function() {
                scrollService.scrollTo(scrollToValue, 20);
              }, 500);
            }

          });

          preloaderFactory(hotelsPromise);
        }

        function getHotelRegionName() {
          locationService.getRegions().then(function(regions) {
            locationService.getLocations().then(function(locations) {
              _.each(scope.hotels, function(hotel) {
                var hotelLocation = _.find(locations, function(location) {
                  return location.code === hotel.locationCode;
                });
                var hotelRegion = _.find(regions, function(region) {
                  return region.code === hotelLocation.regionCode;
                });
                hotel.regionName = hotelRegion.nameShort;
              });
            });
          });
        }

        /////////////
        //Breadcrumbs
        /////////////
        function addBreadCrumbs(location) {
          if (location) {
            locationService.getRegions().then(function(regions) {
              var region = _.find(regions, function(region) {
                return region.code === location.regionCode;
              });
              breadcrumbsService.addBreadCrumb(region.nameShort, 'regions', {
                regionSlug: $stateParams.regionSlug,
                property: null
              });
              breadcrumbsService.addBreadCrumb(location.nameShort);
            });
          } else {
            breadcrumbsService.addBreadCrumb('Hotel Search');
          }
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

        scope.openGallery = function(slideIndex) {
          modalService.openGallery(
            contentService.getLightBoxContent(scope.regionDetails.images),
            slideIndex);
        };

        scope.setHotelUrl = function(property) {
          // Getting rate details from RateCtrl
          var stateParams = {
            rate: (scope.rates && scope.rates.selectedRate) ? scope.rates.selectedRate.id : null,
            promoCode: $stateParams.promoCode ? $stateParams.promoCode : null,
            corpCode: $stateParams.corpCode ? $stateParams.corpCode : null,
            groupCode: $stateParams.groupCode ? $stateParams.groupCode : null
          };

          if ($state.params && $state.params.hasOwnProperty('fromSearch') && typeof $state.params.fromSearch !== 'undefined') {
            stateParams.scrollTo = 'jsRooms';
          }

          var paramsData = {};
          paramsData.property = property;
          routerService.buildStateParams('hotel', paramsData).then(function(params) {
            stateParams = _.extend(stateParams, params);
            property.url = $state.href('hotel', stateParams, {
              reload: true
            });
          });
        };

        scope.navigateToHotel = function(property) {
          // Getting rate details from RateCtrl
          var stateParams = {
            rate: (scope.rates && scope.rates.selectedRate) ? scope.rates.selectedRate.id : null,
            promoCode: $stateParams.promoCode ? $stateParams.promoCode : null,
            corpCode: $stateParams.corpCode ? $stateParams.corpCode : null,
            groupCode: $stateParams.groupCode ? $stateParams.groupCode : null
          };

          if ($state.params && $state.params.hasOwnProperty('fromSearch') && typeof $state.params.fromSearch !== 'undefined') {
            stateParams.scrollTo = 'jsRooms';
          }

          var paramsData = {};
          paramsData.property = property;
          routerService.buildStateParams('hotel', paramsData).then(function(params) {
            stateParams = _.extend(stateParams, params);
            $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', stateParams);
            $state.go('hotel', stateParams, {
              reload: true
            });
          });
        };

        // Getting the details from booking widget
        var bookingParams = bookingService.getAPIParams(true);

        if (bookingParams.productGroupId) {
          getProperties(bookingParams);
        } else {
          // productGroupId is not set by the widget - getting default BAR
          filtersService.getBestRateProduct().then(function(brp) {
            if (brp) {
              bookingParams.productGroupId = brp.id;
            }

            getProperties(bookingParams);
          });
        }

        ////////////////
        ///Filters
        ////////////////

        //price filter
        function initPriceFilter() {
          if (scope.filterConfig.price.enable) {
            scope.minPrice = Math.floor(_.chain(scope.hotels).pluck('priceFrom').min());
            scope.maxPrice = Math.ceil(_.chain(scope.hotels).pluck('priceFrom').max());
            scope.minSelectedPrice = scope.minPrice;
            scope.maxSelectedPrice = scope.maxPrice;
          }
        }

        //chain filter
        if (scope.filterConfig.chain) {
          chainService.getAll().then(function(chains) {
            scope.filterChains = chains;
          });
        }

        //tags filter
        if (scope.filterConfig.tags.enable) {

          //options
          scope.filterTagOptions = scope.filterConfig.tags.filters;

          //create label
          scope.createTagFilterOptionLabel = function(string, tagName) {
            return string.replace('{tag}', tagName);
          };

          var noTagFilterSelected = true;
          scope.tagFilterChange = function() {
            for (var option in scope.filterTagOptions) {
              if (scope.filterTagOptions[option].checked) {
                noTagFilterSelected = false;
                return;
              }
            }
            noTagFilterSelected = true;
          };

          scope.filterByTags = function(hotel) {
            if (noTagFilterSelected) {
              return true;
            }

            var display = false;

            for (var option in scope.filterTagOptions) {
              var filter = scope.filterTagOptions[option];
              if (filter.checked) {
                //if hotel doesn't have tags, remove it
                if (!hotel.tags || !hotel.tags.length) {
                  return false;
                }
                //else check if hotel tags includes any of the filter tags
                else {
                  for (var tag in hotel.tags) {
                    if (_.contains(filter.tags, hotel.tags[tag])) {
                      display = true;
                    }
                  }
                }
              }
            }

            return display;
          };
        }

        scope.initSortingOptions = function(options) {

          scope.sortingOptions = [{
            name: options.availability,
            sort: function(hotel) {
              return -hotel.available;
            }
          }, {
            name: options.priceLowToHigh,
            sort: function(hotel) {
              return hotel.priceFrom;
            }
          }, {
            name: options.priceHighToLow,
            sort: function(hotel) {
              return 0 - hotel.priceFrom;
            }
          }, {
            name: options.starRatingLowToHigh,
            sort: scope.hasDates ? ['rating', 'priceFrom', 'nameShort'] : ['rating', 'nameShort']
          }, {
            name: options.starRatingHighToLow,
            sort: scope.hasDates ? ['-rating', 'priceFrom', 'nameShort'] : ['-rating', 'nameShort']
          }, {
            name: 'A - Z',
            sort: function(hotel) {
              return hotel.nameShort;
            }
          }, {
            name: 'Z - A',
            sort: function(hotel) {
              return -hotel.nameShort;
            }
          }];

          /*
          USER PREFERENCE SETTINGS
          */

          // Default sorting by availability or price
          var defaultOrder = bookingService.APIParamsHasDates() ? 0 : 1;

          //order switch default value
          if (mobiusUserPreferences && mobiusUserPreferences.hotelsCurrentOrder) {
            var index = _.findIndex(scope.sortingOptions, function(option) {
              return option.name === mobiusUserPreferences.hotelsCurrentOrder;
            });
            $timeout(function() {
              scope.currentOrder = scope.sortingOptions[index !== -1 ? index : defaultOrder];
            }, 0);
          } else {
            $timeout(function() {
              scope.currentOrder = scope.sortingOptions[defaultOrder];
            }, 0);
          }

          //save order switch value to cookies when changed
          scope.orderSwitchChange = function(selected) {
            scope.currentOrder = selected;
            userPreferenceService.setCookie('hotelsCurrentOrder', selected.name);
          };
        };

        if (mobiusUserPreferences && mobiusUserPreferences.hotelViewMode) {
          if (!$stateParams.locationSlug) {
            if (mobiusUserPreferences.hotelViewMode !== 'compare') {
              scope.hotelViewMode = mobiusUserPreferences.hotelViewMode;
            } else {
              scope.hotelViewMode = scope.config.defaultViewMode ? scope.config.defaultViewMode : 'tiles';
            }
          } else {
            scope.hotelViewMode = mobiusUserPreferences.hotelViewMode;
          }
        } else {
          scope.hotelViewMode = scope.config.defaultViewMode ? scope.config.defaultViewMode : 'tiles';
        }

        scope.setHotelViewMode = function(mode) {
          userPreferenceService.setCookie('hotelViewMode', mode);
          scope.hotelViewMode = mode;
        };


        scope.MIN_STARS = scope.filterConfig.stars.minStars;
        scope.MAX_STARS = scope.filterConfig.stars.maxStars;
        scope.MIN_RATING = scope.filterConfig.tripAdvisor.minTaRating;
        scope.MAX_RATING = scope.filterConfig.tripAdvisor.maxTaRating;

        scope.minStars = scope.MIN_STARS;
        scope.maxStars = scope.MAX_STARS;
        scope.minRating = scope.MIN_RATING;
        scope.maxRating = scope.MAX_RATING;

        // This function invoked from RatesCtrl
        scope.onRateChanged = function(rate) {
          var bookingParams = bookingService.getAPIParams(true);

          bookingParams.productGroupId = rate ? rate.id : scope.rates.defaultRate.id;
          getProperties(bookingParams);
        };

        scope.resetFilters = function() {
          scope.setMinStars(scope.MIN_STARS);
          scope.setMaxStars(scope.MAX_STARS);
          scope.setMinRating(scope.MIN_RATING);
          scope.setMaxRating(scope.MAX_RATING);
          scope.rates.selectedRate = null;
          filtersService.getBestRateProduct().then(function(rate) {
            if (rate) {
              scope.onRateChanged(rate);
            }
          });
        };

        scope.setMinStars = function(stars) {
          scope.minStars = stars;
          if (scope.maxStars < scope.minStars) {
            scope.maxStars = scope.minStars;
          }
        };

        scope.setMaxStars = function(stars) {
          scope.maxStars = stars;
          if (scope.minStars > scope.maxStars) {
            scope.minStars = scope.maxStars;
          }
        };

        scope.setMinRating = function(rating) {
          scope.minRating = rating;
          if (scope.maxRating < scope.minRating) {
            scope.maxRating = scope.minRating;
          }
        };

        scope.setMaxRating = function(rating) {
          scope.maxRating = rating;
          if (scope.minRating > scope.maxRating) {
            scope.minRating = scope.maxRating;
          }
        };

        scope.hotelFilter = function(hotel) {
          return (
            (scope.filterConfig.price.enable ? (scope.minSelectedPrice <= hotel.priceFrom && hotel.priceFrom <= scope.maxSelectedPrice) : true) &&
            (scope.filterConfig.stars.enable ? (scope.minStars <= hotel.rating && hotel.rating < (scope.maxStars + 1)) : true) &&
            (scope.filterConfig.tripAdvisor.enable ? (scope.minRating <= hotel.tripAdvisorRating && hotel.tripAdvisorRating < (scope.maxRating + 1)) : true) &&
            (!scope.location || !scope.location.code || (scope.location.code === hotel.locationCode)) &&
            (!bookingParams.regionCode || (bookingParams.regionCode === hotel.regionCode)) &&
            (scope.filterConfig.chain.enable && angular.isDefined(scope.chainFilter) ? scope.chainFilter === hotel.chainCode : true)
          );
        };

        ////////////////
        ///Helpers
        ////////////////

        scope.hasDates = function() {
          return bookingService.APIParamsHasDates();
        };

        scope.hotelAvailable = function() {
          var isAvailable = false;
          _.find(scope.hotels, function(hotel) {
            if (hotel.available) {
              isAvailable = true;
              return isAvailable;
            }
          });
          return isAvailable;
        };

        scope.showFilter = function(filter) {
          return scope.filterConfig[filter].enable;
        };

        scope.selectDates = function(property) {
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            openBookingTab: true,
            openDatePicker: true,
            promoCode: $stateParams.promoCode || null,
            corpCode: $stateParams.corpCode || null,
            groupCode: $stateParams.groupCode || null,
            property: property.code
          });
        };

        scope.openLocationDetail = modalService.openLocationDetail;

        scope.hideHotel = function(hotel) {
          hotel.userHidden = true;
          scope.showCompareHotelsReset = true;
        };

        scope.resetCompareHotels = function() {
          _.each(scope.compareHotels, function(hotel) {
            hotel.userHidden = false;
          });
          scope.showCompareHotelsReset = false;
        };

        scope.shiftHotelCarousel = function(forward) {
          if (forward) {
            scope.comparisonIndex++;
          } else {
            scope.comparisonIndex--;
          }
        };

        scope.mapSettings = {};
        scope.mapSettings.bounds = new google.maps.LatLngBounds();
        scope.mapSettings.zoom = 7;

        $rootScope.$on('mapInitialized', function(evt,map) {
          scope.map = map;
          scope.$apply();
          generateMarkers();
        });

        scope.showMarker = function(evt, markerId) {
          scope.marker = scope.markers[markerId];
          scope.map.showInfoWindow('foo', this);
        };

        function centerMap() {
          scope.mapSettings.bounds = new google.maps.LatLngBounds();
          _.each(scope.markers, function(marker) {
            mapExtendBounds(marker.position[0], marker.position[1]);
          });
          scope.map.setCenter(scope.mapSettings.bounds.getCenter());
          scope.map.fitBounds(scope.mapSettings.bounds);
        }

        function generateMarkers() {
          scope.markersArray = [];
          _.each(scope.filteredHotels, function(hotel) {
            var marker = {
              position: [hotel.lat, hotel.long],
              hotel: hotel
            };
            scope.markersArray.push(marker);
          });
          scope.markers = scope.markersArray;
          centerMap();
        }

        function mapExtendBounds(latitude, longitude) {
          var markerLatLng = new google.maps.LatLng(latitude, longitude, true);
          scope.mapSettings.bounds.extend(markerLatLng);
        }

        google.maps.event.addDomListener(window, 'resize', function() {
          centerMap();
        });

        scope.$watch('filteredHotels', function(newValue, oldValue) {
          if (newValue !== oldValue && scope.map && scope.mapSettings.bounds) {
            generateMarkers();
          }
        });
      }
    };
  }
]);
