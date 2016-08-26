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
      currencyCode: '='
    },
    replace: false,
    link: function(scope){
      var otaRatesConfig = Settings.UI.otaRates;
      scope.$watch('otaProducts', function(newValue) {
          if (newValue !== undefined) {
            _.each(scope.otaProducts, function(otaProduct) {
              switch(otaProduct.type) {
                case 'expedia':
                  if(otaRatesConfig && otaRatesConfig.expedia.logo) {
                    otaProduct.logo = otaRatesConfig.expedia.logo;
                  }
                  otaProduct.description = scope.otaExpediaMessage;
                  break;
                case 'tripadvisor':
                  if(otaRatesConfig && otaRatesConfig.tripadvisor.logo) {
                    otaProduct.logo = otaRatesConfig.tripadvisor.logo;
                  }
                  otaProduct.description = scope.otaTripadvisorMessage;
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
