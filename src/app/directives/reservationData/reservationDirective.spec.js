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

      it('should return a number of children across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {children: 1}
          ]
        };

        expect(_scope.getChildrenCount()).equal(1);
      });
    });

    describe('getPrice', function(){
      it('should be defined as function', function() {
        expect(_scope.getPrice).to.be.a('function');
      });

      it('should return the price across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {price: 5}
          ]
        };

        expect(_scope.getPrice()).equal(5);
      });
    });

    describe('getTax', function(){
      it('should be defined as function', function() {
        expect(_scope.getTax).to.be.a('function');
      });

      it('should return the tax across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {tax: 5},
            {tax: 11},
            {tax: 12},
          ]
        };

        expect(_scope.getTax()).equal(28);
      });
    });

    describe('getPriceAfterTax', function(){
      it('should be defined as function', function() {
        expect(_scope.getPriceAfterTax).to.be.a('function');
      });

      it('should return final price with taxes across all the rooms', function() {
        _scope.reservation = {
          rooms: [
            {priceAfterTax: 2},
            {priceAfterTax: 3},
          ]
        };

        expect(_scope.getPriceAfterTax()).equal(5);
      });
    });
  });
});