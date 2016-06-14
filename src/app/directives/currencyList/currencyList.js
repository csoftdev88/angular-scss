'use strict';

angular.module('mobiusApp.directives.currency', [])

  .directive('currencyList', ['Settings', 'contentService', '_', 'queryService', '$rootScope', 'user', '$state', '$stateParams', 'apiService',
    function(Settings, contentService, _, queryService, $rootScope, user, $state, $stateParams, apiService) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/currencyList/currencyList.html',

      // Widget logic goes here
      link: function(scope) {

        contentService.getCurrencies().then(function(data) {
          var currencies = {};
          _.each(data, function(currencyData) {
            if (!Settings.UI.currencies[currencyData.code]) {
              throw new Error('Currency "' + currencyData.code + '" not found in configuration', currencyData);
            } else {
              currencyData = _.assign(currencyData, Settings.UI.currencies[currencyData.code]);
              currencies[currencyData.code] = currencyData;
            }
          });

          var currency = queryService.getValue(Settings.currencyParamName);
          if (currency && currencies.hasOwnProperty(currency)) {
            // set by user
            setCurrency(currencies[currency]);
          } else if (scope.currentCurrency) {
            // do nothing
          } else if (currencies.hasOwnProperty(Settings.UI.currencies.default)) {
            // default if nothing is set
            setCurrency(currencies[Settings.UI.currencies.default]);
          } else {
            var codes = Object.keys(currencies);
            if (codes.length) {
              // some if default not exists
              setCurrency(currencies[codes[0]]);
            } else {
              throw new Error('Currency not defined');
            }
          }

          scope.currencies = _.values(currencies);
        });

        scope.getCurrencySymbol = function(code) {
          return code && Settings.UI.currencies[code].symbol;
        };

        scope.getFormattedLabel = function(code) {
          return code + '(' + scope.getCurrencySymbol(code) + ')';
        };

        scope.changeCurrency = function(currency) {
          if (scope.currentCurrency !== currency) {
            setCurrency(currency);
            $state.go($state.current.name, $stateParams, {reload: true});
          }
        };

        function setCurrency(currency) {
          scope.currentCurrency = currency;
          queryService.setValue(Settings.currencyParamName, currency.code);
          $rootScope.currencyCode = currency.code;
          user.storeUserCurrency(currency.code);
          var currencyObj = {};
          currencyObj['mobius-currencycode'] = currency.code;
          apiService.setHeaders(currencyObj);
        }
      }
    };
  }]);
