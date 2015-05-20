'use strict';

describe('bookingWidget', function() {
  var env;

  var TEMPLATE = '<booking-widget></booking-widget>';
  var TEMPLATE_URL = 'directives/bookingWidget/bookingWidget.html';

  var TEST_SETTINGS = {
    maxAdults: 5
  };

  var STATE_PARAMS = {};

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.directives.booking', function($provide) {
      // Mocking the services
      $provide.value('bookingService', {
        getParams: function(){
          return STATE_PARAMS;
        }
      });

      $provide.value('$state', {
        go: function(){}
      });

      $provide.value('validationService', {
        isValueValid: function(){}
      });
      $provide.value('propertyService', {
        getAll: function(){
          return {then: function(){}};
        }
      });
      $provide.value('modalService', {});

      $provide.value('Settings', {
        UI: {
          bookingWidget: TEST_SETTINGS
        }
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, propertyService, bookingService, validationService) {

    env.$compile = $compile;
    env.$rootScope = $rootScope.$new();
    env.propertyService = propertyService;
    env.bookingService = bookingService;
    env.validationService = validationService;

    env.$templateCache = $templateCache;
    env.$templateCache.put(TEMPLATE_URL, '');

    // Spy's
    env.templateCacheGet = sinon.spy(env.$templateCache, 'get');
    env.propertyServiceGetAll = sinon.spy(env.propertyService, 'getAll');
    env.validationServiceIsValueValid = sinon.spy(env.validationService, 'isValueValid');

    // Final component compile
    env.elem = env.$compile(TEMPLATE)(env.$rootScope);
    env.$rootScope.$digest();
    env.scope = env.elem.isolateScope();
  }));

  afterEach(function() {
    env.templateCacheGet.restore();
    env.propertyServiceGetAll.restore();
    env.validationServiceIsValueValid.restore();
  });

  describe('when component is initialized', function() {
    it('should download widget template from template cache', function() {
      expect(env.templateCacheGet.calledOnce).equal(true);
      expect(env.templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should read widget settings from the configuration', function() {
      expect(env.scope.settings).equal(TEST_SETTINGS);
      expect(env.scope.selected).to.be.an('object');
    });

    it('should download a property list from the server', function() {
      expect(env.propertyServiceGetAll.calledOnce).equal(true);
    });

    it('should do initial param validation', function() {
      expect(env.validationServiceIsValueValid.callCount).equal(7);
    });
  });

  describe('isSearchable', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.isSearchable).to.be.an('function');
    });

    it('should return false when required fields doesnt contain data', function() {
      expect(env.scope.isSearchable()).equal(false);
    });
  });

  describe('onSearch', function() {
    it('should be defined on scope as a function', function() {
      expect(env.scope.onSearch).to.be.an('function');
    });
  });
});
