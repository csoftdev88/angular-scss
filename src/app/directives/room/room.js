'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q, $window,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, metaInformationService, user, _,
  $controller,$location,$rootScope,scrollService,$timeout, dataLayerService, cookieFactory, chainService, userPreferenceService) {

  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){

      $controller('PriceCtr', {$scope: scope});
      $controller('RatesCtrl', {$scope: scope});

      scope.ratesLoaded = false;
      scope.isFromSearch = $stateParams.fromSearch && $stateParams.fromSearch === '1';
      scope.roomRatesLimit = Settings.UI.roomDetails.numberOfRatesToShow;
      scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;
      scope.config = Settings.UI.roomDetails;
      var bookingParams = bookingService.getAPIParams();
      var numNights = $window.moment(bookingParams.to).diff(bookingParams.from, 'days');
      scope.$stateParams = $stateParams;
      var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);
      scope.propertyCode = propertyCode;
      bookingParams.propertyCode = propertyCode;

      var roomCode = bookingService.getCodeFromSlug($stateParams.roomSlug);
      bookingParams.roomCode = roomCode;

      var propertyPromise;
      var qBookingParam = $q.defer();

      //Get room details
      propertyService.getRoomDetails(propertyCode, roomCode).then(function(data) {
        scope.roomDetails = data;
      });


      // Sorting options
      scope.initSortingOptions = function(options){
        scope.sortingOptions = [
          {
            name: options.priceLowToHigh,
            sort: function(product){
              return product.price.totalAfterTax;
            }
          },
          {
            name: options.priceHighToLow,
            sort: function(product){
              return 0 - product.price.totalAfterTax;
            }
          }
        ];

        if(Settings.UI.hotelDetails.rooms.sortRoomsByWeighting){
          scope.sortingOptions.splice(0, 0, {
            name: options.recommended,
            sort: function(product){
              //return [0 - product.productHidden, 0 - product.weighting];
              return - product.weighting;
            }
          });
        }

        /*
        USER PREFERENCE SETTINGS
        */
        var mobiusUserPreferences = userPreferenceService.getCookie();
        //order switch default value
        if(mobiusUserPreferences && mobiusUserPreferences.hotelCurrentOrder){
          var index = _.findIndex(scope.sortingOptions, function(option) {
            return option.name === mobiusUserPreferences.hotelCurrentOrder;
          });
          scope.currentOrder = scope.sortingOptions[index !== -1 ? index : 0];
        }
        else{
          scope.currentOrder = scope.sortingOptions[0];
        }

        //save order switch value to cookies when changed
        scope.orderSwitchChange = function(selected){
          userPreferenceService.setCookie('hotelCurrentOrder', selected.name);
        };

      };

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
          scope.ratesLoaded = true;
          setRoomProductDetails(data.roomProductDetails);
          scope.roomDetails = data.roomDetails;
          setRoomData(data.roomDetails);
          $timeout(function(){
            scope.loadMoreRooms();
          }, 0);
          return data;
          /*
          return setRoomData(data.roomDetails).then(function() {
            return data;
          });
          */
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

        $q.all([roomDetailsPromise, propertyPromise]).then(function(data) {
          
          if(data && data.length > 1){
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(data[1].nameShort, 'hotel', {propertyCode: propertyCode})
              .addBreadCrumb('Rooms', 'hotel', {propertySlug: bookingParams.propertySlug}, 'jsRooms')
              .addBreadCrumb(data[0].roomDetails.name);

            scrollManager();
          }
          
        });
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

      }

      // Room product details
      //TODO check about product.memberOnly || product.highlighted
      function setRoomProductDetails(data) {
        var discountCookie = cookieFactory('discountCode');
        scope.products = _.uniq([].concat(
            _.where(data.products, {memberOnly: true}),
            _.where(data.products, {highlighted: true}),
            _.reject(data.products, function(product) {
              if(discountCookie){
                return product.productHidden && discountCookie.indexOf(product.code) === -1;
              }
              else{
                return product.productHidden;
              }
            })
        ));
        
        if($stateParams.viewAllRates && $stateParams.viewAllRates === '1'){
          scope.roomRatesLimit = scope.products.length;
        }
        else{
          scope.showViewMoreRates = scope.products.length > scope.roomRatesLimit;
        }
        $stateParams.viewAllRates = null;
      }

      scope.showAllRates = function(){
        scope.showViewMoreRates = false;
        scope.roomRatesLimit = scope.products.length;
      };

      scope.loadMoreRooms = function(){
        scope.otherRoomsLoading = true;
        return propertyPromise.then(function(property) {
          return propertyService.getRooms(propertyCode)
            .then(function(hotelRooms){

              //remove current room
              hotelRooms = _.reject(hotelRooms, function(room){ return room.code === scope.roomDetails.code;});

              var data = scope.roomDetails;
              var moreExpensiveRooms = hotelRooms.filter(function(room) {return room.priceFrom > data.priceFrom;});
              var cheaperOrEqualRooms = hotelRooms.filter(function(room) {return room.priceFrom <= data.priceFrom && room.code !== roomCode;});

              var sortedMoreExpensiveRooms = moreExpensiveRooms.sort(function(a, b) { return a.priceFrom - b.priceFrom;});

              // sortedCheaperRooms is sorted by price in descending order
              var sortedCheaperOrEqualRooms = cheaperOrEqualRooms.sort(function(a, b) { return b.priceFrom - a.priceFrom;});

              scope.otherRooms = sortedMoreExpensiveRooms.concat(sortedCheaperOrEqualRooms).slice(0,3);
              scope.otherRoomsLoading = false;

              $window._.forEach((property.availability && property.availability.rooms) || [], function(availableRoom) {
                var room = $window._.find(scope.otherRooms, {code: availableRoom.code});
                if(room) {
                  $window._.extend(room, availableRoom);
                }
              });
            });
        });
      };
      

      scope.setRoomsSorting = function() {
        return user.isLoggedIn() ? ['-highlighted']: ['-memberOnly', '-highlighted'];
      };

      scope.selectProduct = function(product) {
        // Tracking product click
        chainService.getChain(Settings.API.chainCode).then(function(chainData) {
          propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
            dataLayerService.trackProductClick({
              name: product.name,
              id: product.code,
              price: (product.price.totalBase/numNights).toFixed(2),
              quantity: numNights,
              dimension2: chainData.nameShort,
              brand: propertyData.nameLong,
              dimension1: propertyData.nameShort,
              list: 'Room',
              category: scope.roomDetails.name
            });
          });
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
        roomDetails.config = scope.config;
        modalService.openAssociatedRoomDetail({roomDetails: roomDetails, propertySlug: bookingParams.propertySlug});
      };

      if(Settings.UI.roomDetails && Settings.UI.roomDetails.hasReadMore){
        scope.openRoomDetailsDialog = function(product){
          // Tracking product view
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
              dataLayerService.trackProductsDetailsView([{
                name: product.name,
                id: product.code,
                price: (product.price.totalBase).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: 'Room',
                category: scope.roomDetails.name
              }]);
            });
          });

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
