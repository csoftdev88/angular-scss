'use strict';

angular.module('mobiusApp.directives.currency', [])

  .directive('currencyList', function(Settings, contentService, $rootScope, $state, $stateParams, _) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/currencyList/currencyList.html',

      // Widget logic goes here
      link: function(scope) {

        contentService.getCurrencies().then(function(data) {
          scope.currencies = [];
          var currencyMapping = {};
          _.each(data, function(currencyData) {
            if (!Settings.UI.currencies[currencyData.code]) {
              throw new Error('Currency "' + currencyData.code + '" not found in configuration', currencyData);
            } else {
              currencyMapping[currencyData.code] = scope.currencies.length;
              currencyData.symbol = Settings.UI.currencies[currencyData.code].symbol;
              scope.currencies.push(currencyData);
            }
          });

          if ($stateParams.currency && currencyMapping.hasOwnProperty($stateParams.currency)) {
            // set by user
            $rootScope.currency = scope.currencies[currencyMapping[$stateParams.currency]];
          } else if ($rootScope.currency) {
            // do nothing
          } else if (Settings.UI.currencies.default && currencyMapping.hasOwnProperty(Settings.UI.currencies.default)) {
            // default if nothing is set
            $rootScope.currency = scope.currencies[currencyMapping[Settings.UI.currencies.default]];
          } else if (scope.currencies.length) {
            // some if default not exists
            $rootScope.currency = scope.currencies[0];
          } else  {
            throw new Error('Currency not defined');
          }
        });

        scope.getCurrencySymbol = function(code) {
          return code && Settings.UI.currencies[code].symbol;
        };

        scope.getFormattedLabel = function(code) {
          return code + '(' + scope.getCurrencySymbol(code) + ')';
        };

        scope.changeCurrency = function(currency) {
          // reload app to get data in new currency
          var params = $stateParams;
          params.currency = currency.code;
          $state.go($state.current.name, params);
        };
      }
    };
  });
