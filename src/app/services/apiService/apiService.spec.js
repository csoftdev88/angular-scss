'use strict';

describe('apiService', function() {
  var env;
  var TEST_URL = 'http://testurl';
  var TEST_DATA = {'data': 'OK'};

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.api');
  });

  beforeEach(inject(function($rootScope, $httpBackend, apiService) {
    env.apiService = apiService;
    env.httpBackend = $httpBackend;
    env.rootScope = $rootScope;
  }));


  describe('API comunication', function() {
    describe('GET method', function() {
      afterEach(function() {
        env.httpBackend.verifyNoOutstandingExpectation();
        env.httpBackend.verifyNoOutstandingRequest();
      });

      it('should fire a GET request and return fulfilled promise', function() {
        env.httpBackend.expectGET(TEST_URL)
        .respond(200, TEST_DATA);

        var resolvedValue;

        env.apiService.get(TEST_URL).then(function(data){
          resolvedValue = data;
        });

        env.httpBackend.flush();
        env.rootScope.$apply();
        expect(resolvedValue.data).equal(TEST_DATA.data);
      });


      it('should return rejected promise in case server doesnt return HTTP status 200', function() {
        env.httpBackend.expectGET(TEST_URL).respond(500);
        var resolvedValue = true;

        env.apiService.get(TEST_URL).then(function(){
        }, function() {
          resolvedValue = false;
        });
        env.httpBackend.flush();
        env.rootScope.$apply();
        expect(resolvedValue).equal(false);
      });
    });
  });
});
