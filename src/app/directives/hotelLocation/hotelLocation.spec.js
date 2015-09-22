'use strict';

describe('hotelLocation', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet, _scope;

  var TEMPLATE = '<hotel-location hotel-details="details"></hotel-location>';
  var TEMPLATE_URL = 'directives/hotelLocation/hotelLocation.html';
  var TEMPLATE_CONTENT = '<span>location data</span>';

  beforeEach(function() {
    module('mobiusApp.directives.hotelLocation');
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

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

    it('should not define position data on scope', function(){
      expect(_scope.position).equal(undefined);
    });
  });

  describe('watcher', function() {
    it('should watch hotelDetails object passed via attributes and update position object on scope', function(){
      expect(_$rootScope.position).equal(undefined);
      _$rootScope.details = {
        lat: 'lat',
        long: 'long'
      };

      _$rootScope.$digest();
      expect(_scope.position[0]).equal('lat');
      expect(_scope.position[1]).equal('long');
    });
  });
});
