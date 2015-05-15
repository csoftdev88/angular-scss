'use strict';

angular.module('mobiusApp.filters.number', [])

  .filter('i18nNumber', ['stateService', 'Settings', function(stateService, Settings) {
    var factorCache = {
      1: 1e1,
      2: 1e2,
      3: 1e3
    };

    function getFactor(power) {
      if (!factorCache[power]) {
        factorCache[power] = Math.pow(10, power);
      }
      return factorCache[power];
    }

    function filter(number, fractions) {
      if (!isFinite(number)) {
        return number;
      }

      if (typeof fractions === 'undefined') {
        fractions = 0;
      }

      var numberString;
      if (fractions > 0) {
        var factor = getFactor(fractions);
        numberString = '' + Math.round(Math.abs(number * factor)) / factor;
      } else {
        numberString = '' + Math.round(Math.abs(number));
      }

      var decimals = numberString.split('.');
      var beforeDecimal = decimals[0];
      var afterDecimal = decimals[1];
      var beforeDecimalArray = beforeDecimal.split('');

      var formattedNumber, formattedNumberArray = [], digits;
      var langSettings = Settings.UI.languages[stateService.getAppLanguageCode()];

      while (beforeDecimalArray.length > 0) {
        digits = beforeDecimalArray.splice(-langSettings.groupSize, langSettings.groupSize);
        formattedNumberArray.push(digits.join(''));
      }
      formattedNumber = formattedNumberArray.reverse().join(langSettings.groupSeparator);
      if (fractions > 0) {
        if (typeof afterDecimal === 'undefined') {
          afterDecimal = '';
        }
        while (afterDecimal.length < fractions) {
          afterDecimal += '0';
        }
        formattedNumber += langSettings.decimalSeparator + afterDecimal;
      }
      if (number < 0) {
        formattedNumber = langSettings.neg + formattedNumber;
      }

      return formattedNumber;
    }

    return filter;
  }]);