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
        'promoCode': 'BCD',
        'dates': '2014-01-01 2015-01-01'
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
      expect(params.dates).equal('2014-01-01 2015-01-01');
    });
  });

  describe('getAPIParams', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getAPIParams).to.be.an('function');
    });

    it('should return params in the format expected by the API', function() {
      var queryParams = _bookingService.getAPIParams();
      expect(queryParams.productGroupId).equal('ABC');

      expect(queryParams.from).equal('2014-01-01');
      expect(queryParams.to).equal('2015-01-01');
    });
  });

  describe('datesFromString', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.datesFromString).to.be.an('function');
    });

    it('should return null when input format is invalid', function() {
      expect(_bookingService.datesFromString()).equal(null);
      expect(_bookingService.datesFromString('')).equal(null);
    });

    it('should return an object with from/to properties of the same' +
      ' value when a single data is only presented', function() {

      var dates = _bookingService.datesFromString('2015-05-20');
      expect(dates.from).equal('2015-05-20');
      expect(dates.to).equal('2015-05-20');
    });
  });
});
