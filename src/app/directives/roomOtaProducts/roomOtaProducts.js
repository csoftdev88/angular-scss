'use strict';

angular.module('mobiusApp.directives.room.otaProducts', [])

.directive('roomOtaProducts', function(_, Settings){

  return {
    restrict: 'E',
    templateUrl: 'directives/roomOtaProducts/roomOtaProducts.html',
    scope: {
      otaProducts: '=',
      otaExpediaMessage: '=',
      otaTripadvisorMessage: '=',
      otaBookingComMessage: '=',
      currencyCode: '='
    },
    replace: false,
    link: function(scope){
      var otaRatesConfig = Settings.UI.otaRates;
      scope.$watch('otaProducts', function(newValue) {
          if (newValue !== undefined) {
            scope.otaProducts.length = 1;
            console.log(otaRatesConfig);
            _.each(scope.otaProducts, function(otaProduct) {
              var otaType = 'expedia';
              switch(otaType) {
                case 'expedia':
                  if(otaRatesConfig && otaRatesConfig.expedia.logo) {
                    otaProduct.logo = otaRatesConfig.expedia.logo;
                  }
                  otaProduct.description = scope.otaExpediaMessage;
                  break;
                case 'bookingcom':
                  if(otaRatesConfig && otaRatesConfig.bookingcom.logo) {
                    otaProduct.logo = otaRatesConfig.bookingcom.logo;
                  }
                  otaProduct.description = scope.otaBookingComMessage;
                  break;
                default:
                  otaProduct.description = 'Message is not defined';
              }
            });
          }
      });
    }
  };
});
