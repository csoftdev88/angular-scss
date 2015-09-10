'use strict';

describe('notificationBar directive', function() {
  var _$rootScope, _scope, _$compile, _elem,
    _$templateCache, _templateCacheGetSpy, _rootScopeOnSpy, _notificationService,
      _rootScopeBroadcastSpy;

  var TEMPLATE = '<notification-bar/>';
  var TEMPLATE_URL = 'directives/notificationBar/notificationBar.html';

  beforeEach(function() {
    module('mobiusApp.directives.notifications', function($provide, $controllerProvider){
      $provide.value('notificationService', {
        getMessage: sinon.stub().returns('testMessage'),
        getCloseEvent: sinon.stub().returns('closeEvent')
      });

      $controllerProvider.register('SanitizeCtrl', function($scope){
          $scope._sanitizeCtrlInherited = true;
        });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache, notificationService) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _$templateCache = $templateCache;
    _$templateCache.put(TEMPLATE_URL, '<a>notificationbar</a>');

      // Spy's
    _templateCacheGetSpy = sinon.spy(_$templateCache, 'get');
    _rootScopeOnSpy = sinon.spy(_$rootScope, '$on');
    _rootScopeBroadcastSpy = sinon.spy(_$rootScope, '$broadcast');

    _notificationService = notificationService;

    // Initialization
    _elem = _$compile(TEMPLATE)(_$rootScope);

    _$rootScope.$digest();
    _scope = _elem.scope();
  }));

  afterEach(function(){
    _templateCacheGetSpy.restore();
  });

  describe('when directive is initialized', function() {
    it('should get directives template form template cache)', function() {
      expect(_templateCacheGetSpy.calledOnce).equal(true);
      expect(_templateCacheGetSpy.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should insert content from the template into a parent element', function() {
      expect(_elem.html()).equal('<a>notificationbar</a>');
    });

    it('should inherit SanitizeCtrl', function() {
      expect(_scope._sanitizeCtrlInherited).equal(true);
    });
  });

  describe('listeners', function() {
    it('should listen for notification-message-updated event', function() {
      expect(_rootScopeOnSpy.calledOnce).equal(true);
      expect(_rootScopeOnSpy.calledWith('notification-message-updated')).equal(true);
    });

    it('should get message from notificationService and define them on scope when notification-message-updated event is broadcasted', function() {
      _$rootScope.$broadcast('notification-message-updated');
      _$rootScope.$digest();

      expect(_scope.message).equal('testMessage');
      expect(_notificationService.getMessage.called).equal(true);
    });

    it('should get closeEvent from notificationService when notification-message-updated event is broadcasted', function() {
      _$rootScope.$broadcast('notification-message-updated');
      _$rootScope.$digest();

      expect(_notificationService.getCloseEvent.called).equal(true);
    });
  });

  describe('onClose', function(){
    it('should broadcast close event and remove the messages from scope', function() {
      _$rootScope.$broadcast('notification-message-updated');
      _$rootScope.$digest();

      expect(_scope.message).equal('testMessage');

      _scope.onClose();
      _$rootScope.$digest();

      expect(_scope.message).equal(null);
      expect(_rootScopeBroadcastSpy.called).equal(true);
      expect(_rootScopeBroadcastSpy.calledWith('closeEvent')).equal(true);
    });
  });
});
