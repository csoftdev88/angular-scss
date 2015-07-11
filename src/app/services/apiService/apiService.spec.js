'use strict';

describe('apiService', function() {
  var env, _spyExtend;
  var TEST_URL = 'http://testurl';
  var TEST_DATA = {'data': 'OK'};

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.api', function($provide) {
      // Mocking Settings service
      var Settings = {
        'API': {
          'baseURL': 'http://server.com/',
          'content': {
            'about': 'about',
            'withPlaceholders': 'path/:someParam/v1'
          }
        }
      };

      $provide.value('Settings', Settings);

      $provide.value('_', {
        extend: function(){}
      });
    });
  });

  beforeEach(inject(function($rootScope, $httpBackend, _, apiService) {
    env.apiService = apiService;
    env.httpBackend = $httpBackend;
    env.rootScope = $rootScope;
    _spyExtend = sinon.spy(_, 'extend');
  }));

  afterEach(function(){
    _spyExtend.restore();
  });

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

  describe('Other methods', function() {
    describe('getFullURL', function() {
      it('should return correctly formated URL adress', function() {
        var URL = env.apiService.getFullURL('content.about');

        expect(URL).equal('http://server.com/about');
      });

      it('should return only baseURL in case when key is not found in configuration', function() {
        var URL = env.apiService.getFullURL('content.someother');

        expect(URL).equal('http://server.com/');
      });

      it('should return correctly formated URL with replaced params', function() {
        var URL = env.apiService.getFullURL('content.withPlaceholders',
          {someParam: 'abc'});

        expect(URL).equal('http://server.com/path/abc/v1');
      });
    });

    describe('setHeaders', function() {
      it('should extend the existing headers', function() {
        env.apiService.setHeaders({'test': 123});
        expect(_spyExtend.calledOnce).equal(true);
        expect(_spyExtend.calledWith({'test': 123}));
      });
    });
  });
});
