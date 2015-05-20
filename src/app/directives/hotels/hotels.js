'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'bookingService',
  'propertyService', function($state, bookingService, propertyService){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
      // View settings
      scope.sorting = {};
      scope.view = 'tiles';

      scope.sortings = [
        'Price Low to High',
        'Price High to Low',
        'Star Rating Low to High',
        'Star Rating High to Low',
        'A - Z',
        'Z - A'
      ];

      // Getting the details from booking widget
      var bookingParams = bookingService.getAPIParams(true);
      // Loading hotels
      propertyService.getAll(bookingParams).then(function(hotels){
        scope.hotels = hotels;
      });

      scope.navigateToHotel = function(hotelID){
        $state.go('hotel', {hotelID: hotelID});
      };
    }
  };
}]);
