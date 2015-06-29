'use strict';

angular.module('mobiusApp.services.creditCardType', [])
  .service('creditCardTypeService', function(Settings) {

    // see https://en.wikipedia.org/wiki/Bank_card_number
    function getCreditCardDetails(creditCardNumber) {
      creditCardNumber = normalizeCreditCardNumber(creditCardNumber);

      if (creditCardNumber && luhnCheck(creditCardNumber)) {
        for (var type in Settings.UI.booking.cardTypes) {
          var cardDetails = Settings.UI.booking.cardTypes[type];
          var regexObj = cardDetails.regex;
          if (regexObj.test(creditCardNumber)) {
            return {
              icon: cardDetails.icon,
              code: cardDetails.code
            };
          }
        }
        // uncomment to accept all card numbers passing luhn check
        // return {};
      }

      return null;
    }

    // http://en.wikipedia.org/wiki/Luhn_algorithm
    function luhnCheck(creditCardNumber) {
      creditCardNumber = normalizeCreditCardNumber(creditCardNumber);

      if (/[^0-9]+/.test(creditCardNumber)) {
        return false;
      }

      // The Luhn Algorithm.
      var nCheck = 0, nDigit = 0, bEven = false;
      creditCardNumber = creditCardNumber.replace(/\D/g, '');

      for (var n = creditCardNumber.length - 1; n >= 0; n--) {
        var cDigit = creditCardNumber.charAt(n);
        nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) {
            nDigit -= 9;
          }
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) === 0;
    }

    function normalizeCreditCardNumber(creditCardNumber) {
      return creditCardNumber ? ('' + creditCardNumber).replace(/[\s-]/g, '') : '';
    }

    return {
      getCreditCardDetails: getCreditCardDetails,
      luhnCheck: luhnCheck,
      normalizeCreditCardNumber: normalizeCreditCardNumber
    };
  });
