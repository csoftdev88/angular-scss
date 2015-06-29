'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, user, _) {

  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){

      var SHORT_DESCRIPTION_LENGTH = 200;

      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.propertyCode;
      scope.propertyCode = propertyCode;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      function setRoomData(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);

        /* Getting other rooms. We should show those that are closest in price but have a price that is
           greater than the currently viewed room. If there are not enough of them we can show the cheaper
           ones as well. */

        return propertyService.getRooms(propertyCode)
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
        scope.products = _.map(
          [].concat(
          _.where(data.products, {memberOnly: true}),
          _.where(data.products, {highlighted: true}),
          _.reject(data.products, function(product) {
            return product.memberOnly || product.highlighted;
          })
        ), function(product) {
          var descriptionShort = angular.element(product.description).text();
          product.descriptionShort = descriptionShort.substr(0, SHORT_DESCRIPTION_LENGTH);
          product.hasViewMore = product.descriptionShort.length < descriptionShort.length;
          if (product.hasViewMore) {
            product.descriptionShort += '…';
          }
          return product;
        });
      }

      scope.setRoomsSorting = function() {
        return user.isLoggedIn() ? ['-highlighted']: ['-memberOnly', '-highlighted'];
      };

      scope.selectProduct = function(product) {
        $state.go('reservation.details', {
          property: propertyCode,
          roomID: roomCode,
          productCode: product.code
        });
      };

      var roomDetailsPromise = scope.getRoomData(propertyCode, roomCode, bookingParams).then(function(data) {
        setRoomProductDetails(data.roomProductDetails);
        return setRoomData(data.roomDetails).then(function() {
          return data;
        });
      }, function() {
        $state.go('hotel', {
          propertyCode: propertyCode
        });
      });

      var propertyPromise = propertyService.getPropertyDetails(propertyCode);

      preloaderFactory($q.all([roomDetailsPromise, propertyPromise]).then(function(data) {
        breadcrumbsService.clear()
          .addBreadCrumb(data[1].nameShort, 'hotel', {propertyCode: propertyCode})
          .addBreadCrumb('Rooms', 'hotel', {propertyCode: propertyCode}, 'jsRooms')
          .addBreadCrumb(data[0].roomDetails.name);
      }));

      scope.onClickOnAssociatedRoom=function(roomDetails){
        modalService.openAssociatedRoomDetail({roomDetails: roomDetails, propertyCode: propertyCode});
      };
    }
  };
});
