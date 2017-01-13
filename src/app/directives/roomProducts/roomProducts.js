'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, $state, $stateParams, _,
  Settings, filtersService, channelService, bookingService, propertyService, modalService, apiService, infinitiApeironService,
  stateService, dataLayerService, cookieFactory, chainService, $window, $log, $filter, user){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

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

            scope.otaProducts = data.otaProducts;

          // Tracking product impressions
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property || bookingParams.propertyCode).then(function(propertyData){
              //Google analytics
              dataLayerService.trackProductsImpressions(scope.products.map(function(p){
                return {
                  name: p.name,
                  id: p.code,
                  price: (p.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                  quantity: numNights,
                  dimension2: chainData.nameShort,
                  brand: propertyData.nameLong,
                  dimension1: propertyData.nameShort,
                  list: 'Rooms',
                  category: scope.room.name
                };
              }));

              var selectedRate = null;
              if(scope.rates && scope.rates.selectedRate)
              {
                selectedRate = scope.rates.selectedRate;
              }
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
          promoCode: $stateParams.promoCode || null
        };

        var selectedProduct = _.findWhere(scope.products, {code: productCode});

        //If upsells enabled and available display upsell modal
        if(scope.displayUpsells && upsell) {
          modalService.openUpsellsDialog(upsell, params, scope.goToReservationDetails, selectedProduct);
        }
        //Otherwise advance to checkout
        else {
          scope.goToReservationDetails(selectedProduct, params, false);
        }
      };

      scope.goToReservationDetails = function(product, params){
        // GTM Tracking product click
        if(product){
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property || scope.details.code).then(function(propertyData){
              dataLayerService.trackProductClick({
                name: product.name,
                id: product.code,
                price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                quantity: numNights,
                dimension2: chainData.nameShort,
                brand: propertyData.nameLong,
                dimension1: propertyData.nameShort,
                list: 'Rooms',
                category: scope.room.name
              });
            });
          });
        }

        var userLang = user.getUserLanguage();
        var appLang = stateService.getAppLanguageCode();
        if (Settings.sandmanFrenchOverride && (appLang === 'fr' || userLang === 'fr')) {
          user.storeUserLanguage('en-us');
          var nonFrenchUrl = $state.href('reservation.details', params, {reload: true}).replace('/fr/','/');
          $window.location.replace(nonFrenchUrl);
        }
        else {
          $state.go('reservation.details', params, {reload: true});
        }
      };

      scope.isDateRangeSelected = bookingService.isDateRangeSelected;

      scope.openProductDetailsDialog = function(product){
        // Tracking product view
        chainService.getChain(Settings.API.chainCode).then(function(chainData) {
          propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
            dataLayerService.trackProductsDetailsView([{
              name: product.name,
              id: product.code,
              price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
              quantity: numNights,
              dimension2: chainData.nameShort,
              brand: propertyData.nameLong,
              dimension1: propertyData.nameShort,
              list: 'Rooms',
              category: scope.room.name
            }]);
          });
        });
        modalService.openProductDetailsDialog(scope.room, product, scope.settings.rateInfoIsTabbed);
      };

      scope.init();
    }
  };
});
