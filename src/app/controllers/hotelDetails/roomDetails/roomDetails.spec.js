'use strict';

describe('mobius.controllers.room.details', function() {
  describe('RoomDetailsCtrl', function() {
    var _scope;

    beforeEach(function() {
      module('mobius.controllers.room.details', function($provide){
        $provide.value('modalService', {
          openPoliciesInfo: function(){},
          openPriceBreakdownInfo: function(){}
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      $controller('RoomDetailsCtrl', { $scope: _scope });
    }));

    describe('selectProduct', function() {
      it('should be defined as a function on scope', function() {
        expect(_scope.selectProduct).to.be.a('function');
      });

      it('should change the value of selectedProduct property', function() {
        expect(_scope.selectedProduct).equal(undefined);
        var product = {test: 123};
        _scope.selectProduct(product);
        expect(_scope.selectedProduct).equal(product);
      });
    });

    describe('methods for modals', function(){
      describe('openPoliciesInfo', function() {
        it('should be defined as a function on scope', function() {
          expect(_scope.openPoliciesInfo).to.be.a('function');
        });
      });

      describe('openPriceBreakdownInfo', function() {
        it('should be defined as a function on scope', function() {
          expect(_scope.openPriceBreakdownInfo).to.be.a('function');
        });
      });
    });
  });
});
