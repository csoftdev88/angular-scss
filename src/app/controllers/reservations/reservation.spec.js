'use strict';

describe('mobius.controllers.reservation', function() {
  describe('ReservationCtrl', function() {
    var _scope, _spyOpenPoliciesInfo;

    beforeEach(function() {
      module('mobius.controllers.room.details');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservation', function($provide) {
        $provide.value('bookingService', {
          getAPIParams: function(){
            return {
              productGroupId: '123'
            };
          }
        });
        $provide.value('propertyService', {});
        $provide.value('$stateParams', {});
        $provide.value('$state', {
          current: {
            name: ''
          }
        });
        $provide.value('modalService', {
          openPoliciesInfo: function(){}
        });
        $provide.value('reservationService', {});
        $provide.value('filtersService', {});
      });
    });

    beforeEach(inject(function($controller, $rootScope, modalService) {
      _scope = $rootScope.$new();

      $controller('ReservationCtrl', { $scope: _scope });

      _spyOpenPoliciesInfo = sinon.spy(modalService, 'openPoliciesInfo');
    }));

    afterEach(function() {
      _spyOpenPoliciesInfo.restore();
    });

    describe('readPolicies', function() {
      beforeEach(function(){
        _scope.selectedProduct = {test: 123};
      });

      it('should set hasReadRatePolicies property on scope to true', function() {
        expect(_scope.hasReadRatePolicies).equal(undefined);
        _scope.readPolicies();
        expect(_scope.hasReadRatePolicies).equal(true);
      });

      it('should open policies dialogue with currently selected product', function() {
        _scope.readPolicies();
        expect(_spyOpenPoliciesInfo.calledOnce).equal(true);
        expect(_spyOpenPoliciesInfo.calledWith({test: 123})).equal(true);
      });
    });
  });
});
