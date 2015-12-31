'use strict';

describe('mobius.controllers.common.price', function() {
  describe('PriceCtr', function() {

    var _scope, _bookingService;

    beforeEach(function() {
      module('mobiusApp.services.preference');

      module('mobius.controllers.common.price', function($provide){
        $provide.value('perStay',{});
        $provide.value('bookingService',{
          getAPIParams: sinon.stub()
        });
        $provide.value('userPreferenceService', {
          getCookie: function(){},
          setCookie: function(){}
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, bookingService) {
      _scope = $rootScope.$new();

      _bookingService = bookingService;
      _bookingService.getAPIParams.returns({
        to: '2015-01-20',
        from: '2015-01-10'
      });

      $controller('PriceCtr', { $scope: _scope });
    }));

    describe('days', function() {
      it('should be defined on scope according to booking criterias', function(){
        expect(_scope.days).equal(10);
      });
    });

    describe('pricePer', function() {
      it('should be set to perNight by default', function(){
        expect(_scope.pricePer).equal('night');
      });
    });

    describe('setPricePer', function() {
      it('should be defined as a function on scope', function(){
        expect(_scope.setPricePer).to.be.a('function');
      });

      it('should change pricePer according to the value provided', function(){
        _scope.setPricePer('stay');
        expect(_scope.pricePer).equal('stay');
      });
    });

    describe('getValuePer', function() {
      it('should be defined as a function on scope', function(){
        expect(_scope.getValuePer).to.be.a('function');
      });

      it('should return price per night', function(){
        _scope.setPricePer('night');
        expect(_scope.getValuePer(10)).equal(10);
      });

      it('should return price per stay', function(){
        _scope.setPricePer('stay');
        expect(_scope.getValuePer(10)).equal(100);
      });

      it('should return product price per night', function(){
        _scope.setPricePer('night');
        expect(_scope.getValuePer(100, true)).equal(10);
      });

      it('should return product price per stay', function(){
        _scope.setPricePer('stay');
        expect(_scope.getValuePer(100, true)).equal(100);
      });

      it('should return null when value is not defined', function(){
        expect(_scope.getValuePer(undefined)).equal(null);
      });
    });

    describe('getProductPricePerNight', function() {
      it('should be defined as a function on scope', function(){
        expect(_scope.getProductPricePerNight).to.be.a('function');
      });

      it('should return null when value is not defined', function(){
        expect(_scope.getProductPricePerNight(undefined)).equal(null);
      });

      it('should return product price per night', function(){
        _scope.setPricePer('night');
        expect(_scope.getProductPricePerNight(100, true)).equal(10);
      });
    });
  });
});
