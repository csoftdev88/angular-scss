'use strict';

describe('mobius.controllers.modals.loyalties.badges', function() {
  describe('BadgesCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.modals.data');

      module('mobius.controllers.modals.loyalties.badges', function($provide){
        $provide.value('$modalInstance', {});

        $provide.value('data', [{test: 123}]);
        var settings = {
          'UI': {
            'currencies': {
              'default': 'CAD'
            }
          }
        };
        $provide.value('Settings', settings);
        $provide.value('_', window._);
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('BadgesCtrl', { $scope: _scope });
    }));

    describe('inheritance', function() {
      it('should inherit methods from ModalDataCtrl', function() {
        expect(_scope.cancel).to.be.a('function');
        expect(_scope.ok).to.be.a('function');
      });
    });

    describe('initial loading', function() {
      it('should define badges based on a data injection', function() {
        expect(_scope.badges[0].test).equal(123);
      });

      it('should pick the first item from the data list and define it on scope as selectedBadge prop', function() {
        expect(_scope.selectedBadge.test).equal(123);
      });
    });

    describe('selectItem', function() {
      it('should change selectedBadge property on scope', function() {
        expect(_scope.showBadgeDetail).to.be.a('function');
        _scope.showBadgeDetail(1);
        expect(_scope.selectedBadge).equal(1);
      });
    });
  });
});
