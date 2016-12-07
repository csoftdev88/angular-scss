'use strict';

angular.module('mobiusApp.directives.room.otaProducts', [])

.directive('roomOtaProducts', function(_, Settings, $timeout) {

  return {
    restrict: 'E',
    templateUrl: 'directives/roomOtaProducts/roomOtaProducts.html',
    scope: {
      otaProducts: '=',
      currencyCode: '='
    },
    replace: false,
    link: function(scope) {
      var otaRatesConfig = Settings.UI.otaRates;
      if (otaRatesConfig) {
        scope.$watch('otaProducts', function(newValue) {
          if (newValue !== undefined) {
            scope.otaLoading = true;
            scope.otaProductsList = [];
            //Creating false load effect
            $timeout(function(){
              scope.otaLoading = false;
            }, 2000);

            _.each(otaRatesConfig, function(otaConfig) {
              var otaProductItem = {};
              otaProductItem.price = scope.otaProducts[0].price;
              otaProductItem.logo = otaConfig.logo;
              otaProductItem.link = otaConfig.link;
              scope.otaProductsList.push(otaProductItem);
            });
          }
        });
      }
    }
  };
});
