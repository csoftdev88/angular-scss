'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
  bookingService, propertyService, filtersService, preloaderFactory) {
  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',

    // Widget logic goes here
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      var roomDetailsPromise = propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);

        // Updating hero slider images
        var heroContent =  data.images.map(function(image){
          return {'image': image.URI};
        });

        scope.updateHeroContent(heroContent);
      });

      preloaderFactory(roomDetailsPromise);

      // Room product details
      function getRoomProductDetails(propertyCode, roomCode, params){
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
          scope.products = data.products;

          scope.accordionStates = data.products.map(function(){
            return false;
          });

          selectBestProduct();
        });
      }

      scope.onSelectProduct=function(product){
        if(product === scope.selectedProduct){
          return;
        }

        // NOTE: Product must be always selected
        var productIndex = scope.products.indexOf(product);
        if(productIndex!==-1){
          scope.accordionStates[productIndex] = true;
          // NOTE: This function is inherited from RoomDetailsCtrl
          scope.selectProduct(product);
        }
      };

      function selectBestProduct(){
        // Note: Currently BAR doesn't have code provided so we are matching name against our settings
        // This should be fixed later on the API side.
        var bestProduct = $window._.findWhere(scope.products,
          {name: Settings.bestAvailableRateCode}
        );

        if(bestProduct){
          scope.onSelectProduct(bestProduct);
        }
      }

      if(bookingParams.productGroupId){
        getRoomProductDetails(propertyCode, roomCode, bookingParams);
      } else{
        // productGroupId is not set by the widget - getting default BAR
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }

          getRoomProductDetails(propertyCode, roomCode, bookingParams);
        });
      }
    }
  };
});
