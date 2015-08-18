'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, _, Settings, filtersService,
    bookingService, propertyService, modalService){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      //if(!scope.room || !scope.details.meta.slug){
      //  return;
      //}

//      $controller('SanitizeCtrl', {$scope: scope});
//      $controller('PriceCtr', {$scope: scope});

      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

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
        var room = _.clone(scope.room);
        room._selectedProduct = product;

        return modalService.openPriceBreakdownInfo([room]);
      };
    }
  };
});
