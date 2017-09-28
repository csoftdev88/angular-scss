'use strict';

describe('mobius.controllers.rewards', function() {
  describe('RewardsCtrl', function() {
    var _scope, _$q, _breadcrumbsService, _user, _rewardsService, _modalService,
      _userMessagesService;

    var MY_REWARDS_DATA = [
      {
        earned: '2015-01-01'
      },
      {
        earned: '2015-02-02'
      }
    ];

    var ALL_REWARDS_DATA = [
      {
        code: 123,
        pointCost: 600
      },
      {
        code: 542,
        pointCost: 300
      }
    ];

    var TEST_USER_ID = 123456789;
    var TEST_USER = {id: TEST_USER_ID, loyalties: { amount: 999}};

    beforeEach(function() {
      module('underscore');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.rewards', function($provide, $controllerProvider) {

        $provide.value('userObject', TEST_USER);

        $provide.value('breadcrumbsService', {
          clear: sinon.stub().returns(this),
          addBreadCrumb: sinon.stub().returns(this)
        });

        $provide.value('rewardsService', {
          getMy: sinon.stub(),
          getAll: sinon.stub(),
          buyReward: sinon.stub()
        });

        $provide.value('$state', {

        });

        $provide.value('scrollService', {});

        $provide.value('user', {
          getCustomerId: sinon.stub(),
          getUser: sinon.stub(),
          loadLoyalties: sinon.stub()
        });

        $provide.value('$stateParams', {

        });

        $provide.value('Settings', {
          'UI': {
            'viewsSettings': {
              'rewards': sinon.stub()
            }
          }
        });

        $provide.value('modalService', {
          openRewardDetailsDialog: sinon.stub()
        });

        $provide.value('userMessagesService', {
          addMessage: sinon.spy()
        });

        $controllerProvider.register('AuthCtrl', function($scope, config){
          config.onAuthorized(true);
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q,
        breadcrumbsService, user, rewardsService, modalService,
        userMessagesService) {

      _scope = $rootScope.$new();

      _scope.auth = {
        isLoggedIn: function () { return true; }
      };

      _breadcrumbsService = breadcrumbsService;
      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.stub().returns(_breadcrumbsService)
      });

      _user = user;
      _user.getCustomerId.returns('TEST-USER-ID');
      _user.getUser.returns({
        loyalties: {
          amount: 500
        }
      });
      _user.loadLoyalties.returns($q.reject());

      _$q = $q;

      _rewardsService = rewardsService;
      _rewardsService.getMy.returns($q.when(MY_REWARDS_DATA));
      _rewardsService.getAll.returns($q.when(ALL_REWARDS_DATA));

      _modalService = modalService;

      _userMessagesService = userMessagesService;

      $controller('RewardsCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should add Rewards breadcrumb', function(){
        expect(_breadcrumbsService.addBreadCrumb.calledOnce).equal(true);
        expect(_breadcrumbsService.addBreadCrumb.calledWith('Rewards')).equal(true);
      });

      it('should get customer ID from user service', function(){
        expect(_user.getCustomerId.callCount).equal(2);
      });

      it('should download consumed user rewards from the server', function(){
        expect(_rewardsService.getMy.calledOnce).equal(true);
        expect(_rewardsService.getMy.calledWith('TEST-USER-ID')).equal(true);
      });

      it('should download all available rewards from the server', function(){
        expect(_rewardsService.getAll.calledOnce).equal(true);
        expect(_rewardsService.getAll.calledWith('TEST-USER-ID')).equal(true);
      });

      it('should display consumed reward list by default', function(){
        expect(_scope.viewMode).equal('consumed');
      });

      it('should sort consumed rewards list by earned date and defined then on scope', function(){
        _scope.$digest();
        expect(_scope.consumedRewards).to.be.an('array');
        expect(_scope.consumedRewards[0].earned).equal(MY_REWARDS_DATA[1].earned);
        expect(_scope.consumedRewards.length).equal(MY_REWARDS_DATA.length);
      });

      it('should define all rewards on scope', function(){
        _scope.$digest();
        expect(_scope.consumableRewards).to.be.an('array');
        expect(_scope.consumableRewards.length).equal(ALL_REWARDS_DATA.length);
      });

      it('should set _isAffordable flag on each reward object based on total loyalty points owned by current user', function(){
        _scope.$digest();
        expect(_scope.consumableRewards).to.be.an('array');
        expect(_scope.consumableRewards[0]._isAffordable).equal(false);
        expect(_scope.consumableRewards[1]._isAffordable).equal(true);
      });
    });

    describe('toogleFullListMode', function() {
      it('should switch to all rewards view mode', function(){
        expect(_scope.viewMode).equal('consumed');
        _scope.toogleFullListMode();
        expect(_scope.viewMode).equal('consumable');
      });
    });

    describe('openRewardDetails', function() {
      it('should open reward details dialog', function(){
        _modalService.openRewardDetailsDialog.returns(_$q.when());

        _scope.openRewardDetails({_isAffordable: false});
        expect(_modalService.openRewardDetailsDialog.calledOnce).equal(true);
      });

      it('should define customer total points when opening the dialog', function(){
        var reward = {_isAffordable: false};
        _modalService.openRewardDetailsDialog.returns(_$q.when());
        _scope.openRewardDetails(reward);
        expect(reward._customerTotalPoints).equal(500);
      });

      it('should fire POST request to rewards/buy API when user buys the reward ', function(){
        _rewardsService.buyReward.returns(_$q.when());

        var reward = {_isAffordable: true, id: 123};
        _modalService.openRewardDetailsDialog.returns(_$q.when());
        _scope.openRewardDetails(reward);
        _scope.$digest();
        expect(_rewardsService.buyReward.calledOnce).equal(true);
        expect(_rewardsService.buyReward.calledWith('TEST-USER-ID', 123)).equal(true);
      });

      it('should show confirmation message on successful transaction', function(){
        _rewardsService.buyReward.returns(_$q.when());

        var reward = {_isAffordable: true, name: 'TESTNAME'};
        _modalService.openRewardDetailsDialog.returns(_$q.when());
        _scope.openRewardDetails(reward);
        _scope.$digest();
        expect(_userMessagesService.addMessage.calledOnce);
        expect(_userMessagesService.addMessage.calledWith('<div>You have successfully bought TESTNAME </div>'));
      });

      it('should show alert message when transaction is not successful', function(){
        _rewardsService.buyReward.returns(_$q.reject());

        var reward = {_isAffordable: true, name: 'TESTNAME'};
        _modalService.openRewardDetailsDialog.returns(_$q.when());
        _scope.openRewardDetails(reward);
        _scope.$digest();
        expect(_userMessagesService.addMessage.calledOnce);
        expect(_userMessagesService.addMessage.calledWith('<div>Sorry, we could not complete the transaction, please try again.</div>'));
      });
    });
  });
});
