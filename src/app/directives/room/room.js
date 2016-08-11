'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q, $window,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, metaInformationService, user, _,
  $controller,$location,$rootScope,scrollService,$timeout, dataLayerService, cookieFactory, chainService, userPreferenceService, $filter) {

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
      scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;
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
          if(Settings.UI.viewsSettings.breadcrumbsBar.displayPropertyTitle){
            breadcrumbsService.setHeader(property.nameLong);
          }

          return property;
        });

        $q.all([roomDetailsPromise, propertyPromise]).then(function(data) {

          if(data && data.length > 1){

            var roomData = data[0];
            var propertyData = data[1];

            //Get property region/location data for breadcrumbs
            propertyService.getPropertyRegionData(propertyData.locationCode).then(function(propertyRegionData){

              //breadcrumbs
              breadcrumbsService
                .addBreadCrumb(propertyRegionData.region.nameShort, 'regions', {regionSlug: propertyRegionData.region.meta.slug, property: null})
                .addBreadCrumb(propertyRegionData.location.nameShort, 'hotels', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, property: null})
                .addBreadCrumb(propertyData.nameShort, 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug})
                .addBreadCrumb('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsRooms'})
                .addBreadCrumb(roomData.roomDetails.name);

              //alt nav
              if(scope.config.hasBreadcrumbsSecondaryNav){
                breadcrumbsService
                .addAbsHref('About', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsAbout'})
                .addAbsHref('Location', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsLocation'})
                .addAbsHref('Offers', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsOffers'})
                .addAbsHref('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsRooms'})
                .addAbsHref('Gallery', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'fnOpenLightBox'});
              }

            });

            /*
            breadcrumbsService.clear()
              .addBreadCrumb('Hotels', 'hotels')
              .addBreadCrumb(data[1].nameShort, 'hotel', {propertyCode: propertyCode})
              .addBreadCrumb('Rooms', 'hotel', {propertySlug: bookingParams.propertySlug}, 'jsRooms')
              .addBreadCrumb(data[0].roomDetails.name);
              */

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
      function setRoomProductDetails(data) {
        var discountCookie = cookieFactory('discountCode');

        //reject productHidden if doesn't match discount cookie
        data.products = _.reject(data.products, function(product) {
            if(discountCookie){
              return product.productHidden && discountCookie.indexOf(product.code) === -1;
            }
            else{
              return product.productHidden;
            }
          });

        //create price.originalPrice from breakdowns
        _.each(data.products, function(product) {
          var originalPrice = 0;
          _.each(product.price.breakdowns, function(breakdown) {
            originalPrice += parseInt(breakdown.originalPrice, 10);
          });
          product.price.originalPrice = originalPrice;
        });


        //Logic for ordering products: Display 4 groups: productHidden/memberOnly/highlighted/remaining, each ordered by weighting, highest weighting first

        //hiddenProducts first
        var hiddenProducts = _.where(data.products, {productHidden: true});
        hiddenProducts = $filter('orderBy')(hiddenProducts, ['-weighting', 'price.totalBaseAfterPricingRules']);
        //displayedProducts.push(hiddenProducts);

        //memberOnly Products
        var memberOnlyProducts = _.where(data.products, {memberOnly: true});
        memberOnlyProducts = $filter('orderBy')(memberOnlyProducts, ['-weighting', 'price.totalBaseAfterPricingRules']);
        //displayedProducts.push(memberOnlyProducts);

        //highlighted Products
        var highlightedProducts = _.where(data.products, {highlighted: true});
        highlightedProducts = $filter('orderBy')(highlightedProducts, ['-weighting', 'price.totalBaseAfterPricingRules']);

        //default Products
        var defaultProducts = _.reject(data.products, function(product) {
          return product.productHidden === true || product.memberOnly === true || product.highlighted === true;
        });
        defaultProducts = $filter('orderBy')(defaultProducts, ['-weighting', 'price.totalBaseAfterPricingRules']);

        scope.products = _.uniq([].concat(hiddenProducts, memberOnlyProducts, highlightedProducts, defaultProducts));


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

              var availableRooms = [];
              _.forEach((property.availability && property.availability.rooms) || [], function(availableRoom) {
                var room = _.find(hotelRooms, {code: availableRoom.code});
                availableRooms.push(room);
              });

              //filter out duplicates
              availableRooms = _.uniq(availableRooms);

              //if using thumbnails
              if(scope.config.otherRooms.useThumbnails){
                //remove current room
                availableRooms = _.reject(availableRooms, function(room){ return room.code === scope.roomDetails.code;});
                var data = scope.roomDetails;

                var moreExpensiveRooms = availableRooms.filter(function(room) {return room.priceFrom > data.priceFrom;});
                var cheaperOrEqualRooms = availableRooms.filter(function(room) {return room.priceFrom <= data.priceFrom && room.code !== roomCode;});

                var sortedMoreExpensiveRooms = moreExpensiveRooms.sort(function(a, b) { return a.priceFrom - b.priceFrom;});

                // sortedCheaperRooms is sorted by price in descending order
                var sortedCheaperOrEqualRooms = cheaperOrEqualRooms.sort(function(a, b) { return b.priceFrom - a.priceFrom;});

                scope.otherRooms = sortedMoreExpensiveRooms.concat(sortedCheaperOrEqualRooms).slice(0,3);
              }
              else{
                var numRooms = availableRooms.length;
                var curRoomIndex;
                _.find(availableRooms, function(room, index){
                  if(room.code === scope.roomDetails.code){
                    curRoomIndex = index;
                  }
                });
                var prevIndex = curRoomIndex > 0 ? curRoomIndex - 1 : numRooms - 1;
                var nextIndex = curRoomIndex < numRooms -1 ? curRoomIndex + 1 : 0;
                scope.previousRoom = availableRooms[prevIndex];
                scope.nextRoom = availableRooms[nextIndex];
              }

              scope.otherRoomsLoading = false;
            });
        });
      };

      scope.goToRoom = function(pSlug, rSlug) {
        if($stateParams.promoCode){
          $state.go('room', {propertySlug: pSlug, roomSlug: rSlug, promoCode: $stateParams.promoCode});
        }
        else{
          $state.go('room', {propertySlug: pSlug, roomSlug: rSlug});
        }

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
              price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
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
                price: (product.price.totalBaseAfterPricingRules).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: 'Room',
                category: scope.roomDetails.name
              }]);
            });
          });
          if(scope.config.rateInfoIsTabbed){
            modalService.openProductDetailsDialog(scope.roomDetails, product, true);
          }
          else{
            modalService.openRoomDetailsDialog(product.description);
          }


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
