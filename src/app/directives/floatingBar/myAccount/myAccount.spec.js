'use strict';

describe('myAccount', function() {
  var _$compile, _$rootScope, _element, _scope,
    _spyTemplateCacheGet, _user, _modalService, _$state;

  var TEMPLATE = '<my-account></my-account>';
  var TEMPLATE_URL = 'directives/floatingBar/myAccount/myAccount.html';
  var TEMPLATE_CONTENT = '<p>my-account</p>';

  var LOYALTIES_DATA = {
    badges: [{badge: 1, earned: '2015-01-01'}, {badge: 2, earned: '2016-01-01'}],
    loyaltyCard: {
      name: 'testName',
      stamps: [{stamp: 'stamp', startPosition: 1, endPosition: 3}, {stamp: 'stamp2', startPosition: 3}]
    }
  };

  var TEST_SETTINGS = {
    'displaySettings' : {
      'profile': true,
      'badges': false,
      'rewards': true,
      'loyalities': false
    }
  };

  var REWARDS_DATA = [
    {earned: '2011-01-02'},
    {earned: '2012-04-02'},
  ];

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.floatingBar.myAccount', function($provide, $controllerProvider){
      $provide.value('Settings', {
        UI:{
          'myAccount' : TEST_SETTINGS
        }
      });
      $provide.value('user', {
        isLoggedIn: sinon.stub(),
        loadLoyalties: sinon.stub(),
        loadRewards: sinon.stub()
      });

      $provide.value('$state', {
        go: sinon.spy()
      });
      $provide.value('modalService', {
        openBadgesDialog: sinon.spy(),
        openLoyaltyDialog: sinon.spy()
      });

      $controllerProvider.register('SSOCtrl', function($scope){$scope._ssoCtrl = true;});
    });
  });

  beforeEach(inject(function($compile, $rootScope, $window, $q, $templateCache,
      user, modalService, $state) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    _user = user;
    _user.isLoggedIn.returns(true);
    _user.loadLoyalties.returns($q.when(LOYALTIES_DATA));
    _user.loadRewards.returns($q.when(REWARDS_DATA));

    _$state = $state;

    _modalService = modalService;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _element = _$compile(TEMPLATE)(_$rootScope.$new());
    $rootScope.$digest();
    _scope = _element.isolateScope();
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
  });

  describe('when initialized', function() {
    it('should download a template from template-cache', function(){
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should append template content to a current element', function(){
      expect(_element.html()).equal(TEMPLATE_CONTENT);
    });

    it('should define user data on scope', function(){
      expect(_scope.user).equal(_user);
    });

    it('should define settings on scope', function(){
      expect(_scope.displaySettings).equal(TEST_SETTINGS.displaySettings);
    });

    it('should inherit SSO controller', function(){
      expect(_scope._ssoCtrl).equal(true);
    });

    it('should download user loyalties from the server', function(){
      expect(_user.loadLoyalties.calledOnce).equal(true);
    });

    it('should define last earned badge on scope', function(){
      expect(_scope.lastBadge.badge).equal(2);
    });

    it('should define loyaltyName on scope', function(){
      expect(_scope.loyaltyName).equal('testName');
    });

    it('should download user rewards from the server', function(){
      expect(_user.loadRewards.calledOnce).equal(true);
    });
  });

  describe('showBadges', function(){
    it('should open badges dialog', function(){
      _scope.showBadges();
      expect(_modalService.openBadgesDialog.calledOnce).equal(true);
    });
  });

  describe('showLoyaltyCard', function(){
    it('should open loyalty card dialog', function(){
      _scope.showLoyaltyCard();
      expect(_modalService.openLoyaltyDialog.calledOnce).equal(true);
    });
  });

  describe('showRewards', function(){
    it('should redirect to rewards state', function(){
      _scope.showRewards();
      expect(_$state.go.calledOnce).equal(true);
      expect(_$state.go.calledWith('rewards')).equal(true);
    });
  });

  
});
