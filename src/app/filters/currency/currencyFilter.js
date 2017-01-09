'use strict';

angular.module('mobiusApp.filters.currency', [])

  .filter('i18nCurrency', ['_', '$filter', 'Settings', 'templateFactory', function(_, $filter, Settings, templateFactory) {
    function filter(number, currencyCode, fractions, shortenFormat) {
      if (!_.isFinite(number)) {
        return number;
      }

      if (currencyCode && Settings.UI.currencies[currencyCode]) {
        var currency = Settings.UI.currencies[currencyCode];

        if (typeof fractions === 'undefined') {
          fractions = 2;
        }

        var format = shortenFormat && currency.shortFormat ? currency.shortFormat : currency.format;
        var symbol = shortenFormat && currency.shortSymbol ? currency.shortSymbol : currency.symbol;

        var numberString = $filter('i18nNumber')(number, fractions);
        if (numberString.length > 0) {
          return templateFactory(format, {
            symbol: symbol,
            amount: numberString
          });
        }
      }
      return '';
    }

    return filter;
  }])
;
