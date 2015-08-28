'use strict';

describe('imageCarousel', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet, _scope;

  var TEMPLATE = '<image-carousel images="images"></image-carousel>';
  var TEMPLATE_URL = 'directives/imageCarousel/imageCarousel.html';
  var TEMPLATE_CONTENT = '<span>carousel</span>';

  var TEST_SETTINGS = {
    minImages: 3
  };

  beforeEach(function() {
    module('mobiusApp.directives.imageCarousel', function($provide){
      $provide.value('Settings', {
        UI: {
          imageCarousel: TEST_SETTINGS
        }
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _$rootScope.images = ['img1', 'img2', 'img3'];

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

    it('should define settings on scope', function(){
      expect(_scope.settings).equal(TEST_SETTINGS);
    });

    it('should set index to 0', function(){
      expect(_scope.index).equal(0);
    });
  });

  describe('moveRight', function() {
    it('should increase image index', function(){
      _scope.moveRight();
      expect(_scope.index).equal(1);
    });

    it('should set index the 0 when scrolled to the end of the gallery', function(){
      _scope.moveRight();
      _scope.moveRight();
      expect(_scope.index).equal(2);
      _scope.moveRight();
      expect(_scope.index).equal(0);
    });
  });

  describe('moveLeft', function() {
    it('should set image index to the number of image when scrolled backwards from the first image', function(){
      _scope.moveLeft();
      expect(_scope.index).equal(2);
    });

    it('should decrease the index when scrolled left', function(){
      _scope.moveLeft();
      _scope.moveLeft();
      expect(_scope.index).equal(1);
      _scope.moveLeft();
      expect(_scope.index).equal(0);
    });
  });

  describe('setSelected', function() {
    it('should set index', function(){
      _scope.setSelected(1);
      expect(_scope.selected).equal(1);
    });
  });

  describe('getCarousel', function() {
    it('should limit a number of images', function(){
      expect(_scope.getCarousel(['img1','img2','img3','img4']).length).equal(3);
    });
  });
});
