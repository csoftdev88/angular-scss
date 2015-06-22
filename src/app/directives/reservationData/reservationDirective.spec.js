'use strict';

describe('mobius.controllers.reservation.directive', function() {
  var _scope;

  describe('ReservationDirectiveCtrl', function() {
    beforeEach(function() {
      module('underscore');
      module('mobius.controllers.reservation.directive');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      $controller('ReservationDirectiveCtrl', { $scope: _scope });
    }));

    describe('getAdultsCount', function(){
      it('should be defined as function', function() {
        expect(_scope.getAdultsCount).to.be.a('function');
      });

      it('should be defined as function', function() {
        expect(_scope.getAdultsCount).to.be.a('function');
      });

      it('should return a number of adults across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {adults: 2},
            {adults: 5}
          ]
        };

        expect(_scope.getAdultsCount()).equal(7);
      });
    });

    describe('getChildrenCount', function(){
      it('should be defined as function', function() {
        expect(_scope.getChildrenCount).to.be.a('function');
      });

      it('should be defined as function', function() {
        expect(_scope.getChildrenCount).to.be.a('function');
      });

      it('should return a number of children across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {children: 1}
          ]
        };

        expect(_scope.getChildrenCount()).equal(1);
      });
    });
  });
});