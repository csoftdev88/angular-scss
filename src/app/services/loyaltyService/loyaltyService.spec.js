'use strict';

describe('loyaltyService', function() {
  var _rootScope, _loyaltyService, _spyApiServiceGet,
  _spyApisServiceGetFullURL;

  var TEST_LOYALTIES = [
    {'code': 'abc', 'id': 123},
    {'code': 'abcd', 'id': 456}
  ];

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
        setHeaders: function() {},
        getFullURL: function(p){
          return p;
        }
      };
      $provide.value('apiService', apiService);
      $provide.value('userObject', {
        figur8Id: ''
      });
    });
  });

  beforeEach(inject(function($rootScope, loyaltyService, apiService) {
    _rootScope = $rootScope;
    _loyaltyService = loyaltyService;
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

    describe('when provided user id logged in', function() {
      it('should fire a GET request to loyalties API', function(){
        _loyaltyService.getAll(123);
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
