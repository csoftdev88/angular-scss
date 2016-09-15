'use strict';

describe('formsService', function() {
  var _rootScope, _formsService, _spyApiServiceGet, _spyApiServicePost,
  _spyApisServiceGetFullURL;

  beforeEach(function() {
    module('mobiusApp.services.forms', function($provide) {
      var apiService = {
        get: function(){
          return {
            then: function(c){
              c();
            }
          };
        },
        post: function(){
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

  beforeEach(inject(function($rootScope, apiService, formsService) {
    _rootScope = $rootScope;
    _formsService = formsService;
    _spyApiServiceGet = sinon.spy(apiService, 'get');
    _spyApiServicePost = sinon.spy(apiService, 'post');
    _spyApisServiceGetFullURL = sinon.spy(apiService, 'getFullURL');
  }));

  afterEach(function() {
    _spyApiServiceGet.restore();
    _spyApiServicePost.restore();
    _spyApisServiceGetFullURL.restore();
  });

  describe('getContactForm', function() {
    it('should fire a GET request to forms.contact API', function(){
      _formsService.getContactForm();
      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApisServiceGetFullURL.calledWith('forms.contact')).equal(true);
      expect(_spyApiServiceGet.calledOnce).equal(true);
    });
  });

  describe('sendContactForm', function() {
    it('should fire a POST request to forms.contactSubmissions API', function(){
      _formsService.sendContactForm({name: 'test'});
      expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
      expect(_spyApisServiceGetFullURL.calledWith('forms.contactSubmissions')).equal(true);
      expect(_spyApiServicePost.calledOnce).equal(true);
      expect(_spyApiServicePost.calledWith('forms.contactSubmissions', {name: 'test'})).equal(true);
    });
  });
});
