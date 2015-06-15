'use strict';

describe('errSource', function() {
  var env;
  var TEMPLATE = '<img ng-src="missing.png" data-err-source="test.png"/>';

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.directives.errSource', function() {});
  });

  beforeEach(inject(function($rootScope, $httpBackend, $compile) {
    env.$rootScope = $rootScope.$new();
    env.$httpBackend = $httpBackend;

    // Final component compile
    env.elem = $compile(TEMPLATE)(env.$rootScope);
    env.$rootScope.$digest();
    env.scope = env.elem.isolateScope();
  }));

  describe('error handling', function() {
    it('should set src attribue when error occured on the element', function() {
      env.elem.triggerHandler('error');
      expect(env.elem.attr('src')).equal('test.png');
    });
  });
});