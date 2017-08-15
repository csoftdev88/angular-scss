'use strict';

describe('rewardsService', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.rewards', function($provide) {
      var Settings = {
        'API': {
          'baseURL': 'http://domain/',

          'properties': {
            'all': 'rewards',
            'details': 'rewards/rewardCode'
          }
        }
      };

      $provide.value('Settings', Settings);

      var apiService = {
        get: function(){},
        post: function(){},
        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);

    });
  });

  beforeEach(inject(function($rootScope, apiService, Settings, rewardsService) {
    env.rewardsService = rewardsService;
    env.rootScope = $rootScope;
    env.apiService = apiService;

    env.apiGetSpy = sinon.spy(env.apiService, 'get');
    env.apiPostSpy = sinon.spy(env.apiService, 'post');
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiGetSpy.restore();
    env.apiPostSpy.restore();
    env.apiGetFullURLSpy.restore();
  });

  describe('getAll', function() {
    it('should fire a GET request to rewards API', function() {
      env.rewardsService.getAll();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('rewards.all')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getMy', function() {
    it('should fire a GET request to rewards.my API', function() {
      env.rewardsService.getMy(123);
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('rewards.my', {customerId: 123})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('rewards.my')).equal(true);
    });
  });

  describe('buyReward', function() {
    it('should fire a POST request to rewards.my API', function() {
      env.rewardsService.buyReward(123, 321);
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('rewards.my', {customerId: 123})).equal(true);

      expect(env.apiPostSpy.calledOnce).equal(true);
      expect(env.apiPostSpy.calledWith('rewards.my', {rewardId:321})).equal(true);
    });
  });
});
