'use strict';

describe('siteMapContent', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet;

  var TEMPLATE = '<site-map-content/>';
  var TEMPLATE_URL = 'directives/siteMapContent/siteMapContent.html';

  beforeEach(function() {
    module('mobiusApp.directives.siteMap', function($provide, $controllerProvider){
      $controllerProvider.register('ContentCtr', function($scope){
          $scope._contentCtrlInherited = true;
        });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '<a>sitemapcontent</a>');

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

    it('should insert content from the template into a parent element', function() {
      expect(_elem.html()).equal('<a>sitemapcontent</a>');
    });

    it('should inherit ContentCtrl', function() {
      expect(_scope._contentCtrlInherited).equal(true);
    });
  });
});
