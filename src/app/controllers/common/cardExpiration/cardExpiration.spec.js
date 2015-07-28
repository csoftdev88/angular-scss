'use strict';

describe('mobius.controllers.common.cardExpiration', function() {
  describe('AuthCtrl', function() {

    var _scope, _clock;

    beforeEach(function() {
      module('mobius.controllers.common.cardExpiration', function($provide){
        $provide.value('_', window._);
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      _clock = sinon.useFakeTimers(0 , 'Date');
      _clock.tick(window.moment('2015-05-05T00:00:00+0000').valueOf());

      $controller('CardExpirationCtrl', { $scope: _scope });
    }));

    afterEach(function(){
      _clock.restore();
    });

    describe('initialization', function() {
      it('should define cardExpiration options on scope', function(){
        expect(_scope.cardExpiration).to.be.an('object');
      });

      it('should gerenate month options starting from current month', function(){
        expect(_scope.cardExpiration.months.length).equal(8);
      });

      it('should have month id and name defined', function(){
        expect(_scope.cardExpiration.months[0].id).equal(5);
        expect(_scope.cardExpiration.months[0].name).equal('May');
      });
    });

    describe('getCardExpirationDate', function() {
      it('should be defined as a function on scope', function(){
        expect(_scope.getCardExpirationDate).to.be.a('function');
      });

      it('should return null when month/year are not selected', function(){
        expect(_scope.getCardExpirationDate()).equal(null);
      });

      it('should return last day of the selected month', function(){
        _scope.cardExpiration = {
          selectedYear: 2015,
          selectedMonth: {
            id: 6
          }
        };

        expect(_scope.getCardExpirationDate()).equal('2015-07-31');

        _scope.cardExpiration = {
          selectedYear: 2016,
          selectedMonth: {
            id: 0
          }
        };

        expect(_scope.getCardExpirationDate()).equal('2016-01-31');
      });
    });
  });
});