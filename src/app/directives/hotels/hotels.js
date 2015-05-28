'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'filtersService', 'bookingService',
  'propertyService', 'preloaderFactory',
  function($state, filtersService, bookingService, propertyService,
    preloaderFactory){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
      scope.sortingOptions = [
        {
          name: 'Availability',
          prop: 'available',
          value: true
        },
        {
          name: 'Price Low to High',
          prop: 'priceFrom',
          value: false
        },
        {
          name: 'Price High to Low',
          prop: 'priceFrom',
          value: true
        },
        {
          name: 'Star Rating Low to High',
          prop: 'rating',
          value: false
        },
        {
          name: 'Star Rating High to Low',
          prop: 'rating',
          value: true
        },
        {
          name: 'A - Z',
          prop: 'nameShort',
          value: false
        },
        {
          name: 'Z - A',
          prop: 'nameShort',
          value: true
        },
      ];

      // Default sorting by availability
      scope.currentOrder = scope.sortingOptions[0];
      scope.view = 'tiles';

      function getProperties(params){
        // Loading hotels
        preloaderFactory(
          propertyService.getAll(params).then(function(hotels){
            scope.hotels = hotels;
          })
        );
      }

      scope.navigateToHotel = function(hotelID){
        $state.go('hotel', {hotelID: hotelID});
      };

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
    }
  };
}]);
