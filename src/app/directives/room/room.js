'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, _) {
  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      scope.propertyCode = propertyCode;
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

        /* Getting other rooms. We should show those that are closest in price but have a price that is
           greater than the currently viewed room. If there are not enough of them we can show the cheaper
           ones as well. */

        propertyService.getRooms(propertyCode)
          .then(function(hotelRooms){
            var moreExpensiveRooms = hotelRooms.filter(function(room) {return room.priceFrom > data.priceFrom;});
            var cheaperOrEqualRooms = hotelRooms.filter(function(room) {return room.priceFrom <= data.priceFrom && room.code !== roomCode;});

            var sortedMoreExpensiveRooms = moreExpensiveRooms.sort(function(a, b) { return a.priceFrom - b.priceFrom;});

            // sortedCheaperRooms is sorted by price in descending order
            var sortedCheaperOrEqualRooms = cheaperOrEqualRooms.sort(function(a, b) { return b.priceFrom - a.priceFrom;});

            scope.otherRooms = sortedMoreExpensiveRooms.concat(sortedCheaperOrEqualRooms).slice(0,3);
          });
      });

      preloaderFactory(roomDetailsPromise);

      // Room product details
      function getRoomProductDetails(propertyCode, roomCode, params){
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
          scope.products = _.where(data.products, {memberOnly : true})
            .concat(
              _.where(data.products, {highlighted : true}),
              _.reject(data.products, function(product){ return product.memberOnly || product.highlighted; })
            );
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

      scope.onClickOnAssociatedRoom=function(associatedRoom){
        modalService.openAssociatedRoomDetail(associatedRoom, propertyCode);
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
