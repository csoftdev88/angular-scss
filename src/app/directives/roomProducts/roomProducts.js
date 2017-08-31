'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, $state, $stateParams, _,
  Settings, filtersService, channelService, bookingService, propertyService, modalService, apiService, infinitiApeironService, mobiusTrackingService,
  stateService, dataLayerService, cookieFactory, chainService, $window, $log, $filter){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

      scope.currencyCode = stateService.getCurrentCurrency().code;

      var numNights = $window.moment(bookingParams.to).diff(bookingParams.from, 'days');

      scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;
      scope.settings = Settings.UI.hotelDetails.rooms.rates;
      scope.displayUpsells = Settings.UI.hotelDetails.rooms.upsells ? Settings.UI.hotelDetails.rooms.upsells.display : false;

      scope.init = function(){
        scope.products = undefined;

        // Using PGID from the booking params
        if(bookingParams.productGroupId){
          getRoomProducts(bookingParams);
        } else {
          filtersService.getBestRateProduct().then(function(brp){
            if(brp){
              bookingParams.productGroupId = brp.id;
              getRoomProducts(bookingParams);
            }
          });
        }
      };

      function getRoomProducts(params){
        propertyService.getRoomProducts(params.propertyCode, params.roomCode, params).then(function(data){

            //Get discount cookie
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

            //Hide products with a price of 0 and throw sentry error
            data.products = _.reject(data.products, function(product) {
                if(product.price.totalBaseAfterPricingRules > 0) {
                  return false;
                }
                else {
                  //Send the API request details to Sentry
                  var propertyRequestURL = apiService.getFullURL('properties.room.product.all', {
                    propertyCode: params.propertyCode,
                    roomTypeCode: params.roomCode
                  });
                  propertyRequestURL += '?' + apiService.objectToQueryParams(params);
                  $window.Raven.captureException('Rate returned as 0 - Product:' + product.code + ', Mobius Channel ID: ' + channelService.getChannel().channelID + ', Currency Code:' + stateService.getCurrentCurrency().code + ', Language code:' + stateService.getAppLanguageCode() + ', Api Request:' + propertyRequestURL);
                  return true;
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
            console.log('products', scope.products);

            scope.otaProducts = data.otaProducts;

            scope.isRequestedRateReturned = data.requestedRateReturned;

          // Tracking product impressions
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails(bookingParams.propertyCode).then(function(propertyData){
              // Send tracking data to infiniti
              infinitiApeironService.trackRates(
                scope.products,
                scope.otaProducts && scope.otaProducts[0] ? scope.otaProducts[0].price : 0,
                scope.room,
                dataLayerService.getCategoryName(propertyData, scope.room)
              );

              //Google analytics
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

              dataLayerService.listType = 'Rooms';
              dataLayerService.trackProductsImpressions(scope.products.map(function(p){
                return {
                  name: p.name,
                  id: p.code,
                  price: (p.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                  quantity: numNights,
                  dimension2: chainData.nameShort,
                  brand: propertyData.nameLong,
                  dimension1: propertyData.nameShort,
                  list: dataLayerService.listType,
                  category: scope.room ? dataLayerService.getCategoryName(propertyData,scope.room) : null,
                  variant: variant
                };
              }), stayLength, bookingWindow);

              var selectedRate = scope.rates ? scope.rates.selectedRate : null;

              //Mobius tracking
              mobiusTrackingService.trackSearch(bookingParams, chainData, propertyData, scope.products, scope.room, selectedRate);
              infinitiApeironService.trackSearch(chainData, propertyData, $stateParams, scope.currentOrder, scope.products, scope.room, selectedRate);
            });
          });

        }, function(){
          scope.products = null;
        });
      }

      /*
      function getRatesCacheTimeout(){
        return Settings.UI.hotelDetails &&
          Settings.UI.hotelDetails.ratesCacheTimeout?Settings.UI.hotelDetails.ratesCacheTimeout:0;
      }
      */

      scope.getRatesLimit = function(){
        return stateService.isMobile() ? scope.settings.ratesPerRoomOnMobile : scope.settings.ratesPerRoomOnDesktop;
      };

      scope.selectProduct = function(roomCode, productCode, isMemberOnly, roomPriceFrom, upsell, event){
        if(isMemberOnly === null && roomPriceFrom === null && !event){
          return;
        }

        if(event){
          event.preventDefault();
          event.stopPropagation();
        }else{
          if(!stateService.isMobile() || isMemberOnly && !scope.isUserLoggedIn() || !roomPriceFrom){
            return;
          }
        }

        var params = {
          property: scope.details.code,
          roomID: roomCode,
          productCode: productCode,
          promoCode: $stateParams.promoCode || null,
          locationSlug: $stateParams.locationSlug
        };

        var selectedProduct = _.findWhere(scope.products, {code: productCode});

        //If up sells enabled and available display up sell modal
        if(scope.displayUpsells && upsell) {
          modalService.openUpsellsDialog(upsell, params, scope.goToReservationDetails, selectedProduct);
        }
        //Otherwise advance to checkout
        else {
          scope.goToReservationDetails(selectedProduct, params, false);
        }
      };

      scope.goToReservationDetails = function(product, params, upsellAccepted){
        // GTM Tracking product click
        if(product){
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails(bookingParams.propertyCode || scope.details.code).then(function(propertyData){
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
              dataLayerService.listType = 'Rooms';
              dataLayerService.trackAddToCart({
                name: product.name,
                id: product.code,
                price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: dataLayerService.listType,
                category: scope.room ? dataLayerService.getCategoryName(propertyData,scope.room) : null,
                variant: variant
              }, upsellAccepted, stayLength, bookingWindow);
            });
          });
        }

        $state.go('reservation.details', params, {reload: true});
      };

      scope.isDateRangeSelected = bookingService.isDateRangeSelected;

      scope.openProductDetailsDialog = function(product){
        // Tracking product view
        chainService.getChain(Settings.API.chainCode).then(function(chainData) {
          propertyService.getPropertyDetails(bookingParams.propertyCode).then(function(propertyData){
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

            dataLayerService.listType = 'Rooms';
            dataLayerService.trackProductsDetailsView([{
              name: product.name,
              id: product.code,
              price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
              quantity: numNights,
              dimension2: chainData.nameShort,
              brand: propertyData.nameLong,
              dimension1: propertyData.nameShort,
              list: dataLayerService.listType,
              category: scope.room ? dataLayerService.getCategoryName(propertyData,scope.room) : null,
              variant: variant
            }], stayLength, bookingWindow);
          });
        });
        modalService.openProductDetailsDialog(scope.room, product, scope.settings.rateInfoIsTabbed);
      };

      scope.init();
    }
  };
});
