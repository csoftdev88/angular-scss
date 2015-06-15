'use strict';

describe('creditCardTypeService', function() {
  var _creditCardTypeService;

  beforeEach(function() {
    module('mobiusApp.services.creditCardType');
  });

  beforeEach(inject(function(creditCardTypeService) {
    _creditCardTypeService = creditCardTypeService;
  }));

  describe('getType', function() {
    it('should return correct type for American Express', function() {
      expect(_creditCardTypeService.getType('34123')).equal(_creditCardTypeService.AMERICAN_EXPRESS);
      expect(_creditCardTypeService.getType('37123')).equal(_creditCardTypeService.AMERICAN_EXPRESS);
    });

    it('should return correct type for American Express', function() {
      expect(_creditCardTypeService.getType('500000')).equal(_creditCardTypeService.MAESTRO);
      expect(_creditCardTypeService.getType('560000')).equal(_creditCardTypeService.MAESTRO);
    });

    it('should return correct type for American Express', function() {
      expect(_creditCardTypeService.getType('51123')).equal(_creditCardTypeService.MASTER_CARD);
      expect(_creditCardTypeService.getType('52123')).equal(_creditCardTypeService.MASTER_CARD);
      expect(_creditCardTypeService.getType('53123')).equal(_creditCardTypeService.MASTER_CARD);
      expect(_creditCardTypeService.getType('54123')).equal(_creditCardTypeService.MASTER_CARD);
      expect(_creditCardTypeService.getType('55123')).equal(_creditCardTypeService.MASTER_CARD);
    });

    it('should return correct type for American Express', function() {
      expect(_creditCardTypeService.getType('4123')).equal(_creditCardTypeService.VISA);
      expect(_creditCardTypeService.getType('4987')).equal(_creditCardTypeService.VISA);
    });

    it('should return unknown type for others', function() {
      expect(_creditCardTypeService.getType('1434')).equal(_creditCardTypeService.UNKNOWN);
    });
  });
});
