'use strict';

angular.module('mobiusApp.directives.room.altRoomProperties', [])

  .directive('altRoomProperties', function($rootScope, Settings, locationService, $stateParams, $state, routerService, _) {
    return {
      restrict: 'E',
      templateUrl: 'directives/altRoomProperties/altRoomProperties.html',
      scope: {
        properties: '='
      },
      replace: false,
      link: function(scope) {
        scope.config = Settings.UI.viewsSettings.hotels;
        scope.displayPropertyChainBranding = Settings.UI.generics.applyChainClassToBody;
        scope.hotelFilters = Settings.UI.hotelFilters;
        scope.filterConfig = {};
        _.each(Settings.UI.hotelFilters, function(filter) {
          scope.filterConfig[filter.type] = filter;
        });

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
            stateParams.property = null;
            $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', stateParams);
            $state.go('hotel', stateParams, {
              reload: true
            });
          });
        };

        function setHotelUrl(property) {
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
            stateParams.property = null;
            property.url = $state.href('hotel', stateParams, {
              reload: true
            });
          });
        }

        function getHotelRegionName() {
          locationService.getRegions().then(function(regions) {
            locationService.getLocations().then(function(locations) {
              _.each(scope.properties, function(hotel) {
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

        //We need the region name to display
        if (scope.config.displayHotelRegionName) {
          getHotelRegionName();
        }

        _.each(scope.properties, function(hotel){
          //merchandizing banner
          if (hotel.merchandisingBanners && hotel.merchandisingBanners.length) {
            hotel.merchandisingBanner = hotel.merchandisingBanners.length === 1 ? hotel.merchandisingBanners[0] : hotel.merchandisingBanners[Math.floor(hotel.merchandisingBanners.length * Math.random())];
          }
          setHotelUrl(hotel);
        });
      }
    };
  });
