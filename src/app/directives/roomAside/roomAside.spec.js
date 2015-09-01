'use strict';

describe('roomAside', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet;

  var TEMPLATE = '<room-aside/>';
  var TEMPLATE_URL = 'directives/roomAside/roomAside.html';

  beforeEach(function() {
    module('mobiusApp.directives.room.aside');
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, 'test');

      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');

    // Initialization
    _elem = _$compile(TEMPLATE)(_$rootScope);

    _$rootScope.$digest();
    _scope = _elem.isolateScope();
  }));

  afterEach(function(){
    _templateCacheGet.restore();
  });

  describe('when directive is initialized', function() {
    it('should get directives template form template cache)', function() {
      expect(_templateCacheGet.calledOnce).equal(true);
      expect(_templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should insert template content into a parent element', function() {
      expect(_elem.html()).equal('test');
    });
  });
});
