'use strict';

describe('mobius.controllers.modals.loyalties', function() {
  describe('LoyaltiesCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.modals.data');

      module('mobius.controllers.modals.loyalties', function($provide){
        $provide.value('$modalInstance', {});

        $provide.value('data', [{test: 123}]);
        $provide.value('_', window._);
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      $controller('LoyaltiesCtrl', { $scope: _scope });
    }));

    describe('inheritance', function() {
      it('should inherit methods from ModalDataCtrl', function() {
        expect(_scope.cancel).to.be.a('function');
        expect(_scope.ok).to.be.a('function');
      });
    });

    describe('initial loading', function() {
      it('should define items based on a data injection', function() {
        expect(_scope.items[0].test).equal(123);
      });

      it('should pick the first item from the data list and define it on scope as selectedItem prop', function() {
        expect(_scope.selectedItem.test).equal(123);
      });
    });

    describe('selectItem', function() {
      it('should change selectedItem property on scope', function() {
        expect(_scope.selectItem).to.be.a('function');
        _scope.selectItem(1);
        expect(_scope.selectedItem).equal(1);
      });
    });
  });
});
