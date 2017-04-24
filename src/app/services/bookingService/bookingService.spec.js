'use strict';

describe('bookingService', function() {
  var _rootScope, _bookingService, _spyBroadcast, _stateParams = {};

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.services.validation');
    module('mobiusApp.services.booking', function($provide) {
      // Mocking $stateParams service
      $provide.value('$stateParams', _stateParams);
      $provide.value('$state', {});
      $provide.value('cookieFactory', {});
      $provide.value('Settings', {
        API: {
          promoCodes: {
            promoCode: 'promoCode'
          }
        },
        UI: {
          bookingWidget: {
            maxAdultsForSingleRoomBooking: 5
          }
        }
      });
    });
  });

  beforeEach(inject(function($rootScope, bookingService) {
    _rootScope = $rootScope;
    _spyBroadcast = sinon.spy(_rootScope, '$broadcast');
    _bookingService = bookingService;
  }));

  afterEach(function(){
    _spyBroadcast.restore();
  });

  describe('getParams', function() {
    beforeEach(function() {
      _stateParams.propertyCode = 'ABC';
      _stateParams.adults = 5;
      _stateParams.children = 2;
      _stateParams.promoCode = 'BCD';
      _stateParams.dates = '2014-01-01_2015-01-01';
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
      expect(params.dates).equal('2014-01-01_2015-01-01');
      expect(params.propertySlug).equal('hotel-123');
      expect(params.roomSlug).equal('room-123');
    });

    it('should return params presented in the URL without propertyId', function() {
      var params = _bookingService.getParams(true);
      expect(params.property).equal(undefined);
      expect(params.adults).equal(5);
      expect(params.children).equal(2);
      expect(params.promoCode).equal('BCD');
      expect(params.dates).equal('2014-01-01_2015-01-01');
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

  describe('isMultiRoomBooking', function() {
    beforeEach(function(){
      _stateParams.rooms = '%5B%7B%22adults%22%3A2%2C%22children%22%3A0%7D%2C%7B%22adults%22%3A1%2C%22children%22%3A0%7D%5D';
    });

    it('should be defined as a function', function() {
      expect(_bookingService.isMultiRoomBooking).to.be.an('function');
    });

    it('should return true when rooms object property encoded', function() {
      expect(_bookingService.isMultiRoomBooking(
      '%5B%7B%22adults%22%3A2%2C%22children%22%3A0%7D%2C%7B%22adults%22%3A1%2C%22children%22%3A0%7D%5D')).equal(true);
    });

    it('should return true when state params contains encoded rooms list', function() {
      expect(_bookingService.isMultiRoomBooking()).equal(true);
    });
  });

  describe('getMultiRoomData', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.getMultiRoomData).to.be.an('function');
    });

    it('should encoded rooms list', function() {
      expect(_bookingService.getMultiRoomData(
      '%5B%7B%22adults%22%3A2%2C%22children%22%3A0%7D%2C%7B%22adults%22%3A1%2C%22children%22%3A0%7D%5D').length).equal(2);
    });
  });

  describe('isOverAdultsCapacity', function() {
    it('should be defined as a function', function() {
      expect(_bookingService.isOverAdultsCapacity).to.be.an('function');
    });

    it('should return false when in multiroom booking mode', function() {
      _stateParams.rooms =
        '%5B%7B%22adults%22%3A2%2C%22children%22%3A0%7D%2C%7B%22adults%22%3A1%2C%22children%22%3A0%7D%5D';
      expect(_bookingService.isOverAdultsCapacity()).equal(false);
    });

    it('should return false when dates are not selected', function() {
      expect(_bookingService.isOverAdultsCapacity()).equal(false);
    });

    it('should return false when dates are selected but adults count is lower than maxAdultsForSingleRoomBooking' +
        'specified in the config', function() {
      _stateParams.adults = 4;
      _stateParams.dates = '2015-01-01 2015-03-03';

      expect(_bookingService.isOverAdultsCapacity()).equal(false);
    });

    it('should return true when dates are selected and adults count is higher than maxAdultsForSingleRoomBooking' +
        'specified in the config', function() {
      _stateParams.adults = 6;
      _stateParams.rooms = null;
      _stateParams.dates = '2015-01-01 2015-03-03';

      expect(_bookingService.isOverAdultsCapacity()).equal(true);
    });
  });

  describe('switchToMRBMode', function(){
    it('should broadcast BOOKING_BAR_OPEN_MRB_TAB event', function() {
      _bookingService.switchToMRBMode();
      expect(_spyBroadcast.calledOnce).equal(true);
      expect(_spyBroadcast.calledWith('BOOKING_BAR_OPEN_MRB_TAB')).equal(true);
    });
  });
});
