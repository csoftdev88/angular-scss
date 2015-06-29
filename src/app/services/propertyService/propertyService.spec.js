'use strict';

describe('propertyService', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.properties', function($provide) {
      var Settings = {
        'API': {
          'baseURL': 'http://domain/',

          'properties': {
            'all': 'properties',
            'details': 'properties/propertyCode',
            'availability': 'properties/propertyCode/availability'
          }
        }
      };

      $provide.value('Settings', Settings);

      var apiService = {
        get: function(){},
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function($rootScope, apiService, Settings, propertyService) {
    env.propertyService = propertyService;
    env.rootScope = $rootScope;
    env.apiService = apiService;

    env.apiGetSpy = sinon.spy(env.apiService, 'get');
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiGetSpy.restore();
    env.apiGetFullURLSpy.restore();
  });

  describe('getAll', function() {
    it('should fire a GET request to properties API', function() {
      env.propertyService.getAll();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('properties.all')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getPropertyDetails', function(){
    it('should fire a GET request to property details API', function(){
      env.propertyService.getPropertyDetails('ABC', {a:'test'});

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.details', {propertyCode:'ABC'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.details', {a: 'test'})).equal(true);
    });
  });

  describe('getAvailability', function(){
    it('should fire a GET request to property availability API', function(){
      env.propertyService.getAvailability('ABC', {a:'test'});

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.availability', {propertyCode:'ABC'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.availability', {a: 'test'})).equal(true);
    });
  });

  describe('getRooms', function(){
    it('should fire a GET request to list if rooms API', function(){
      env.propertyService.getRooms('ABC');

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.room.all', {propertyCode:'ABC'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.room.all')).equal(true);
    });
  });

  describe('getRoomDetails', function(){
    it('should fire a GET request to room details API', function(){
      env.propertyService.getRoomDetails('ABC', 'QWN');

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.room.details', {propertyCode:'ABC', roomTypeCode: 'QWN'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.room.details')).equal(true);
    });
  });
  /* **in this version we don't call room products - unless it will come from booking bar**
  describe('getRoomProducts', function(){
    it('should fire a GET request to room product list API', function(){
      var bookingParams = {'test': 'test123'};
      env.propertyService.getRoomProducts('ABC', 'QWN', bookingParams);

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.room.product.all', {propertyCode:'ABC', roomTypeCode: 'QWN'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.room.product.all', bookingParams)).equal(true);
    });
  });
  */

  describe('getRoomProductAddOns', function(){
    it('should fire a GET request to room product addons list API', function(){
      var bookingParams = {'test': 'test123'};
      env.propertyService.getRoomProductAddOns('ABC', 'QWN', 'LW14', bookingParams);

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.room.product.addons', {propertyCode:'ABC', roomTypeCode: 'QWN', productCode: 'LW14'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('properties.room.product.addons', bookingParams)).equal(true);
    });
  });
});
