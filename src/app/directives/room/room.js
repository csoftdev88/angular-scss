'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q, $window,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, metaInformationService, user, _,
  $controller,$location) {

  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){

      $controller('PriceCtr', {$scope: scope});
      $controller('RatesCtrl', {$scope: scope});

      //var SHORT_DESCRIPTION_LENGTH = 200;

      var bookingParams = bookingService.getAPIParams();
      scope.$stateParams = $stateParams;
      var propertySplits = bookingParams.propertySlug.split('-');
      var propertyCode = propertySplits[1];
      scope.propertyCode = propertyCode;
      bookingParams.propertyCode = propertyCode;

      var roomSplits = $stateParams.roomSlug.split('-');
      var roomCode = roomSplits[1].replace(/_/g, '-');
      bookingParams.roomCode = roomCode;

      var propertyPromise;
      var qBookingParam = $q.defer();

      // Using PGID from the booking params
      if(bookingParams.productGroupId){
        qBookingParam.resolve(bookingParams);
      } else {
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }
          qBookingParam.resolve(bookingParams);
        });
      }

      qBookingParam.promise.then(function(bookingParams) {
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

        propertyPromise = propertyService.getPropertyDetails(propertyCode, bookingParams).then(function(property) {
          scope.property = property;
          if(!scope.property.hasOwnProperty('available')) {
            scope.property.available = true;
          }

          return property;
        });

        preloaderFactory($q.all([roomDetailsPromise, propertyPromise]).then(function(data) {
          breadcrumbsService.clear()
            .addBreadCrumb('Hotels', 'hotels')
            .addBreadCrumb(data[1].nameShort, 'hotel', {propertyCode: propertyCode})
            .addBreadCrumb('Rooms', 'hotel', {propertyCode: propertyCode}, 'jsRooms')
            .addBreadCrumb(data[0].roomDetails.name);
        }));
      });

      // Getting room details
      function setRoomData(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);
        metaInformationService.setMetaDescription(data.meta.description);
        metaInformationService.setPageTitle(data.meta.pagetitle);
        data.meta.microdata.og['og:url'] = $location.absUrl();
        metaInformationService.setOgGraph(data.meta.microdata.og);
        /* Getting other rooms. We should show those that are closest in price but have a price that is
           greater than the currently viewed room. If there are not enough of them we can show the cheaper
           ones as well. */

        return propertyPromise.then(function(property) {
          return propertyService.getRooms(propertyCode)
            .then(function(hotelRooms){
              var moreExpensiveRooms = hotelRooms.filter(function(room) {return room.priceFrom > data.priceFrom;});
              var cheaperOrEqualRooms = hotelRooms.filter(function(room) {return room.priceFrom <= data.priceFrom && room.code !== roomCode;});

              var sortedMoreExpensiveRooms = moreExpensiveRooms.sort(function(a, b) { return a.priceFrom - b.priceFrom;});

              // sortedCheaperRooms is sorted by price in descending order
              var sortedCheaperOrEqualRooms = cheaperOrEqualRooms.sort(function(a, b) { return b.priceFrom - a.priceFrom;});

              scope.otherRooms = sortedMoreExpensiveRooms.concat(sortedCheaperOrEqualRooms).slice(0,3);

              $window._.forEach((property.availability && property.availability.rooms) || [], function(availableRoom) {
                var room = $window._.find(scope.otherRooms, {code: availableRoom.code});
                if(room) {
                  $window._.extend(room, availableRoom);
                }
              });
            });
        });
      }

      // Room product details
      function setRoomProductDetails(data) {
        //scope.products = _.map(
        //  [].concat(
        //  _.where(data.products, {memberOnly: true}),
        //  _.where(data.products, {highlighted: true}),
        //  _.reject(data.products, function(product) {
        //    return product.memberOnly || product.highlighted;
        //  })
        //), function(product) {
        //  // NOTE: product.description is a plain text
        //  var descriptionShort = product.description;
        //  product.descriptionShort = descriptionShort.substr(0, SHORT_DESCRIPTION_LENGTH);
        //  product.hasViewMore = product.descriptionShort.length < descriptionShort.length;
        //  if (product.hasViewMore) {
        //    product.descriptionShort += '…';
        //  }
        //  return product;
        //});
        scope.products = [].concat(
            _.where(data.products, {memberOnly: true}),
            _.where(data.products, {highlighted: true}),
            _.reject(data.products, function(product) {
              return product.memberOnly || product.highlighted;
            })
        );
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

      scope.onClickOnAssociatedRoom=function(roomDetails){
        modalService.openAssociatedRoomDetail({roomDetails: roomDetails, propertyCode: propertyCode});
      };
    }
  };
});
