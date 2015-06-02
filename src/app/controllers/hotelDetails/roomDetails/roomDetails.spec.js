'use strict';

describe('mobius.controllers.room.details', function() {
  describe('RoomDetailsCtrl', function() {
    var _scope;

    beforeEach(function() {
      module('mobius.controllers.room.details');
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
  });
});
