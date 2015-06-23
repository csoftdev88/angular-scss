'use strict';

describe('creditCardTypeService', function() {
  var _creditCardTypeService;

  beforeEach(function() {
    module('mobiusApp.services.creditCardType', function($provide) {
      $provide.value('Settings', {
        UI: {
          'booking': {
            cardTypes: {
              'visa': {
                regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
                icon: 'visa',
                code: 'VI'
              }
            }
          }
        }
      });
    });
  });

  beforeEach(inject(function(creditCardTypeService) {
    _creditCardTypeService = creditCardTypeService;
  }));

  describe('luhnCheck', function() {
    it('should return correct type for Visa', function() {
      expect(_creditCardTypeService.luhnCheck('4222222222222')).equal(true);
    });

    it('should return null for unknown type', function() {
      expect(_creditCardTypeService.luhnCheck('1434')).equal(false);
    });
  });

  describe('getCreditCardDetails', function() {
    it('should return correct type for Visa', function() {
      expect(_creditCardTypeService.getCreditCardDetails('4222222222222')).deep.equal({
        icon: 'visa',
        code: 'VI'
      });
    });

    it('should return null for unknown type', function() {
      expect(_creditCardTypeService.getCreditCardDetails('1434')).equal(null);
    });
  });
});
