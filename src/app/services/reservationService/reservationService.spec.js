'use strict';

describe('reservationService', function() {
  var _reservationService, _apiPostSpy, _apiPutSpy, _apiGetFullURLSpy;

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
        put: function(){},
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
    _apiPutSpy = sinon.spy(apiService, 'put');
    _apiGetFullURLSpy = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _apiPostSpy.restore();
    _apiPutSpy.restore();
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

  describe('modifyReservation', function() {
    it('should fire a PUT request to reservations API', function() {
      _reservationService.modifyReservation('RESCODE');
      expect(_apiGetFullURLSpy.calledOnce).equal(true);
      expect(_apiGetFullURLSpy.calledWith('reservations.modify', {reservationCode: 'RESCODE'})).equal(true);

      expect(_apiPutSpy.calledOnce).equal(true);
    });
  });
});
