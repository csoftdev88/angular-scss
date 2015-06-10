'use strict';
/*jshint -W030 */

describe('bookingWidget', function() {
  var env;

  var TEMPLATE = '<floating-bar></floating-bar>';
  var TEMPLATE_URL = 'directives/floatingBar/floatingBar.html';

  beforeEach(function() {
    env = {};

    module('mobiusApp.directives.floatingBar');

    inject(function($compile, $rootScope, $templateCache) {

      env.$compile = $compile;
      env.$rootScope = $rootScope.$new();

      env.$templateCache = $templateCache;
      env.$templateCache.put(TEMPLATE_URL, '');

      // Spy's
      env.templateCacheGet = sinon.spy(env.$templateCache, 'get');

      // Final component compile
      env.elem = env.$compile(TEMPLATE)(env.$rootScope);
      env.$rootScope.$digest();
      env.scope = env.elem.isolateScope();
    });
  });

  afterEach(function() {
    env.templateCacheGet.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(env.templateCacheGet.calledOnce).equal(true);
      expect(env.templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should have set active element', function() {
      expect(env.scope.active).to.not.be.empty;
    });

    it('should set active element', function() {
      var active = 'some-active';
      env.scope.setActive(active);
      expect(env.scope.active).equal(active);
    });
  });

});
