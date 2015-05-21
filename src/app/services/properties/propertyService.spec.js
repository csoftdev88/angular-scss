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
            'details': 'properties/propertyCode'
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
});
