'use strict';

describe('bestHotels', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet;

  var TEMPLATE = '<best-hotels></best-hotels>';
  var TEMPLATE_URL = 'directives/bestHotels/bestHotels.html';
  var TEMPLATE_CONTENT = '<span>123</span>';
  beforeEach(function() {
    module('mobiusApp.directives.best.hotels');
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
