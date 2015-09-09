'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, $state, $stateParams, _,
  Settings, filtersService, bookingService, propertyService, modalService,
  stateService, dataLayerService){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

      scope.init = function(){
        scope.products = undefined;

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
      };

      function getRoomProducts(params){
        propertyService.getRoomProducts(params.propertyCode, params.roomCode, params,
          getRatesCacheTimeout()).then(function(data){
          scope.products = data.products || [];

          // Tracking product impressions
          dataLayerService.trackProductsImpressions(scope.products.map(function(p){
            return {
              name: p.name,
              code: p.code,
              price: p.price.totalBase
            };
          }));
        }, function(){
          scope.products = null;
        });
      }

      function getRatesCacheTimeout(){
        return Settings.UI.hotelDetails &&
          Settings.UI.hotelDetails.ratesCacheTimeout?Settings.UI.hotelDetails.ratesCacheTimeout:0;
      }

      scope.settings = Settings.UI.hotelDetails.rooms.rates;

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

        var selectedProduct = _.findWhere(scope.products, {code: productCode});

        if(selectedProduct){
          dataLayerService.trackProductClick({
            name: selectedProduct.name,
            code: selectedProduct.code,
            price: selectedProduct.price.totalBase
          });
        }

        $state.go('reservation.details', params);
      };

      scope.isDateRangeSelected = bookingService.isDateRangeSelected;

      scope.openProductDetailsDialog = function(product){
        // Tracking product view
        dataLayerService.trackProductsDetailsView([{
          name: product.name,
          code: product.code,
          price: product.price.totalBase
        }]);

        modalService.openProductDetailsDialog(scope.room, product);
      };

      scope.init();
    }
  };
});
