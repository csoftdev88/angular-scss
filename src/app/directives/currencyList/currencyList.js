'use strict';

angular.module('mobiusApp.directives.currency', [])

.directive('currencyList', function(Settings, contentService){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/currencyList/currencyList.html',

    // Widget logic goes here
    link: function(scope){
      contentService.getCurrencies().then(function(data){
        scope.currencies = data.currencies||[];
      });

      scope.getCurrencySymbol = function(code){
        var data = Settings.UI.currencies[code];
        if(!data){
          throw 'Currency "' + code + '" is not found in configuration.';
        }

        return data.symbol;
      };
    }
  };
});
