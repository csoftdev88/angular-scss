'use strict';
/*jshint -W030 */

describe('bookingWidget', function() {
  var env;

  var TEMPLATE = '<floating-bar></floating-bar>';
  var TEMPLATE_URL = 'directives/floatingBar/floatingBar.html';
  var TEST_URL_PARAMS = {testParam: 'testValue'};

  beforeEach(function() {
    env = {};

    module('mobiusApp.directives.floatingBar', function($provide){
      $provide.value('Settings', {
        UI: {
          generics: {
            loyaltyProgramEnabled: true
          },
          bookingWidget: {
            hasMultiroomTab: true
          },
          screenTypes: {
            mobile: {
              maxWidth: 768
            }
          }
        }
      });

      // Mocking the services
      $provide.value('bookingService', {
        getAPIParams: function(){
          return TEST_URL_PARAMS;
        },
        APIParamsHasDates: function(){
          return true;
        }
      });
    });

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

    it('should define hasMultiroomTab property on scope according to configuration', function() {
      expect(env.scope.hasMultiroomTab).equal(true);
    });
  });

  describe('setActive', function() {
    it('should set active element', function() {
      var active = 'some-active';
      env.scope.setActive(active);
      expect(env.scope.active).equal(active);
    });

    it('should set isCollapsed', function() {
      var active = 'some-active';
      env.scope.setActive(active);
      expect(env.scope.isCollapsed).equal(false);
      env.scope.setActive(active);
      expect(env.scope.isCollapsed).equal(true);
    });
  });
});

describe('GuestsCtrl', function() {
  var _scope;
  var TEST_URL_PARAMS = {testParam: 'testValue'};

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.filters.list');

    module('mobiusApp.directives.floatingBar', function($provide) {
      $provide.value('Settings', {
          UI: {
            bookingWidget: {
              'adults': {
                'min': 1,
                'max': 6
              },
              'children': {
                'min': 0,
                'max': 8
              }
            }
          }
        });

      $provide.value('bookingService', {
        getAPIParams: function(){
          return TEST_URL_PARAMS;
        },
        APIParamsHasDates: function(){
          return true;
        }
      });

      $provide.value('DynamicMessages', {
        'en': {
          'adult': 'Adult',
          'adults': 'Adults',
          'child': 'Child',
          'children': 'Children'
        }
      });

      $provide.value('stateService', {
        getAppLanguageCode: function(){
          return 'en';
        }
      });
    });
  });

  beforeEach(inject(function($controller, $rootScope) {
    _scope = $rootScope.$new();

    $controller('GuestsCtrl', { $scope: _scope });
  }));

  describe('guestsOptions', function(){
    it('should be define on scope', function() {
      expect(_scope.guestsOptions).to.be.an('object');
    });
  });

  describe('adults and children', function(){

    it('should be define on scope.guestsOptions', function() {
      expect(_scope.guestsOptions.adults).to.be.an('array');
      expect(_scope.guestsOptions.children).to.be.an('array');
    });

    it('should define a proper number of options according to the config', function() {
      expect(_scope.guestsOptions.adults.length).equal(6);
      expect(_scope.guestsOptions.children.length).equal(9);
    });

    it('should pluralize the options', function() {
      expect(_scope.guestsOptions.adults[0].value).equal(1);
      expect(_scope.guestsOptions.children[0].value).equal(0);

      expect(_scope.guestsOptions.adults[0].title).equal('1 Adult');
      expect(_scope.guestsOptions.children[0].title).equal('0 Children');
    });

  });
});

