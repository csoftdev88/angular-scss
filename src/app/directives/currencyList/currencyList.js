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

        if(scope.currencies.length){
          scope.changeCurrency(scope.currencies[0]);
        }
      });

      scope.getCurrencySymbol = function(code){
        if(!code){
          return '';
        }

        var data = Settings.UI.currencies[code];
        if(!data){
          throw 'Currency "' + code + '" is not found in configuration.';
        }

        return data.symbol;
      };

      scope.getFormattedLabel = function(code){
        return code + '(' + scope.getCurrencySymbol(code) + ')';
      };

      scope.changeCurrency = function(currency){
        scope.currentCurrency = currency;
      };
    }
  };
});
