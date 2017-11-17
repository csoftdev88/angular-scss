'use strict';

angular.module('mobiusApp.directives.room.otaProducts', [])

.directive('roomOtaProducts', function(_, Settings, $timeout) {

  return {
    restrict: 'E',
    templateUrl: 'directives/roomOtaProducts/roomOtaProducts.html',
    scope: false,
    replace: false,
    link: function(scope) {
      var otaRatesConfig = Settings.UI.otaRates;
      if (otaRatesConfig) {

        // Closure to update otaProducts either coming from scope or scope.room
        var updateProducts = function (vm) {
          return function(newValue) {
            if (newValue !== undefined) {
              scope.otaLoading = true;
              scope.otaProductsList = [];
              //Creating false load effect
              $timeout(function(){
                scope.otaLoading = false;
              }, 2000);

              _.each(otaRatesConfig, function(otaConfig) {
                var otaProductItem = {};
                otaProductItem.price = vm.otaProducts[0].price;
                otaProductItem.logo = otaConfig.logo;
                otaProductItem.link = otaConfig.link;
                scope.otaProductsList.push(otaProductItem);
              });
            }
          };
        };

        // Watch both as we don't have an isolated scope and these can come from either scope or scope.room
        scope.$watch('otaProducts', updateProducts(scope));
        scope.$watch('room.otaProducts', updateProducts(scope.room));
      }
    }
  };
});
