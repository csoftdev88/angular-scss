'use strict';

describe('stateService', function() {
  var env;
  var TEST_STATE_1 = 'index.home';
  var TEST_STATE_2 = 'index.some';
  var TEST_STATE_3 = 'index.about';

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.state', function($provide) {
      var Settings = {
        'layout': {
          'index.home': [
            'best-offers',
            'best-hotels'
          ],
          'index.about': [
            'widget-doesnt-exist',
            'best-hotels'
          ]
        },
        // Widgets name vs templates map
        'templates': {
          'best-offers': '<best-offers></best-offers>',
          'best-hotels': '<div class="grid-wrapper"><best-hotels></best-hotels></div>'
        }
      };

      $provide.value('Settings', Settings);
    });
  });

  beforeEach(inject(function($rootScope, stateService, Settings) {
    env.stateService = stateService;
    env.Settings = Settings;
  }));

  describe('getStateLayout', function() {
    it('should return correct template list when state layout correctly configured', function() {
      expect(env.stateService.getStateLayout(TEST_STATE_1).length).equal(2);
    });

    it('should return empty list when state layout configuration is missing', function() {
      expect(env.stateService.getStateLayout(TEST_STATE_2).length).equal(0);
    });

    it('should return a list of existing templates only', function() {
      expect(env.stateService.getStateLayout(TEST_STATE_3).length).equal(1);
    });
  });
});
