'use strict';

describe('RoomProducts', function() {
  var TEMPLATE = '<room-products></room-products>';
  var TEMPLATE_URL = 'directives/roomProducts/roomProducts.html';
  var TEMPLATE_CONTENT = '<div>room products</div>';

  var _rootScope, _scope, _elem, _templateCache, _spyTemplateCacheGet;

  beforeEach(function() {
    module('mobiusApp.directives.room.products');
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _rootScope = $rootScope.$new();
    _templateCache = $templateCache;
    _templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    // Spy's
    _spyTemplateCacheGet = sinon.spy(_templateCache, 'get');
    // Final component compile
    _elem = $compile(TEMPLATE)(_rootScope);
    _rootScope.$digest();
    _scope = _elem.isolateScope();
  }));

  afterEach(function() {
    _spyTemplateCacheGet.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should compile widget template', function() {
      expect(_elem.html()).equal(TEMPLATE_CONTENT);
    });
  });
});
