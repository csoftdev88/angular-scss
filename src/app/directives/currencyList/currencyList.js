/**
 * Directive to include on a <li> element to transform into a drop down list to select the user currency.
 *
 * If a user is authenticated, the currency will be saved to their profile. It will also save the currency selected
 * to a cookie, MobiusCurrencyCode, regardless of auth.
 *
 * @note This directive requires the <li> element to be within a <ul> with the dropdownGroup directive
 * @see dropdownGroup
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp.directives.currency', [])
    .directive('currencyList', ['Settings', 'contentService', '_', 'queryService', '$rootScope', 'user', '$state',
      '$stateParams', 'apiService', '$timeout', '$log', CurrencyList]);

  function CurrencyList(Settings, contentService, _, queryService, $rootScope, user, $state, $stateParams, apiService,
                        $timeout, $log) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/currencyList/currencyList.html',
      link: function(scope) {
        // Get the directives config
        scope.config = Settings.UI.currencyList;
        if (!scope.config) {
          $log.warn('The currency list directive was initialised without a config');
        }

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

          var searchCurrency = queryService.getValue(Settings.currencyParamName);
          var userCurrency = user.getUserCurrency();

          scope.currentCurrency = _.findWhere(currencies, { code: Settings.UI.currencies.default });

          if($state.current.name !== 'reservationDetail')
          {
            if(userCurrency && currencies.hasOwnProperty(userCurrency)){
              // stored by user
              setCurrency(currencies[userCurrency]);
            }
            else if (searchCurrency && currencies.hasOwnProperty(searchCurrency)) {
              // set by user
              setCurrency(currencies[searchCurrency]);
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
            setCurrency(currency, true);
            //$stateParams.currency = currency.code;
            //$state.go($state.current.name, $stateParams, {reload: true});
          }
        };

        function setCurrency(currency, reload) {
          scope.currentCurrency = currency;

          //Only add the query param if the currency is not the same as default, otherwise remove param
          if(currency.code !== Settings.UI.currencies.default){
            queryService.setValue(Settings.currencyParamName, currency.code);
          }
          //Otherwise if we already have one set, remove it
          else if(queryService.getValue('currency')){
            queryService.removeParam('currency');
          }

          user.storeUserCurrency(currency.code)
            .then(function () {
              var currencyObj = {};
              currencyObj['mobius-currencycode'] = currency.code;
              apiService.setHeaders(currencyObj);
              if(reload){
                $timeout(function () {
                  $rootScope.currencyCode = currency.code;
                  $state.go($state.current.name, $stateParams, {reload: true});
                }, 50);
              }
              else{
                $rootScope.currencyCode = currency.code;
              }
            });
        }
      }
    };
  }

}());
