'use strict';

describe('heroSlider', function() {
  var env;

  var TEMPLATE_PLACEHOLDER = '<hero-slider content="testContent"></hero-slider>';
  var TEMPLATE_CONTENT = '<div class="slider-content"></div><div class="slider-controls"></div>';

  var TEMPLATE_URL = 'directives/heroSlider/heroSlider.html';

  //var SLIDE_TYPE_INFO = 'directives/heroSlider/slides/info.html';
  var SLIDE_TYPE_SIMPLE = 'directives/heroSlider/slides/simple.html';

  var TEST_SETTINGS = {
    'autoplayDelay': 5000,
    'animationDuration': 800,
    'preloadImages': false
  };

  var TEST_CONTENT = [
    {
      title: 'Promotions',
      categoryName: 'testCat',
      id: 'testID'
    }
  ];

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.directives.slider', function($provide) {
      // Mocking the services
      $provide.value('Settings', {
        UI: {
          heroSlider: TEST_SETTINGS
        }
      });

      $provide.value('$state', {
        go: function(){}
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $state, $templateCache) {

    env.$compile = $compile;
    env.$rootScope = $rootScope.$new();
    env.$state = $state;

    env.$templateCache = $templateCache;
    env.$templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);

    // Spy's
    env.templateCacheGetSpy = sinon.spy(env.$templateCache, 'get');
    env.stateGoSpy = sinon.spy(env.$state, 'go');

    // Final component compile
    env.elem = env.$compile(TEMPLATE_PLACEHOLDER)(env.$rootScope);

    env.$rootScope.testContent = TEST_CONTENT;

    env.$rootScope.$digest();
    env.scope = env.elem.isolateScope();
  }));

  afterEach(function() {
    env.templateCacheGetSpy.restore();
    env.stateGoSpy.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(env.templateCacheGetSpy.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should insert a slide with a simple layout in case when content doesnt have subtitle', function() {
      expect(env.templateCacheGetSpy.calledWith(SLIDE_TYPE_SIMPLE)).equal(true);
    });

    it('should assign content data according to the reference from the view', function() {
      expect(env.scope.content.length).equal(1);
    });

    it('should set slideIndex correctly', function() {
      expect(env.scope.slideIndex).equal(0);
    });
  });

  describe('onContentClick', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.onContentClick).to.be.an('function');
    });

    it('should navigate to the offers state in case caterory and offer ID are specified', function() {
      env.scope.onContentClick();

      expect(env.stateGoSpy.calledOnce).equal(true);
      expect(env.stateGoSpy.calledWith('index.offers', {category: 'testCat', offerID: 'testID'})).equal(true);
    });
  });

  describe('slideToIndex', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.slideToIndex).to.be.an('function');
    });
  });

  describe('slide', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.slide).to.be.an('function');
    });
  });

  describe('preventClick', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.preventClick).to.be.an('function');
    });
  });
});
