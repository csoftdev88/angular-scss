'use strict';

angular.module('mobiusApp.filters.currency', [])

  .filter('i18nCurrency', ['_', '$filter', 'Settings', function(_, $filter, Settings) {
    function filter(number, currencyCode, fractions) {
      if (!_.isFinite(number)) {
        return number;
      }

      if (currencyCode && Settings.UI.currencies[currencyCode]) {
        var currency = Settings.UI.currencies[currencyCode];

        if (typeof fractions === 'undefined') {
          fractions = 2;
        }

        var numberString = $filter('i18nNumber')(number, fractions);
        if (numberString.length > 0) {
          if (currency.position === 'pre') {
            return currency.symbol + (currency.space ? ' ' : '') + numberString;
          } else if (currency.position === 'post') {
            return numberString + (currency.space ? ' ' : '') + currency.symbol;
          }
        }
      }
      return '';
    }

    return filter;
  }])
;