'use strict';

describe('breadcrumbs', function() {
  var _$compile, _$rootScope, _element, _scope, _modalService, _contentService,
    _breadcrumbsService, _scrollService, _spyTemplateCacheGet, _stubAngularElement,
    _underscore, _Settings;

  var TEMPLATE = '<breadcrumbs></breadcrumbs>';
  var TEMPLATE_URL = 'directives/breadcrumbs/breadcrumbs.html';
  var TEMPLATE_CONTENT = '<span>breadcrumbs</span>';

  var STATE = {
    current: {}
  };

  beforeEach(function() {
    module('mobiusApp.directives.breadcrumbs', function($provide){
      $provide.value('$state', STATE);

      $provide.value('_', {
        find: window._.find,
        findWhere: window._.findWhere,
        debounce: function(c){return c;}
      });

      $provide.value('breadcrumbsService', {
        getVisibleHref: sinon.stub(),

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
          return 'activeHref';
        }
      });

      $provide.value('modalService', {
        openGallery: sinon.spy()
      });

      $provide.value('scrollService', {
        scrollTo: sinon.spy()
      });

      $provide.value('contentService', {
        getLightBoxContent: sinon.spy()
      });

      $provide.value('Settings', {
        UI: {
          generics: {
            showAltNav: true
          }
        }
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, modalService, contentService,
      scrollService, breadcrumbsService, _, Settings) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _Settings = Settings;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _modalService = modalService;
    _contentService = contentService;
    _scrollService = scrollService;
    _breadcrumbsService = breadcrumbsService;

    _underscore = _;

    _stubAngularElement = sinon.stub(angular, 'element').returns({
      bind: sinon.spy(),
      unbind: sinon.spy()
    });

    _element = _$compile(TEMPLATE)(_$rootScope);
    _scope = _element.scope();
    $rootScope.$digest();
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
    _stubAngularElement.restore();
  });

  describe('when initialized', function() {
    it('should download a template from template-cache', function(){
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should append template content to a current element', function(){
      expect(_element.html()).equal(TEMPLATE_CONTENT);
    });

    it('should define $state on scope', function(){
      expect(_scope.$state).equal(STATE);
    });

    it('should define breadcrumbs on scope', function(){
      expect(_scope.breadcrumbs.length).equal(1);
      expect(_scope.breadcrumbs[0].bc).equal(123);
    });

    it('should define absHrefs on scope', function(){
      expect(_scope.absHrefs.length).equal(1);
      expect(_scope.absHrefs[0].abs).equal(123);
    });

    it('should define hrefs on scope', function(){
      expect(_scope.hrefs.length).equal(1);
      expect(_scope.hrefs[0].href).equal(123);
    });

    it('should define activeHref on scope', function(){
      expect(_scope.activeHref).equal('activeHref');
    });

    it('should bind to scroll, resize events', function(){
      expect(_stubAngularElement().bind.called).equal(true);
      expect(_stubAngularElement().bind.calledWith('scroll resize')).equal(true);
    });
  });

  describe('scrollTo', function(){
    beforeEach(function(){
      _scope.hrefs = [{id: 'hrefId', name: 'testName'}];
      _stubAngularElement.returns([1,2]);
    });

    it('should be defined as a function on scope', function(){
      expect(_scope.scrollTo).to.be.a('function');
    });

    it('should open lightbox gallery when called with fnOpenLightBox', function(){
      _scope.heroContent = [1,2];

      _scope.scrollTo('fnOpenLightBox');

      expect(_contentService.getLightBoxContent.calledOnce).equal(true);
      expect(_contentService.getLightBoxContent.calledWith(_scope.heroContent)).equal(true);

      expect(_modalService.openGallery.calledOnce).equal(true);
    });

    it('should navigate to a href when found in DOM', function(){
      _scope.scrollTo('hrefId');

      expect(_scrollService.scrollTo.calledOnce).equal(true);
      expect(_scrollService.scrollTo.calledWith('hrefId', 20)).equal(true);
    });

    it('should set activeHref properly when found within hrefs', function(){
      _scope.scrollTo('hrefId');

      expect(_scope.activeHref).equal('testName');
    });
  });

  describe('when scroll event is broadcasted', function(){
    it('should call getVisibleHref on breadcrumbsService', function(){
      var activeHref = {id: 'testId'};
      var scrollFunction = _stubAngularElement().bind.args[0][1];

      _breadcrumbsService.getVisibleHref.returns(activeHref);
      _scope.hrefs = [activeHref];

      scrollFunction();
      _scope.$digest();
      expect(_breadcrumbsService.getVisibleHref.calledOnce).equal(true);
      expect(_scope.scrollActiveHref).equal(activeHref);
    });
  });


  describe('when component is destroyed', function(){
    beforeEach(function(){
      _scope.$broadcast('$destroy');
      _scope.$digest();
    });

    it('should remove resize, scroll listeners', function(){
      expect(_stubAngularElement().unbind.calledOnce).equal(true);
      expect(_stubAngularElement().unbind.calledWith('scroll resize')).equal(true);
    });
  });
});
