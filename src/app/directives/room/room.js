'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q, $window,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, metaInformationService, user, _,
  $controller,$location,$rootScope,scrollService,$timeout, dataLayerService) {

  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){

      $controller('PriceCtr', {$scope: scope});
      $controller('RatesCtrl', {$scope: scope});

      scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;
      var bookingParams = bookingService.getAPIParams();
      scope.$stateParams = $stateParams;
      var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);
      scope.propertyCode = propertyCode;
      bookingParams.propertyCode = propertyCode;

      var roomCode = bookingService.getCodeFromSlug($stateParams.roomSlug);
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
            .addBreadCrumb('Rooms', 'hotel', {propertySlug: bookingParams.propertySlug}, 'jsRooms')
            .addBreadCrumb(data[0].roomDetails.name);

          scrollManager();

        }));
      });

      //Handle scrolling
      function scrollManager(){
        //scroll to element if set in url scrollTo param and actually exists on the page, otherwise scroll to default
        var scrollToValue = $location.search().scrollTo || null;
        if(scrollToValue){
          var scrollItem = scrollToValue.indexOf('.') === -1 ? angular.element('#'+scrollToValue) : angular.element(scrollToValue);
          scrollToValue = scrollItem.length ? scrollToValue : null;
        }
        var scrollOffset = scrollToValue ? 20 : 0;
        var ignoreScrollTo = scrollToValue ? false : true;

        $timeout(function(){
          scrollService.scrollTo(scrollToValue, scrollOffset, ignoreScrollTo);
        }, 100);

      }

      // Getting room details
      function setRoomData(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);
        metaInformationService.setMetaDescription(data.meta.description);
        metaInformationService.setMetaKeywords(data.meta.keywords);
        metaInformationService.setPageTitle(data.meta.pagetitle);
        data.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
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
        // Tracking product click
        dataLayerService.trackProductClick({
          name: product.name,
          code: product.code,
          price: product.price.totalBase
        });

        if($stateParams.promoCode){
          $state.go('reservation.details', {
            property: propertyCode,
            roomID: roomCode,
            productCode: product.code,
            promoCode: $stateParams.promoCode
          });
        }
        else{
          $state.go('reservation.details', {
            property: propertyCode,
            roomID: roomCode,
            productCode: product.code
          });
        }

      };

      scope.onClickOnAssociatedRoom = function(roomDetails){
        modalService.openAssociatedRoomDetail({roomDetails: roomDetails, propertySlug: bookingParams.propertySlug});
      };

      if(Settings.UI.roomDetails && Settings.UI.roomDetails.hasReadMore){
        scope.openRoomDetailsDialog = function(product){
          // Tracking product view
          dataLayerService.trackProductsDetailsView([{
            name: product.name,
            code: product.code,
            price: product.price.totalBase
          }]);

          modalService.openRoomDetailsDialog(product.description);
        };
      }

      // Checking if user have selected dates
      if(!bookingParams.from || !bookingParams.to){
        // Dates are not yet selected
        scope.hasDates = false;
        scope.selectDates = function(){
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
            openBookingTab: true,
            openDatePicker: true,
            promoCode: $stateParams.code
          });
        };
      }
      else{
        scope.hasDates = true;
      }

      scope.isOverAdultsCapacity = bookingService.isOverAdultsCapacity;
      scope.switchToMRBMode = bookingService.switchToMRBMode;
    }
  };
});
