'use strict';

describe('reservationService', function() {
  var _reservationService, _apiPostSpy, _apiGetFullURLSpy;

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
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function(apiService, reservationService) {
    _reservationService = reservationService;

    _apiPostSpy = sinon.spy(apiService, 'post');
    _apiGetFullURLSpy = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _apiPostSpy.restore();
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
});
