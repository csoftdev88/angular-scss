'use strict';

describe('mobius.controllers.common.cardExpiration', function() {
  describe('AuthCtrl', function() {

    var _scope, _clock;

    beforeEach(function() {
      module('mobius.controllers.common.cardExpiration');
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      _clock = sinon.useFakeTimers(0 , 'Date');

      $controller('CardExpirationCtrl', { $scope: _scope });
    }));

    afterEach(function(){
      _clock.restore();
    });

    describe('initialization', function() {
      beforeEach(function(){
        _clock.tick(window.moment('2015-05-05T00:00:00+0000').valueOf());
      });

      it('should define cardExpiration options on scope', function(){
        expect(_scope.cardExpiration).to.be.an('object');
      });

      it('should gerenate month options starting from current month', function(){
        console.error(_scope.cardExpiration.months);
      });
    });
  });
});