'use strict';

describe('mobius.controllers.modals.data', function() {
  describe('ModalDataCtrl', function() {

    var _scope;

    beforeEach(function() {
      module('mobius.controllers.modals.generic', function($provide){
        $provide.value('$modalInstance',{
          close: sinon.spy(),
          dismiss: sinon.spy()
        });
      });

      module('mobius.controllers.modals.data', function($provide){
        $provide.value('data',{test: 123});
        $provide.value('Settings', {
          UI: {
            currencies: {
              default: 'CAD'
            }
          }
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      $controller('ModalDataCtrl', { $scope: _scope });
    }));

    describe('inheritance', function() {
      it('should inherit methods from ModalCtrl', function(){
        expect(_scope.ok).to.be.a('function');
        expect(_scope.cancel).to.be.a('function');
      });
    });

    describe('data', function() {
      it('should define data on scope', function(){
        expect(_scope.data.test).equal(123);
      });
    });
  });
});
