'use strict';

angular.module('mobiusApp.directives.room.otaProducts', [])

.directive('roomOtaProducts', function(_, Settings, $timeout) {

  return {
    restrict: 'E',
    templateUrl: 'directives/roomOtaProducts/roomOtaProducts.html',
    scope: {
      otaProducts: '=',
      otaExpediaMessage: '=',
      otaTripadvisorMessage: '=',
      otaBookingComMessage: '=',
      currencyCode: '=',
      roomCode:'='
    },
    replace: false,
    link: function(scope) {
      var otaRatesConfig = Settings.UI.otaRates;
      scope.otaLoading = true;

      if (otaRatesConfig) {
        scope.$watch('otaProducts', function(newValue) {
          if (newValue !== undefined) {
            //Creating false load effect
            $timeout(function(){
              scope.otaLoading = false;
            }, 2000);

            var randomIndex = Math.floor(Math.random() * otaRatesConfig.length);
            var otaConfig = otaRatesConfig[randomIndex];
            scope.otaProducts.length = 1;
            _.each(scope.otaProducts, function(otaProduct) {
              otaProduct.logo = otaConfig.logo;
              otaProduct.link = otaConfig.link;
              var roomOtaProduct = _.where(otaProduct.productRooms, {code: scope.roomCode});
              if(roomOtaProduct)
              {
                otaProduct.price = roomOtaProduct.price;
              }
              switch (otaConfig.name) {
                case 'expedia':
                  otaProduct.description = scope.otaExpediaMessage;
                  break;
                case 'bookingcom':
                  otaProduct.description = scope.otaBookingComMessage;
                  break;
                default:
                  otaProduct.description = 'Message is not defined';
              }
            });
          }
        });
      }
    }
  };
});
