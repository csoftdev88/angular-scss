'use strict';

describe('contentService', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.content', function($provide) {
      var Settings = {
        'API': {
          'baseURL': 'http://domain/',
          'content': {
            'news': 'content/news',
            'loyalties': 'content/simpleloyalties',
            'offers': 'content/specialoffers',
            'abouts': 'content/abouts'
          },

          'generics': {
            'currencies': 'generics/currencies',
            'languages': 'generics/languages'
          }
        }
      };

      $provide.value('Settings', Settings);

      var apiService = {
        post: function(){},
        get: function(){},
        getFullURL: function(){}
      };

      $provide.value('apiService', apiService);
    });
  });

  beforeEach(inject(function($rootScope, apiService, Settings, contentService) {
    env.contentService = contentService;
    env.rootScope = $rootScope;
    env.apiService = apiService;

    env.apiPostSpy = sinon.spy(env.apiService, 'post');
    env.apiGetSpy = sinon.spy(env.apiService, 'get');
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiPostSpy.restore();
    env.apiGetSpy.restore();
  });


  describe('getNews', function() {
    it('should fire a GET request to content/news API', function() {
      env.contentService.getNews();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('content.news')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getAbout', function() {
    it('should fire a GET request to content/abouts API', function() {
      env.contentService.getAbout();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('content.abouts')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getOffers', function() {
    it('should fire a GET request to content/specialoffers API', function() {
      env.contentService.getOffers();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('content.offers')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getCurrencies', function() {
    it('should fire a GET request to generics/currencies API', function() {
      env.contentService.getCurrencies();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('generics.currencies')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getLanguages', function() {
    it('should fire a GET request to generics/languages API', function() {
      env.contentService.getLanguages();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('generics.languages')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });
});
