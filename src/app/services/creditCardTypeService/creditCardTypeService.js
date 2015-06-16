'use strict';

angular.module('mobiusApp.services.creditCardType', [])
  .service('creditCardTypeService', function() {

    var UNKNOWN = 'unknown';
    var AMERICAN_EXPRESS = 'americanExpress';
    var MAESTRO = 'maestro';
    var MASTER_CARD = 'masterCard';
    var VISA = 'visa';

    // see https://en.wikipedia.org/wiki/Bank_card_number
    function getType(creditCardNumber) {
      if (/^3[47]/.test(creditCardNumber)) {
        return AMERICAN_EXPRESS;
      } else if (/^5[06]/.test(creditCardNumber)) {
        return MAESTRO;
      } else if (/^5[1-5]/.test(creditCardNumber)) {
        return MASTER_CARD;
      } else if (/^4/.test(creditCardNumber)) {
        return VISA;
      } else {
        return UNKNOWN;
      }
    }

    return {
      UNKNOWN: UNKNOWN,

      MASTER_CARD: MASTER_CARD,
      MAESTRO: MAESTRO,
      VISA: VISA,
      AMERICAN_EXPRESS: AMERICAN_EXPRESS,

      getType: getType
    };
  });
