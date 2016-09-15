'use strict';
/*
describe('slugImg', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet;

  var TEMPLATE = '<slug-img type="some-type" slug="slug" width="300" height="50"/>';
  var TEMPLATE_URL = 'directives/slugImg/slugImg.html';

  beforeEach(function() {
    module('mobiusApp.directives.slugImg', function($provide){
      $provide.value('Settings', {
        UI: {
          cloudinary: {
            'prefix-some-type': 'pref',
            'suffix': 'sufix'
          }
        }
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '<p>slugimg</p>');

      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');

    _$rootScope.slug = 'slug';
    _$rootScope.type = 'some-type';
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
      expect(_elem.html()).equal('slugimg');
    });

    it('should define slug src on scope', function() {
      expect(_scope.src).equal('prefslugsufix/w_300,c_limit');
    });
  });
});
*/
