'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
  bookingService, propertyService, filtersService, preloaderFactory, _,
  modalService, $state) {
  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){
      var SHORT_DESCRIPTION_LENGTH = 200;

      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      scope.propertyCode = propertyCode;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      var roomDetailsPromise = propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
        // Inherited from RoomDetailsCtrl
        scope.roomDetails = data;

        // Updating hero slider images
        var heroContent =  data.images.map(function(image){
          return {'image': image.uri};
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
      function getRoomProductDetails(propertyCode, roomCode, params) {
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data) {
          scope.products = _.map(_.where(data.products, {memberOnly: true})
            .concat(
            _.where(data.products, {highlighted: true}),
            _.reject(data.products, function(product) {
              return product.memberOnly || product.highlighted;
            })
          ), function(product) {
            var descriptionShort = angular.element(product.description).text();
            product.descriptionShort = descriptionShort.substr(0, SHORT_DESCRIPTION_LENGTH);
            product.hasViewMore = product.descriptionShort.length < descriptionShort;
            if(product.hasViewMore) {
              product.descriptionShort += '…';
            }
            return product;
          });
        });
      }

      scope.showMore = function(product, expanded) {
        product._expanded = expanded;
      };

      scope.selectProduct=function(product){
        $state.go('reservation.details', {productCode: product.code});
      };

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

      scope.onContinue = function(){
        if(!scope.selectedProduct){
          return;
        }

        $state.go('reservation', {
          roomID: roomCode,
          productCode: scope.selectedProduct.code
        });
      };
    }
  };
});
