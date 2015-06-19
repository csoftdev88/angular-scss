'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
<<<<<<< HEAD
  bookingService, propertyService, filtersService, preloaderFactory, _,
  modalService, $state) {
=======
  bookingService, propertyService, filtersService, modalService, preloaderFactory, _) {
>>>>>>> feature/96864354/as-a-user-when-i-click
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
      function setRoomData(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);

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
      }

      // Room product details
      function setRoomProductDetails(data) {
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
          if (product.hasViewMore) {
            product.descriptionShort += '…';
          }
          return product;
        });
      }

      scope.selectProduct = function(product) {
        $state.go('reservation.details', {
          roomID: roomCode,
          productCode: product.code
        });
      };

      var promise = scope.getRoomData(propertyCode, roomCode, bookingParams).then(function(data) {
        setRoomData(data.roomDetails);
        setRoomProductDetails(data.roomProductDetails);
      });

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

      preloaderFactory(promise);
    }
  };
});
