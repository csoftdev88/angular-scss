'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function(_, Settings, filtersService,
    bookingService, propertyService, modalService){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: {
      roomDetails: '=',
      propertySlug: '='
    },

    link: function(scope){
      if(!scope.roomDetails || !scope.propertySlug){
        return;
      }

      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.propertySlug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.roomDetails.meta.slug);

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


      if(Settings.UI.roomDetails && Settings.UI.roomDetails.hasReadMore){
        scope.openRoomDetailsDialog = modalService.openRoomDetailsDialog;
      }

      scope.openPoliciesInfo = modalService.openPoliciesInfo;

      scope.openPriceBreakdownInfo = function(product) {
        var room = _.clone(scope.roomDetails);
        room._selectedProduct = product;

        return modalService.openPriceBreakdownInfo([room]);
      };
    }
  };
});
