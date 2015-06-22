'use strict';

describe('reservationService', function() {
  var _reservationService, _apiPostSpy, _apiGetSpy,
    _apiGetFullURLSpy;

  var userLoggedIn = {
    isLoggedIn: function(){return true;},
    getUser: function(){return {id: 123};}
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
        get: function(){},
        getFullURL: function(p){
          return p;
        },
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
        getFullURL: function(p){
          return p;
        },
      };

      $provide.value('apiService', apiService);

      $provide.value('user', user || userLoggedIn);
    });

    inject(function(apiService, reservationService) {
      _reservationService = reservationService;

      _apiPostSpy = sinon.spy(apiService, 'post');
      _apiGetSpy = sinon.spy(apiService, 'get');
      _apiGetFullURLSpy = sinon.spy(apiService, 'getFullURL');
    });
  }

  function tearDown(){
    _apiPostSpy.restore();
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

    describe('getReservationDetails', function() {
      it('should fire a GET request to reservations API with reservationCode query param', function() {
        _reservationService.getReservationDetails('testCode');
        expect(_apiGetFullURLSpy.calledOnce).equal(true);
        expect(_apiGetFullURLSpy.calledWith('reservations.all')).equal(true);
        expect(_apiGetSpy.calledOnce).equal(true);

        var params = _apiGetSpy.args[0];
        expect(params[1].customerId).equal(123);
        expect(params[1].reservationCode).equal('testCode');
      });

      it('should throw an error when reservation code is not provided', function() {
        expect(_reservationService.getReservationDetails).to.throw(/reservationCode must be provided/);
      });
    });
  });
});
