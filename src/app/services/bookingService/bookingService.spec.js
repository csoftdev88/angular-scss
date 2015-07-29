'use strict';

describe('bookingService', function() {
  var _rootScope, _bookingService, _stateParams = {};

  beforeEach(function() {
    module('mobiusApp.services.booking', function($provide) {
      // Mocking $stateParams service
      $provide.value('$stateParams', _stateParams);
    });
  });

  beforeEach(inject(function($rootScope, bookingService) {
    _rootScope = $rootScope;
    _bookingService = bookingService;
  }));

  describe('getParams', function() {
    beforeEach(function() {
      _stateParams.propertyCode = 'ABC';
      _stateParams.adults = 5;
      _stateParams.children = 2;
      _stateParams.promoCode = 'BCD';
      _stateParams.dates = '2014-01-01 2015-01-01';
      _stateParams.propertySlug = 'hotel-123';
      _stateParams.roomSlug = 'room-123';
    });

    it('should be defined as a function', function() {
      expect(_bookingService.getParams).to.be.an('function');
    });

    it('should return params presented in the URL', function() {
      var params = _bookingService.getParams();
      expect(params.property).equal('ABC');
      expect(params.adults).equal(5);
      expect(params.children).equal(2);
      expect(params.promoCode).equal('BCD');
      expect(params.dates).equal('2014-01-01 2015-01-01');
      expect(params.propertySlug).equal('hotel-123');
      expect(params.roomSlug).equal('room-123');
    });

    it('should return params presented in the URL without propertyId', function() {
      var params = _bookingService.getParams(true);
      expect(params.property).equal(undefined);
      expect(params.adults).equal(5);
      expect(params.children).equal(2);
      expect(params.promoCode).equal('BCD');
      expect(params.dates).equal('2014-01-01 2015-01-01');
      expect(params.propertySlug).equal('hotel-123');
      expect(params.roomSlug).equal('room-123');
    });
  });

  describe('getAPIParams', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getAPIParams).to.be.an('function');
    });

    it('should return params in the format expected by the API', function() {
      var queryParams = _bookingService.getAPIParams();
      expect(queryParams.propertyCode).equal('ABC');

      expect(queryParams.from).equal('2014-01-01');
      expect(queryParams.to).equal('2015-01-01');
    });

    it('should return params in the format expected by the API without property', function() {
      var queryParams = _bookingService.getAPIParams(true);
      expect(queryParams.propertyCode).equal(undefined);
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

  describe('APIParamsHasDates', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.APIParamsHasDates).to.be.an('function');
    });

    it('should return true when dates are present', function() {
      _stateParams.dates = '2014-01-01 2015-01-01';
      expect(_bookingService.APIParamsHasDates()).equal(true);
    });

    it('should return true when one date is present', function() {
      _stateParams.dates = '2014-01-01';
      expect(_bookingService.APIParamsHasDates()).equal(true);
    });

    it('should return false if both dates are not present', function() {
      _stateParams.dates = '';
      expect(_bookingService.APIParamsHasDates()).equal(false);
    });
  });

  describe('getCodeParamName', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getCodeParamName).to.be.an('function');
    });

    it('should return corpCode when code is type of corpCode', function() {
      expect(_bookingService.getCodeParamName('132')).equal('corpCode');
    });

    it('should return groupCode when code is type of groupCode', function() {
      expect(_bookingService.getCodeParamName('#132')).equal('groupCode');
    });

    it('should return promoCode for others', function() {
      expect(_bookingService.getCodeParamName('abc')).equal('promoCode');
    });
  });

  describe('getCodeFromSlug', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getCodeFromSlug).to.be.an('function');
    });

    it('should return code out of the a slug and capitalize it', function() {
      expect(_bookingService.getCodeFromSlug('the-sutton-place-hotel-edmonton-edm')).equal('EDM');
    });

    it('should return code out of the a slug replace _ with -', function() {
      expect(_bookingService.getCodeFromSlug('the-sutton-place-hotel-edmonton-edm_van')).equal('EDM-VAN');
      expect(_bookingService.getCodeFromSlug('the-edm_van_rev')).equal('EDM-VAN-REV');
    });

    it('should return null when slug is not defined or an empty string is used', function() {
      expect(_bookingService.getCodeFromSlug('')).equal(null);
      expect(_bookingService.getCodeFromSlug(null)).equal(null);
      expect(_bookingService.getCodeFromSlug(undefined)).equal(null);
    });
  });
});
