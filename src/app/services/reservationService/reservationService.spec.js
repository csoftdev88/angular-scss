'use strict';

describe('reservationService', function() {
  var _reservationService, _apiPostSpy, _apiGetSpy,
    _apiGetFullURLSpy;

  beforeEach(function() {
    module('mobiusApp.services.reservation', function($provide) {
      var Settings = {
        'API': {
          'baseURL': 'http://domain/',

          'reservations': {
            'new': 'new'
          }
        }
      };

      $provide.value('Settings', Settings);

      var apiService = {
        post: function(){},
        get: function(){},
        getFullURL: function(p){
          return p;
        },
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function(apiService, reservationService) {
    _reservationService = reservationService;

    _apiPostSpy = sinon.spy(apiService, 'post');
    _apiGetSpy = sinon.spy(apiService, 'get');
    _apiGetFullURLSpy = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _apiPostSpy.restore();
    _apiGetSpy.restore();
    _apiGetFullURLSpy.restore();
  });

  describe('createReservation', function() {
    it('should fire a POST request to reservations API', function() {
      _reservationService.createReservation();
      expect(_apiGetFullURLSpy.calledOnce).equal(true);
      expect(_apiGetFullURLSpy.calledWith('reservations.new')).equal(true);

      expect(_apiPostSpy.calledOnce).equal(true);
    });
  });

  describe('getAll', function() {
    it('should fire a GET request to reservations API', function() {
      _reservationService.getAll();
      expect(_apiGetFullURLSpy.calledOnce).equal(true);
      expect(_apiGetFullURLSpy.calledWith('reservations.all')).equal(true);

      expect(_apiGetSpy.calledOnce).equal(true);
    });
  });
});
