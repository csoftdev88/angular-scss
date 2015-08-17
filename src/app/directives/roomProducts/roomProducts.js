'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function(filtersService, bookingService, propertyService){
  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: {
      roomSlug: '=',
      propertySlug: '='
    },

    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.propertySlug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.roomSlug);

      function getRoomProducts(params){
        propertyService.getRoomProducts(params.propertyCode, params.roomCode, params).then(function(data){
          scope.products = data.products;
        });
      }

      // Using PGID from the booking params
      if(bookingParams.productGroupId){
        getRoomProducts(bookingParams);
      } else {
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
            getRoomProducts(bookingParams);
          }
        });
      }
    }
  };
});
