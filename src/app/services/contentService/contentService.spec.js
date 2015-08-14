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
          'contents': {
            'contents': 'contents',
            'news': 'contents/news',
            'offers': 'contents/offers',
            'adverts': {
              'random': 'contents/adverts/random'
            }
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
        getThrottled: function(){},
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
    env.apiGetThrottledSpy = sinon.spy(env.apiService, 'getThrottled');
    env.apiGetFullURLSpy = sinon.spy(env.apiService, 'getFullURL');
  }));

  afterEach(function() {
    env.apiPostSpy.restore();
    env.apiGetSpy.restore();
    env.apiGetThrottledSpy.restore();
  });


  describe('getNews', function() {
    it('should fire a GET request to contents API', function() {
      env.contentService.getNews();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('contents.news')).equal(true);

      expect(env.apiGetThrottledSpy.calledOnce).equal(true);
    });
  });

  describe('getAbout', function() {
    it('should fire a GET request to contents API', function() {
      env.contentService.getAbout();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('contents.about')).equal(true);

      expect(env.apiGetThrottledSpy.calledOnce).equal(true);
    });
  });

  describe('getOffers', function() {
    it('should fire a GET request to contents API', function() {
      env.contentService.getOffers();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('contents.offers')).equal(true);

      expect(env.apiGetThrottledSpy.calledOnce).equal(true);
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

  describe('getRandomAdverts', function() {
    it('should fire a GET request to content/adverts/random API', function() {
      env.contentService.getRandomAdvert();
      expect(env.apiGetFullURLSpy.calledOnce).equal(true);
      expect(env.apiGetFullURLSpy.calledWith('contents.adverts.random')).equal(true);

      expect(env.apiGetSpy.calledOnce).equal(true);
    });
  });

  describe('getLightBoxContent', function() {
    it('should convert images into hero slider format without titles', function() {
      var images = env.contentService.getLightBoxContent([
        {uri: 'test.com'}
      ]);
      expect(images.length).equal(1);
      expect(images[0].uri).equal('test.com');
    });

    it('should convert images into hero slider format including titles', function() {
      var images = env.contentService.getLightBoxContent([
        {uri: 'test.com', alt:'test alt'}
      ]);
      expect(images.length).equal(1);
      expect(images[0].title).equal('test alt');
      expect(images[0].subtitle).equal('test alt');
    });
  });
});
