'use strict';

describe('chainService', function() {
  var _rootScope, _chainService, _spyApiServiceGet,
  _spyApisServiceGetFullURL;

  beforeEach(function() {
    module('mobiusApp.services.chains', function($provide) {
      var apiService = {
        get: function(){
          return {
            then: function(c){
              c();
            }
          };
        },

        getFullURL: function(p){
          return p;
        }
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function($rootScope, apiService, chainService) {
    _rootScope = $rootScope;
    _chainService = chainService;
    _spyApiServiceGet = sinon.spy(apiService, 'get');
    _spyApisServiceGetFullURL = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _spyApiServiceGet.restore();
    _spyApisServiceGetFullURL.restore();
  });

  describe('getChain', function() {
    it('should be defined as a function', function() {
      expect(_chainService.getChain).to.be.an('function');
    });

    it('should fire a GET request to chain/:code API', function(){
      _chainService.getChain();
      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApisServiceGetFullURL.calledWith('chain.get')).equal(true);
      expect(_spyApiServiceGet.calledOnce).equal(true);
    });
  });
});
