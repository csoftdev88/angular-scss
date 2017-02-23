'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $state, Settings, breadcrumbsService, $q, $window, stateService,
  bookingService, propertyService, filtersService, modalService, preloaderFactory, metaInformationService, user, _,
  $controller,$location,$rootScope,scrollService,$timeout, contentService, dataLayerService, cookieFactory, chainService, channelService, userPreferenceService, $filter) {

  return {
    restrict: 'E',
    templateUrl: channelService.getChannel().name === 'meta' && Settings.UI.roomDetails.showMetaView ? 'directives/room/roomMeta.html' : 'directives/room/room.html',
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
      bookingParams.includes = 'amenities';
      var numNights = $window.moment(bookingParams.to).diff(bookingParams.from, 'days');
      scope.$stateParams = $stateParams;
      var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);
      scope.propertyCode = propertyCode;
      bookingParams.propertyCode = propertyCode;
      scope.viewSettings = Settings.UI.viewsSettings.roomDetails;
      scope.hasViewMore = scope.viewSettings && scope.viewSettings.hasViewMore;
      scope.showLocalInfo = Settings.UI.roomDetails.showLocalInfo;
      scope.displayUpsells = Settings.UI.roomDetails.upsells ? Settings.UI.roomDetails.upsells.display : false;

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
              return product.price.totalAfterTaxAfterPricingRules;
            }
          },
          {
            name: options.priceHighToLow,
            sort: function(product){
              return 0 - product.price.totalAfterTaxAfterPricingRules;
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
        var roomDetailsPromise = scope.getRoomData(propertyCode, roomCode, bookingParams, null).then(function(data) {
          scope.ratesLoaded = true;
          setRoomProductDetails(data.roomProductDetails);
          scope.roomDetails = data.roomDetails;

          // Preview content
          if(scope.fromMeta)
          {
            scope.previewImages = contentService.getLightBoxContent(scope.roomDetails.images, 300, 150, 'fill');
          }

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
              if($stateParams.regionSlug && $stateParams.locationSlug)
              {
                breadcrumbsService
                  .addBreadCrumb(propertyRegionData.region.nameShort, 'regions', {regionSlug: propertyRegionData.region.meta.slug, property: null})
                  .addBreadCrumb(propertyRegionData.location.nameShort, 'hotels', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, property: null});
              }
              else {
                breadcrumbsService.addBreadCrumb('Hotels', 'hotels');
              }

              breadcrumbsService
                .addBreadCrumb(propertyData.nameShort, 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug})
                .addBreadCrumb('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsRooms'})
                .addBreadCrumb(roomData.roomDetails.name);

              //alt nav
              if(scope.config.hasBreadcrumbsSecondaryNav && !scope.fromMeta){
                breadcrumbsService
                .addAbsHref('About', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsAbout'})
                .addAbsHref('Location', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsLocation'})
                .addAbsHref('Offers', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsOffers'})
                .addAbsHref('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'jsRooms'})
                .addAbsHref('Gallery', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: propertyData.meta.slug, scrollTo: 'fnOpenLightBox'});
              }
              else if(scope.config.hasBreadcrumbsSecondaryNav && scope.fromMeta){
                breadcrumbsService.addHref('About', 'jsAbout');
                breadcrumbsService.addHref('Rates', 'jsProducts');
                breadcrumbsService.addHref('The-Property', 'jsAboutProperty');
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

        //If from meta scroll to products
        if(scope.fromMeta)
        {
          ignoreScrollTo = false;
          scrollToValue = 'jsProducts';
        }

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
        scope.altProduct = data.altProduct;

        //STUB ALT PRODUCTS
        scope.altProduct = {
          'code': '*CHAIN-EARLY7MO',
          'image':{
            'uri':'//res.cloudinary.com/dmh2cjswj/image/upload/w_1680,h_530,c_fill/q_auto,f_auto/v1470350075/biwq9wpo1nduzm2q8qx8.jpg',
            'alt':'product image'
          },
          'partialAvailability':{
            'code':'mi',
            'type':'MinLOS (Minimum Length of Stay)',
            'variable':3
          },
          'productHidden': false,
          'productAwardPoints': true,
          'allowPointsBooking': false,
          'name': 'Members Only Rate',
          'description': '<p>\n    Early Bird Promotion. Save 30% off Standard Rate. Must book at least 7 days in advance. Subject to availability, taxes, and applicable fees. Cannot be combined with other offers. Blackout dates and other restrictions apply.</p>',
          'tagline': 'Not a member, not a problem. Quickly join for free while you book.',
          'icon': null,
          'marketingMessage': {
            'enabled': false
          },
          'weighting': 951,
          'package': {
            'code': 1,
            'name': 'Standard Package',
            'description': null,
            'canCustomise': false
          },
          'productPropertyRoomTypeId': 167891,
          'policies': [
            {
              'type': 'cancellation',
              'value': 'C7',
              'description': '<p>\n\tReservations cancelled within 7 days of arrival will be charged penalty equal to 1 night room rate, taxes and applicable fees. Important Note: Bitcoin bookings are not confirmed until payment has been received. Once confirmed, Bitcoin bookings are non-refundable.</p>',
              'showWarning': false
            }
          ],
          'guarantees': {
            'cc': true,
            'corp': false,
            'bitcoin': true
          },
          'price': {
            'averageBasePrice': 182.445,
            'averageBaseTax': 27.36675,
            'feeDetails': {
              'totalTax': 0,
              'policyTaxItemDetails': []
            },
            'formatting': 'slashThrough',
            'highestDailyRate': 139.8745,
            'lowestDailyRate': 139.8745,
            'packagePrice': 0,
            'taxDetails': {
              'totalTax': 54.7335,
              'policyTaxItemDetails': [
                {
                  'policyTaxItem': {
                    'policyTaxItemID': 36,
                    'policyTaxItemCode': 'GST',
                    'policyTaxItemAmount': 5,
                    'policyTaxItemDateFrom': 1364774400000,
                    'policyTaxItemDateTo': 1924905600000,
                    'policyTaxItemIsFee': false,
                    'policyTaxItemDescription': 'Goods & Services Tax'
                  },
                  'taxAmount': 18.2445
                }
              ]
            },
            'totalAdditionalFees': 0,
            'totalAdditionalTaxes': 0,
            'totalAfterTax': 139.8745,
            'totalAfterTaxAfterPricingRules': 139.8745,
            'totalAfterTaxBeforePricingRules': 139.8745,
            'totalBase': 364.89,
            'totalBaseAfterPricingRules': 364.89,
            'totalBaseBeforePricingRules': 364.89,
            'totalDiscount': 0,
            'totalDiscountApplyFirst': 0,
            'totalDiscountApplyLast': 0,
            'breakdowns': [
              {
                'date': '2017-03-15',
                'originalPrice': 173.76,
                'taxDetails': {
                  'totalTax': 18.2445,
                  'policyTaxItemDetails': [
                    {
                      'policyTaxItem': {
                        'policyTaxItemID': 36,
                        'policyTaxItemCode': 'GST',
                        'policyTaxItemAmount': 5,
                        'policyTaxItemDateFrom': 1364774400000,
                        'policyTaxItemDateTo': 1924905600000,
                        'policyTaxItemIsFee': false,
                        'policyTaxItemDescription': 'Goods & Services Tax'
                      },
                      'taxAmount': 6.0815
                    }
                  ]
                },
                'totalAfterTax': 139.8745,
                'totalAfterTaxAfterPricingRules': 139.8745,
                'totalAfterTaxBeforePricingRules': 139.8745,
                'totalBase': 121.63,
                'totalBaseAfterPricingRules': 121.63,
                'totalBaseBeforePricingRules': 121.63,
                'totalFees': 0,
                'totalFeesBeforePricingRules': 0,
                'totalTax': 18.2445,
                'totalTaxBeforePricingRules': 18.2445
              }
            ],
            'pointsRequired': null
          },
          'minTier': 'member',
          'memberOnly': true,
          'highlighted': false,
          'IRI': '/properties/ABB/rooms/EXKN/products/*CHAIN-EARLY7MO',
          'inclusions':[{
            'inclusionName':'APPLE'
          },{
            'inclusionName':'APPLE'
          },{
            'inclusionName':'APPLE'
          }],
          'priceOriginal': {
            'averageBasePrice': 182.445,
            'averageBaseTax': 27.36675,
            'feeDetails': {
              'totalTax': 0,
              'policyTaxItemDetails': []
            },
            'formatting': 'slashThrough',
            'highestDailyRate': 139.8745,
            'lowestDailyRate': 139.8745,
            'packagePrice': 0,
            'taxDetails': {
              'totalTax': 54.7335,
              'policyTaxItemDetails': [
                {
                  'policyTaxItem': {
                    'policyTaxItemID': 36,
                    'policyTaxItemCode': 'GST',
                    'policyTaxItemAmount': 5,
                    'policyTaxItemDateFrom': 1364774400000,
                    'policyTaxItemDateTo': 1924905600000,
                    'policyTaxItemIsFee': false,
                    'policyTaxItemDescription': 'Goods & Services Tax'
                  },
                  'taxAmount': 18.2445
                }
              ]
            },
            'totalAdditionalFees': 0,
            'totalAdditionalTaxes': 0,
            'totalAfterTax': 139.8745,
            'totalAfterTaxAfterPricingRules': 139.8745,
            'totalAfterTaxBeforePricingRules': 139.8745,
            'totalBase': 364.89,
            'totalBaseAfterPricingRules': 364.89,
            'totalBaseBeforePricingRules': 364.89,
            'totalDiscount': 0,
            'totalDiscountApplyFirst': 0,
            'totalDiscountApplyLast': 0,
            'breakdowns': [
              {
                'date': '2017-03-16',
                'originalPrice': 173.76,
                'taxDetails': {
                  'totalTax': 18.2445,
                  'policyTaxItemDetails': [
                    {
                      'policyTaxItem': {
                        'policyTaxItemID': 36,
                        'policyTaxItemCode': 'GST',
                        'policyTaxItemAmount': 5,
                        'policyTaxItemDateFrom': 1364774400000,
                        'policyTaxItemDateTo': 1924905600000,
                        'policyTaxItemIsFee': false,
                        'policyTaxItemDescription': 'Goods & Services Tax'
                      },
                      'taxAmount': 6.0815
                    }
                  ]
                },
                'totalAfterTax': 139.8745,
                'totalAfterTaxAfterPricingRules': 139.8745,
                'totalAfterTaxBeforePricingRules': 139.8745,
                'totalBase': 121.63,
                'totalBaseAfterPricingRules': 121.63,
                'totalBaseBeforePricingRules': 121.63,
                'totalFees': 0,
                'totalFeesBeforePricingRules': 0,
                'totalTax': 18.2445,
                'totalTaxBeforePricingRules': 18.2445
              }
            ],
            'pointsRequired': null
          }
        };
        //END STUB ALT PRODUCTS

        if(scope.config.displayAltProduct && scope.altProduct){
          $timeout(function(){
            scope.$broadcast('ALTERNATIVE_PRODUCT_ALERT_BROADCAST', scope.roomDetails, scope.altProduct, scope.products);
          });
        }

        if($stateParams.viewAllRates && $stateParams.viewAllRates === '1'){
          scope.roomRatesLimit = scope.products.length;
        }
        else{
          scope.showViewMoreRates = scope.products.length > scope.roomRatesLimit;
        }

        //If no products available, show the booking bar
        if(!scope.products || scope.products.length === 0){
          $rootScope.$broadcast('floatingBarEvent', {
            isCollapsed: false
          });
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
                if(room)
                {
                  availableRooms.push(room);
                }
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
        var params = {};

        if($stateParams.promoCode){
          params = {
            property: propertyCode,
            roomID: roomCode,
            productCode: product.code,
            promoCode: $stateParams.promoCode,
            locationSlug: $stateParams.locationSlug
          };
        }
        else{
          params = {
            property: propertyCode,
            roomID: roomCode,
            productCode: product.code,
            locationSlug: $stateParams.locationSlug
          };
        }

        if(scope.displayUpsells && product.upSell) {
          modalService.openUpsellsDialog(product.upSell, params, scope.goToReservationDetails, product);
        }
        else {
          scope.goToReservationDetails(product, params, false);
        }
      };

      scope.goToReservationDetails = function(product, params, upsellAccepted){
        // GTM Tracking product click
        if(product){
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
              var localeData = propertyData.locale;
              var localeArray = localeData ? propertyData.locale.split('-') : null;
              if(localeArray && localeArray.length > 1)
              {
                localeData = localeArray[1].trim();
              }
              var category = localeData + '/' + propertyData.city + '/' + propertyData.nameShort + '/Rooms/' + scope.roomDetails.name;
              var variant = '';
              if($stateParams.adults && $stateParams.children)
              {
                variant = $stateParams.adults + ' Adult ' + $stateParams.children + ' Children';
              }
              var stayLength = null;
              var bookingWindow = null;

              if ($stateParams.dates) {
                var checkInDate = $window.moment.tz($stateParams.dates.split('_')[0], Settings.UI.bookingWidget.timezone).startOf('day');
                var checkOutDate = $window.moment.tz($stateParams.dates.split('_')[1], Settings.UI.bookingWidget.timezone).startOf('day');
                var today = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day');
                stayLength = checkOutDate.diff(checkInDate, 'days');
                bookingWindow = checkInDate.diff(today, 'days');
              }
              dataLayerService.trackAddToCart({
                name: product.name,
                id: product.code,
                price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: 'Room',
                category: category,
                variant: variant
              }, upsellAccepted, stayLength, bookingWindow);
            });
          });
        }

        var userLang = user.getUserLanguage();
        var appLang = stateService.getAppLanguageCode();
        if (Settings.sandmanFrenchOverride && (appLang === 'fr' || userLang === 'fr')) {
          user.storeUserLanguage('en-us');
          var nonFrenchUrl = $state.href('reservation.details', params).replace('/fr/','/');
          $window.location.replace(nonFrenchUrl);
        }
        else {
          $state.go('reservation.details', params);
        }
      };

      scope.onClickOnAssociatedRoom = function(roomDetails){
        roomDetails.config = scope.config;
        modalService.openAssociatedRoomDetail({roomDetails: roomDetails, propertySlug: bookingParams.propertySlug});
      };

      if(Settings.UI.roomDetails && Settings.UI.roomDetails.hasReadMore){
        scope.openRoomDetailsDialog = function(product){
          // Tracking product view
          /*chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
            var localeData = propertyData.locale;
            var localeArray = localeData ? propertyData.locale.split('-') : null;
            if(localeArray && localeArray.length > 1)
            {
              localeData = localeArray[1].trim();
            }
              var category = localeData + '/' + propertyData.city + '/' + propertyData.nameShort + '/Rooms/' + scope.roomDetails.name;
              var variant = '';
              if($stateParams.adults && $stateParams.children)
              {
                variant = $stateParams.adults + ' Adult ' + $stateParams.children + ' Children';
              }
              dataLayerService.trackProductsDetailsView([{
                name: product.name,
                id: product.code,
                price: (product.price.totalBaseAfterPricingRules).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: 'Room',
                category: category,
                variant: variant
              }]);
            });
          });*/
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
