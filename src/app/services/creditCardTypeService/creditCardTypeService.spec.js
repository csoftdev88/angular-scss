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

  describe('formatCreditCardNumber', function() {
    it('should normilize credit card number with default separator', function() {
      expect(_creditCardTypeService.formatCreditCardNumber('4222222222222')).equal('4222-2222-2222-2');
    });

    it('should normilize credit card number with custom separator', function() {
      expect(_creditCardTypeService.formatCreditCardNumber('4222222222222', ' ')).equal('4222 2222 2222 2');
    });
  });

  describe('getCreditCardPreviewNumber', function() {
    it('should anonymize credit card number', function() {
      expect(_creditCardTypeService.getCreditCardPreviewNumber('4222222222222')).equal('xxxx-xxxx-x222-2');
      expect(_creditCardTypeService.getCreditCardPreviewNumber('4222')).equal('4222');
    });

    it('should anonymize credit card number with a custom mask', function() {
      expect(_creditCardTypeService.getCreditCardPreviewNumber('11115432', '*')).equal('****-5432');
    });
  });

  describe('normalizeCreditCardNumber', function() {
    it('should normilize credit card number', function() {
      expect(_creditCardTypeService.normalizeCreditCardNumber(4222222222222)).equal('4222222222222');
      expect(_creditCardTypeService.normalizeCreditCardNumber('42222 2222 2222')).equal('4222222222222');
    });
  });
});
