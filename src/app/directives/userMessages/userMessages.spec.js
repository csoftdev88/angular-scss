'use strict';

describe('userMessages', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGet, _userMessagesService;

  var TEMPLATE = '<user-messages/>';
  var TEMPLATE_URL = 'directives/userMessages/userMessages.html';

  beforeEach(function() {
    module('mobiusApp.directives.userMessages', function($provide, $controllerProvider) {
      // Mocking the services
      $provide.value('userMessagesService', {
        getMessages: sinon.spy()
      });

      $provide.value('Settings', {});
      $provide.service('stateService', function() { return {}; });

      $controllerProvider.register('SanitizeCtrl', function($scope){
        $scope._sanitizeCtrInherited = true;
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, userMessagesService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '');
      // Spy's
    _templateCacheGet = sinon.spy(_$templateCache, 'get');
    _userMessagesService = userMessagesService;
  }));

  afterEach(function(){
    _templateCacheGet.restore();
  });

  describe('when directive is initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
      _$rootScope.$digest();
      _scope = _elem.isolateScope();
    });

    it('should get directives template form template cache)', function() {
      expect(_templateCacheGet.calledOnce).equal(true);
      expect(_templateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should not insert any template into a parent container', function() {
      expect(_elem.html()).equal('');
    });

    it('should get a list of messages from userMessagesService', function(){
      expect(_userMessagesService.getMessages.calledOnce).equal(true);
    });
  });
});
