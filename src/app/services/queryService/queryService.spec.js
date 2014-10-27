'use strict';

describe('queryService', function() {
  var env;

  var TEST_PARAM_1 = 'code';
  var TEST_VALUE_1 = 'someCodeValue';

  var TEST_PARAMS = {
    'code': TEST_VALUE_1
  };

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.query', function($provide) {
      // Mocking Settings service
      var Settings = {
        'API': {
          'baseURL': 'http://server.com/',
          'content': {
            'about': 'about'
          }
        }
      };

      $provide.value('Settings', Settings);


      var locationService = {
        search: function(){
          return TEST_PARAMS;
        },
        $$compose: function(){},
        $$search: {
          'code': TEST_VALUE_1
        }
      };

      $provide.value('$location', locationService);
    });
  });

  beforeEach(inject(function($location, queryService) {
    env.queryService = queryService;
    env.$location = $location;

    env.locationSearchSpy = sinon.spy(env.$location, 'search');
    env.locationComposeSpy = sinon.spy(env.$location, '$$compose');
  }));

  afterEach(function() {
    env.locationSearchSpy.restore();
    env.locationComposeSpy.restore();
  });

  describe('setValue', function() {
    it('should update URL parameters', function() {
      env.queryService.setValue(TEST_PARAM_1, TEST_VALUE_1);

      expect(env.locationSearchSpy.calledOnce).equal(true);
      expect(env.locationSearchSpy.calledWith(TEST_PARAM_1, TEST_VALUE_1)).equal(true);
    });
  });

  describe('getValue', function() {
    it('should return requested parameter value', function() {
      var paramValue = env.queryService.getValue(TEST_PARAM_1);
      expect(paramValue).equal(TEST_VALUE_1);

      expect(env.locationSearchSpy.calledOnce).equal(true);
    });
  });


  describe('removeParam', function() {
    it('should remove query parameter from the URL', function() {
      env.queryService.removeParam(TEST_PARAM_1);

      expect(env.locationComposeSpy.calledOnce).equal(true);
      expect(env.$location.$$search[TEST_PARAM_1]).equal(undefined);
    });
  });
});
