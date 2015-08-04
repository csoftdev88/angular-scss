'use strict';

describe('mobius.controllers.common.rates', function() {
  describe('RatesCtrl', function() {

    var _rootScope, _scope,
      _spyStateGo, _spyFiltersServiceGetProducts, _spyNotificationServiceShow;

    var TEST_RATES = [
      {id: 1, name: 'Best Rate'},
      {id: 2}
    ];

    beforeEach(function() {
      module('mobius.controllers.common.rates', function($provide){
        $provide.value('filtersService', {
          getProducts: function(){
            return {
              then: function(c) {
                c(TEST_RATES);
              }
            };
          }
        });

        $provide.value('$state', {
          go: function(){},

          current: {
            name: 'testState',
            data: {
              hasRateNotification: true
            }
          }
        });
        $provide.value('$stateParams', {
          rate: '1',
          prop: 'VAN',
          promoCode: 'testPromo'
        });
        $provide.value('notificationService', {
          show: function(){}
        });
        $provide.value('_', window._);
      });
    });

    beforeEach(inject(function($controller, $rootScope, $state, filtersService, notificationService) {
      _rootScope = $rootScope;
      _scope = $rootScope.$new();

      _spyFiltersServiceGetProducts = sinon.spy(filtersService, 'getProducts');
      _spyNotificationServiceShow = sinon.spy(notificationService, 'show');
      _spyStateGo = sinon.spy($state, 'go');

      $controller('RatesCtrl', { $scope: _scope });
    }));

    afterEach(function(){
      _spyFiltersServiceGetProducts.restore();
      _spyNotificationServiceShow.restore();
      _spyStateGo.restore();
    });

    describe('when controller initialized', function() {
      it('should get all available rates', function(){
        expect(_spyFiltersServiceGetProducts.calledOnce).equal(true);
      });

      it('should define rates object on scope', function(){
        expect(_scope.rates).to.be.an('object');
      });

      it('should define all rates once downloaded from the server', function(){
        expect(_scope.rates.all).equal(TEST_RATES);
      });

      it('should select current rate based on stateParams', function(){
        expect(_scope.rates.selectedRate).equal(TEST_RATES[0]);
      });

      it('should show notification message with rate and promo code filtering details', function(){
        expect(_spyNotificationServiceShow.calledOnce).equal(true);
        expect(_spyNotificationServiceShow.calledWith('<span>You have selected: <strong>Best Rate</strong> ' +
          '</span><span> Promo code: <strong>testPromo</strong></span>', 'notification-extra-filter-removed', true)).equal(true);
      });
    });

    describe('when rate filter notification bar is closed', function(){
      beforeEach(function(){
        _rootScope.$broadcast('notification-extra-filter-removed');
      });

      it('should update current state excluding rate and promoCode state parameters', function(){
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('testState', {prop: 'VAN', rate: null, corpCode: null, groupCode: null, promoCode: null})).equal(true);
      });
    });
  });
});