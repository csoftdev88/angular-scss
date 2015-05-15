'use strict';

describe('stateService', function() {
  var env;
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
          }
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

  describe('getAppCurrency', function() {
    it('should return currency object that was set', function() {
      var currency = {
        something: 'something'
      };
      env.stateService.setAppCurrency(currency);
      expect(env.stateService.getAppCurrency()).equal(currency);
    });
    it('should return empty object when nothing was set', function() {
      expect(env.stateService.getAppCurrency()).deep.equal({});
    });
  });

  describe('addAppCurrencyChangeListener', function() {
    it('should add only once and invoke listener after change', function() {
      var currency = {
        something: 'something'
      };
      var listener = sinon.spy();

      env.stateService.addAppCurrencyChangeListener(listener);
      env.stateService.addAppCurrencyChangeListener(listener);
      env.stateService.setAppCurrency(currency);
      expect(listener.withArgs(currency).calledOnce);
    });
  });

  describe('removeAppCurrencyChangeListener', function() {
    it('should remove listener', function() {
      var currency = {
        something: 'something'
      };
      var listener = sinon.spy();

      env.stateService.addAppCurrencyChangeListener(listener);
      env.stateService.removeAppCurrencyChangeListener(listener);
      env.stateService.setAppCurrency(currency);
      expect(listener.callCount).equal(0);
    });
  });

});
