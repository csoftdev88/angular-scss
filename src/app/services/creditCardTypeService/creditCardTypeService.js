'use strict';

angular.module('mobiusApp.services.creditCardType', [])
  .service('creditCardTypeService', function(Settings) {

    // see https://en.wikipedia.org/wiki/Bank_card_number
    function getCreditCardDetails(creditCardNumber, skipCardCheck) {
      if (skipCardCheck) {
        // If we are skipping credit card check (providing fake one), assume it is Visa.
        return {
          icon: 'visa',
          code: 'VI',
          name: 'Visa'
        };
      } else {
        creditCardNumber = normalizeCreditCardNumber(creditCardNumber);

        if (creditCardNumber && luhnCheck(creditCardNumber)) {
          var cardTypes = Settings.UI.booking.cardTypes;
          for (var type in cardTypes) {
            if (cardTypes.hasOwnProperty(type)) {
              var cardDetails = cardTypes[type];
              var regexObj = cardDetails.regex;
              if (regexObj.test(creditCardNumber)) {
                return {
                  icon: cardDetails.icon,
                  code: cardDetails.code,
                  name: cardDetails.name
                };
              }
            }
          }
          // uncomment to accept all card numbers passing luhn check
          // return {};
        }
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

    function formatCreditCardNumber(creditCardNumber, separator) {
      creditCardNumber = normalizeCreditCardNumber(creditCardNumber);

      var formatedNumber = '';

      for (var i = 0; i < creditCardNumber.length; i++) {
        if ((i > 0) && (i % 4 === 0)) {
          formatedNumber += separator || '-';
        }
        formatedNumber += creditCardNumber[i];
      }

      return formatedNumber;
    }

    function getCreditCardPreviewNumber(creditCardNumber, maskSymbol){
      creditCardNumber = normalizeCreditCardNumber(creditCardNumber);

      var previewNumber = '';
      for(var i = 0; i < creditCardNumber.length; i++){
        previewNumber += i > creditCardNumber.length - 5?creditCardNumber[i]:maskSymbol || 'x';
      }

      return formatCreditCardNumber(previewNumber);
    }

    return {
      getCreditCardDetails: getCreditCardDetails,
      luhnCheck: luhnCheck,
      normalizeCreditCardNumber: normalizeCreditCardNumber,
      formatCreditCardNumber: formatCreditCardNumber,
      getCreditCardPreviewNumber: getCreditCardPreviewNumber
    };
  });
