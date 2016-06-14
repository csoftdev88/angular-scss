'use strict';

describe('stateService', function() {
  var env, _$rootScope;
  var TEST_STATE_1 = 'home';
  var TEST_STATE_2 = 'some';
  var TEST_STATE_3 = 'about';

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.services.state', function($provide) {
      var Settings = {
        'UI': {
          'layout': {
            'home': [
              'best-offers',
              'best-hotels'
            ],
            'about': [
              'widget-doesnt-exist',
              'best-hotels'
            ]
          },

          'templates': {
            'best-offers': '<best-offers></best-offers>',
            'best-hotels': '<div class="grid-wrapper"><best-hotels></best-hotels></div>'
          },

          'currencies': {
            'default': 'GBP',

            'GBP': {
              'symbol': '£'
            },

            'USD': {
              'symbol': '$'
            }
          }
        }
      };

      $provide.value('Settings', Settings);
      $provide.value('queryService', {
        getValue: function(){}
      });
      $provide.value('user', {
        getUserCurrency: function(){}
      });
    });
  });

  beforeEach(inject(function($rootScope, stateService, Settings) {
    env.stateService = stateService;
    env.Settings = Settings;
    _$rootScope = $rootScope;
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

  describe('getCurrentCurrency', function() {
    it('should return default currency', function() {
      expect(env.stateService.getCurrentCurrency().symbol).equal('£');
    });

    it('should return currency selected by user', function() {
      _$rootScope.currencyCode = 'USD';
      expect(env.stateService.getCurrentCurrency().symbol).equal('$');
    });

    it('should return null when currency is not found in the configuration', function() {
      _$rootScope.currencyCode = 'CZK';
      expect(env.stateService.getCurrentCurrency()).equal(null);
    });
  });
});
