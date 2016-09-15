'use strict';

describe('hotelLocation', function() {
  var _$compile, _$rootScope, _element, _chainService,
    _spyTemplateCacheGet, _scope;

  var TEMPLATE = '<hotel-location hotel-details="details"></hotel-location>';
  var TEMPLATE_URL = 'directives/hotelLocation/hotelLocation.html';
  var TEMPLATE_CONTENT = '<span>location data</span>';
  var CHAIN_DATA = {
      images: [1,2],
      meta: {
        description: 'desc',
        pagetitle: 'title',
        keywords: 'kw',
        microdata: {
          og: 'og-microdata'
        }
      }
    };

  beforeEach(function() {
    module('mobiusApp.directives.hotelLocation', function ($provide) {
      $provide.value('chainService', {
        getChain: sinon.stub()
      });

      $provide.value('Settings', {
        API: {
          chainCode: 'TESTCHAIN'
        },
        UI: {
          viewsSettings:{
            locationMap:{}
          }
        }
      });
    });

  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, $q, chainService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _chainService = chainService;
    _chainService.getChain.returns($q.when(CHAIN_DATA));

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _element = _$compile(TEMPLATE)(_$rootScope);
    $rootScope.$digest();
    _scope = _element.isolateScope();
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
  });

  describe('when initialized', function() {
    it('should download a template from template-cache', function(){
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should append template content to a current element', function(){
      expect(_element.html()).equal(TEMPLATE_CONTENT);
    });

    it('should not define position data on scope', function(){
      expect(_scope.position).equal(undefined);
    });
  });

  describe('watcher', function() {
    it('should watch hotelDetails object passed via attributes and update position object on scope', function(){
      expect(_$rootScope.position).equal(undefined);
      _$rootScope.details = {
        lat: 'lat',
        long: 'long'
      };

      _$rootScope.$digest();
      expect(_scope.position[0]).equal('lat');
      expect(_scope.position[1]).equal('long');
    });
  });
});
