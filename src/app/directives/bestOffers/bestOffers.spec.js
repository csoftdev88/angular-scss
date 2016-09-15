'use strict';

describe('bestOffers', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet;

  var TEMPLATE = '<best-offers></best-offers>';
  var TEMPLATE_URL = 'directives/bestOffers/bestOffers.html';
  var TEMPLATE_CONTENT = '<span>offers</span>';
  beforeEach(function() {
    module('mobiusApp.directives.best.offers');
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _element = _$compile(TEMPLATE)(_$rootScope);
    $rootScope.$digest();
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
  });
});
