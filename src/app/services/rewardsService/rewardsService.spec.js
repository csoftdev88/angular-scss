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
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiGetSpy.restore();
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

  /*

  describe('getRewardsDetails', function(){
    it('should fire a GET request to rewards details API', function(){
      env.propertyService.getPropertyDetails('ABC', {a:'test'});

      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith(
        'properties.details', {rewardCode:'ABC'})).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
      expect(env.apiGetSpy.calledWith('rewards.details', {a: 'test'})).equal(true);
    });
  });

*/

  
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

  
});
