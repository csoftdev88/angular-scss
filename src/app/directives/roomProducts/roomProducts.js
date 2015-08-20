'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, $state, $stateParams, _,
  Settings, filtersService, bookingService, propertyService, modalService,
  stateService){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

      function getRoomProducts(params){
        propertyService.getRoomProducts(params.propertyCode, params.roomCode, params).then(function(data){
          scope.products = data.products || [];
        }, function(){
          scope.products = [];
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

      scope.selectProduct = function(roomCode, productCode, isMemberOnly, roomPriceFrom, event){
        if(isMemberOnly === null && roomPriceFrom === null && !event){
          return;
        }

        if(event){
          event.preventDefault();
          event.stopPropagation();
        }else{
          if(!stateService.isMobile() || isMemberOnly && !scope.isUserLoggedIn() || !roomPriceFrom){
            return;
          }
        }

        var params = {
          property: scope.details.code,
          roomID: roomCode,
          productCode: productCode,
          promoCode: $stateParams.promoCode || null
        };

        $state.go('reservation.details', params);
      };

      scope.openPoliciesInfo = modalService.openPoliciesInfo;

      scope.isDateRangeSelected = bookingService.isDateRangeSelected;
      scope.openPriceBreakdownInfo = function(product) {
        var room = _.clone(scope.room);
        room._selectedProduct = product;

        return modalService.openPriceBreakdownInfo([room]);
      };
    }
  };
});
