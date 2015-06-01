'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
  bookingService, propertyService, filtersService, preloaderFactory) {
  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',

    // Widget logic goes here
    link: function(scope){
      var _productSelectWatcher;

      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      var roomDetailsPromise = propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
        console.log(data, 'roomDetails');
        scope.details = data;

        // Updating room hero slider images
        var heroContent =  data.images.map(function(image){
          return {'image': image.URI};
        });

        scope.updateHeroContent(heroContent);
      });

      preloaderFactory(roomDetailsPromise);

      // Room product details
      function getRoomProductDetails(propertyCode, roomCode, params){
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
          console.log(data, 'room products');
          scope.products = data.products;

          scope.isOpen = data.products.map(function(){
            return false;
          });


          unbindProductWatcher();
          scope.$watch('isOpen', function(newSelection, oldSelection){
            onProductSelected(newSelection, oldSelection);
          }, true);

          selectBestProduct();
        });
      }

      function onProductSelected(newSelection, oldSelection){
        console.log(newSelection, oldSelection);
      }

      function selectBestProduct(){
        // Note: Currently BAR doesn't have code provided so we are matching name against our settings
        // This should be fixed later on the API side.
        var bestProduct = $window._.findWhere(scope.products,
          {name: Settings.bestAvailableRateCode}
        );

        if(bestProduct){
          // NOTE: This function is inherited from RoomDetailsCtrl
          scope.selectProduct(bestProduct);
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

      function unbindProductWatcher(){
        if($window._.isFunction(_productSelectWatcher)){
          _productSelectWatcher();
        }
      }

      scope.oneAtATime = true;

      // Removing event listeners
      scope.$on('$destroy', function(){
        unbindProductWatcher();
      });
    }
  };
});
