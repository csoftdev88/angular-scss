// TODO: Complete this
/*
'use strict';

describe('breadcrumbs', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet;

  var TEMPLATE = '<breadcrumbs></breadcrumbs>';
  var TEMPLATE_URL = 'directives/breadcrumbs/breadcrumbs.html';
  var TEMPLATE_CONTENT = '<span>breadcrumbs</span>';
  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.breadcrumbs', function($provide){
      $provide.value('$state', {});

      $provide.value('breadcrumbsService', {
        getBreadCrumbs: function(){
          return [{bc: 123}];
        },

        getHrefs: function(){
          return [{href: 123}];
        },

        getAbsHrefs: function(){
          return [{abs: 123}];
        },

        getActiveHref: function(){
          return [{activeHref: 123}];
        }
      });
      $provide.value('modalService', {});
      $provide.value('scrollService', {});
      $provide.value('contentService', {});
    });
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
*/