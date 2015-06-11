'use strict';

describe('propertyService', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.locations', function($provide) {
      var Settings = {
        'API': {
          'baseURL': 'http://domain/',

          'locations': {
            'locations': 'locations',
            'regions': 'regions'
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

  beforeEach(inject(function($rootScope, apiService, Settings, locationService) {
    env.locationService = locationService;
    env.rootScope = $rootScope;
    env.apiService = apiService;

    env.apiGetSpy = sinon.spy(env.apiService, 'get');
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiGetSpy.restore();
    env.apiGetFullURLSpy.restore();
  });

  describe('getLocations', function() {
    it('should fire a GET request to locations API', function() {
      env.locationService.getLocations();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('locations.locations')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getRegions', function() {
    it('should fire a GET request to regions API', function() {
      env.locationService.getRegions();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('locations.regions')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

});
