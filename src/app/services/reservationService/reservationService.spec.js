'use strict';

describe('reservationService', function() {

  var _reservationService, _apiPostSpy, _apiGetSpy, _apiPutSpy, _apiGetFullURLSpy;

  var userLoggedIn = {
    getCustomerId: function(){return 123;}
  };

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
        get: function(){},
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
    });
  });

  function setUp(user){
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
        put: function(){},
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
      $provide.value('user', user || userLoggedIn);
    });

    inject(function(apiService, reservationService) {
      _reservationService = reservationService;

      _apiPostSpy = sinon.spy(apiService, 'post');
      _apiPutSpy = sinon.spy(apiService, 'put');
      _apiGetSpy = sinon.spy(apiService, 'get');
      _apiGetFullURLSpy = sinon.spy(apiService, 'getFullURL');
    });
  }

  function tearDown(){
    _apiPostSpy.restore();
    _apiPutSpy.restore();
    _apiGetSpy.restore();
    _apiGetFullURLSpy.restore();
  }

  afterEach(function() {
    tearDown();
  });

  describe('createReservation', function() {
    beforeEach(function(){
      setUp();
    });

    it('should fire a POST request to reservations API', function() {
      _reservationService.createReservation();
      expect(_apiGetFullURLSpy.calledOnce).equal(true);
      expect(_apiGetFullURLSpy.calledWith('reservations.new')).equal(true);

      expect(_apiPostSpy.calledOnce).equal(true);
    });
  });

  describe('modifyReservation', function() {
    beforeEach(function(){
      setUp();
    });

    it('should fire a PUT request to reservations API', function() {
      _reservationService.modifyReservation('RESCODE');
      expect(_apiGetFullURLSpy.calledOnce).equal(true);
      expect(_apiGetFullURLSpy.calledWith('reservations.modify', {reservationCode: 'RESCODE'})).equal(true);

      expect(_apiPutSpy.calledOnce).equal(true);
    });
  });

  describe('when user is logged-in', function(){
    beforeEach(function(){
      setUp();
    });

    describe('getAll', function() {
      it('should fire a GET request to reservations API', function() {
        _reservationService.getAll();
        expect(_apiGetFullURLSpy.calledOnce).equal(true);
        expect(_apiGetFullURLSpy.calledWith('reservations.all')).equal(true);
        expect(_apiGetSpy.calledOnce).equal(true);

        var params = _apiGetSpy.args[0];
        expect(params[1].customerId).equal(123);
      });
    });

    describe('getReservation', function() {
      it('should fire a GET request to reservations API with reservationCode query param', function() {
        _reservationService.getReservation('testCode');
        expect(_apiGetFullURLSpy.calledOnce).equal(true);
        expect(_apiGetFullURLSpy.calledWith('reservations.detail')).equal(true);
        expect(_apiGetSpy.calledOnce).equal(true);

        var params = _apiGetFullURLSpy.args[0];
        expect(params[1].reservationCode).equal('testCode');
      });
    });
  });
});
