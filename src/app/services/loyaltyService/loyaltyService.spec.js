'use strict';

describe('loyaltyService', function() {
  var _rootScope, _loyaltyService, _user, _spyApiServiceGet,
  _spyApisServiceGetFullURL;

  var TEST_LOYALTIES = [
    {'code': 'abc', 'id': 123},
    {'code': 'abcd', 'id': 456}
  ];

  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    module('mobiusApp.services.loyalty', function($provide) {
      // Mocking $stateParams service
      $provide.value('Settings', {});

      var apiService = {
        get: function(){
          return {
            then: function(c){
              c(TEST_LOYALTIES);
            }
          };
        },
        getFullURL: function(p){
          return p;
        }
      };
      $provide.value('apiService', apiService);

      var userService = {
        isLoggedIn: sandbox.stub(),
        getUser: sandbox.stub()
      };
      $provide.value('user', userService);
    });
  });

  beforeEach(inject(function($rootScope, loyaltyService, apiService, user) {
    _rootScope = $rootScope;
    _loyaltyService = loyaltyService;
    _user = user;
    _spyApiServiceGet = sinon.spy(apiService, 'get');
    _spyApisServiceGetFullURL = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _spyApiServiceGet.restore();
    _spyApisServiceGetFullURL.restore();
  });

  describe('getAll', function() {
    it('should be defined as a function', function() {
      expect(_loyaltyService.getAll).to.be.an('function');
    });

    describe('when user is not logged in', function() {
      it('should throw an error', function() {
        expect(_loyaltyService.getAll).to.throw(/User must be logged in/);
      });
    });

    describe('when user logged in', function() {
      beforeEach(function(){
        _user.isLoggedIn.returns(true);
        _user.getUser.returns({id: 123});
      });

      it('should not throw an error', function() {
        expect(_loyaltyService.getAll).not.to.throw(/User must be logged in/);
      });

      it('should fire a GET request to loyalties API', function(){
        _loyaltyService.getAll();
        expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
        expect(_spyApisServiceGetFullURL.calledWith('loyalties.all', {customerId: 123})).equal(true);
        expect(_spyApiServiceGet.calledOnce).equal(true);
      });

      it('should return promise and resolve it with a loyalty data from the server', function(){
        var loyalties;

        _loyaltyService.getAll().then(function(data){
          loyalties = data;
        });
        _rootScope.$apply();
        expect(loyalties).equal(TEST_LOYALTIES);
      });
    });
  });
});
