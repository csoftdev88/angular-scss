'use strict';

describe('bookingService', function() {
  var _rootScope, _bookingService, _stateParams;

  beforeEach(function() {
    module('mobiusApp.services.booking', function($provide) {
      // Mocking $stateParams service
      $provide.value('$stateParams', _stateParams || {});
    });
  });

  beforeEach(inject(function($rootScope, bookingService) {
    _rootScope = $rootScope;
    _bookingService = bookingService;
  }));

  describe('getParams', function() {
    beforeEach(function(){
      _stateParams = {
        'property': 'ABC',
        'adults': 5,
        'children': 2,
        'promoCode': 'BCD'
      };
    });

    it('should be defined as a function', function() {
      expect(_bookingService.getParams).to.be.an('function');
    });

    it('should return params presented in the URL', function(){
      var params = _bookingService.getParams();
      expect(params.property).equal('ABC');
      expect(params.adults).equal(5);
      expect(params.children).equal(2);
      expect(params.promoCode).equal('BCD');
    });
  });

  describe('getAPIParams', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getAPIParams).to.be.an('function');
    });

    it('should return params in the format expected by the API', function() {
      var queryParams = _bookingService.getAPIParams();
      expect(queryParams.productGroupId).equal('ABC');
    });
  });
});
