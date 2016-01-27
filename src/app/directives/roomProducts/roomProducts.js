'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function($controller, $state, $stateParams, _,
  Settings, filtersService, bookingService, propertyService, modalService,
  stateService, dataLayerService, cookieFactory, chainService){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: false,
    link: function(scope){
      var bookingParams = bookingService.getAPIParams();
      bookingParams.propertyCode = bookingService.getCodeFromSlug(scope.details.meta.slug);
      bookingParams.roomCode = bookingService.getCodeFromSlug(scope.room.meta.slug);

      scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;

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
        propertyService.getRoomProducts(params.propertyCode, params.roomCode, params,
          getRatesCacheTimeout()).then(function(data){
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

          // Tracking product impressions
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
              dataLayerService.trackProductsImpressions(scope.products.map(function(p){
                return {
                  name: p.name,
                  code: p.code,
                  price: p.price.totalBase,
                  overarchingBrand: chainData.nameShort,
                  brand: propertyData.nameLong,
                  location: propertyData.nameShort,
                  list: 'Rooms',
                  category: scope.room.name
                };
              }));
            });
          });
          
        }, function(){
          scope.products = null;
        });
      }

      function getRatesCacheTimeout(){
        return Settings.UI.hotelDetails &&
          Settings.UI.hotelDetails.ratesCacheTimeout?Settings.UI.hotelDetails.ratesCacheTimeout:0;
      }

      scope.settings = Settings.UI.hotelDetails.rooms.rates;

      scope.getRatesLimit = function(){
        return stateService.isMobile() ? scope.settings.ratesPerRoomOnMobile : scope.settings.ratesPerRoomOnDesktop;
      };

      scope.selectProduct = function(roomCode, productCode, isMemberOnly, roomPriceFrom, event){
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

        if(selectedProduct){
          chainService.getChain(Settings.API.chainCode).then(function(chainData) {
            propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
              dataLayerService.trackProductClick({
                name: selectedProduct.name,
                code: selectedProduct.code,
                price: selectedProduct.price.totalBase,
                overarchingBrand: chainData.nameShort,
                brand: propertyData.nameLong,
                location: propertyData.nameShort,
                list: 'Rooms',
                category: scope.room.name
              });
            });
          });
        }

        $state.go('reservation.details', params, {reload: true});
      };

      scope.isDateRangeSelected = bookingService.isDateRangeSelected;

      scope.openProductDetailsDialog = function(product){
        // Tracking product view
        chainService.getChain(Settings.API.chainCode).then(function(chainData) {
          propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
            dataLayerService.trackProductsDetailsView([{
              name: product.name,
              code: product.code,
              price: product.price.totalBase,
              overarchingBrand: chainData.nameShort,
              brand: propertyData.nameLong,
              location: propertyData.nameShort,
              list: 'Rooms',
              category: scope.room.name
            }]);
          });
        });

        modalService.openProductDetailsDialog(scope.room, product);
      };

      scope.init();
    }
  };
});
