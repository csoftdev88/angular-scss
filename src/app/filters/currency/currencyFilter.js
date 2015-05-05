'use strict';

angular.module('mobiusApp.filters.currency', [])

  .filter('i18nCurrency', ['$filter', '$rootScope', function($filter, $rootScope) {
    function filter(number, currency, fractions) {
      if (!Number.isFinite(number)) {
        return number;
      }

      if (!currency) {
        currency = $rootScope.currency.symbol;
      }
      if(typeof fractions === 'undefined') {
        fractions = 2;
      }

      var numberString = $filter('i18nNumber')(number, fractions);
      if (numberString.length > 0) {
        return currency + numberString;
      } else {
        return '';
      }
    }

    return filter;
  }]);
