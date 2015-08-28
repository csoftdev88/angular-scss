'use strict';

describe('mobius.controllers.modals.generic', function() {
  describe('ModalCtrl', function() {

    var _scope, _$modalInstance;

    beforeEach(function() {
      module('mobius.controllers.modals.generic', function($provide){
        $provide.value('$modalInstance',{
          close: sinon.spy(),
          dismiss: sinon.spy()
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $modalInstance) {
      _scope = $rootScope.$new();
      _$modalInstance = $modalInstance;

      $controller('ModalCtrl', { $scope: _scope });
    }));

    describe('ok', function() {
      it('should invoke close function on $modalInstance module', function(){
        _scope.ok();
        expect(_$modalInstance.close.calledOnce).equal(true);
      });
    });

    describe('cancel', function() {
      it('should invoke dismiss function on $modalInstance module', function(){
        _scope.cancel();
        expect(_$modalInstance.dismiss.calledOnce).equal(true);
        expect(_$modalInstance.dismiss.calledWith('cancel')).equal(true);
      });
    });
  });
});
