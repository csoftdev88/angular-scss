'use strict';

describe('dynamicLayoutDirective', function() {
  var env;

  var TEMPLATE = '<section dynamic-layout></section>';

  var TEST_STATE_NAME = 'index';
  var TEST_STATE_LAYOUT = '<div></div>';
  var TEST_STATE_LAYOUT_COMPILED = '<div class="ng-scope"></div>';

  beforeEach(function() {
    env = {};
  });

  beforeEach(module('mobiusApp.directives.layout'));

  beforeEach(function() {
    module('mobiusApp.directives.layout', function($provide) {
      // Mocking stateService
      var stateService = {
        getStateLayout: function(){
          return [TEST_STATE_LAYOUT];
        }
      };

      $provide.value('stateService', stateService);

      var state = {
        current: {
          name: TEST_STATE_NAME
        }
      };

      $provide.value('$state', state);
    });
  });

  beforeEach(inject(function($compile, $rootScope, stateService) {
    env.$compile = $compile;
    env.$rootScope = $rootScope;
    env.stateService = stateService;
  }));

  describe('when layout settings are preconfigured for a current state', function() {
    beforeEach(function() {
      env.elem = env.$compile(TEMPLATE)(env.$rootScope);
    });

    it('should insert an proper template from the config(empty div)', function() {
      expect(env.elem.html()).equal(TEST_STATE_LAYOUT_COMPILED);
    });
  });

  describe('when layout settings are not found for a current state', function() {
    beforeEach(function() {
      // Layout settings are not found
      env.stateService.getStateLayout = function(){
        return [];
      };

      env.elem = env.$compile(TEMPLATE)(env.$rootScope);
    });

    it('should keep the element content empty', function() {
      expect(env.elem.html()).equal('');
    });
  });
});
