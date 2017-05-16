'use strict';

describe('mobius.controllers.common.auth', function() {
  describe('AuthCtrl', function() {

    var _scope, _spyOnAuthorized;

    beforeEach(function() {
      module('underscore');
      module('mobius.controllers.common.auth', function ($provide) {
        $provide.value('Settings', {
          authType: 'mobius'
        });
      });
      module('mobiusApp.services.auth.mobius', function ($provide) {
        $provide.value('mobiusAuthStrategy', sinon.spy());
      });
      module('mobiusApp.services.auth.infiniti', function ($provide) {
        $provide.value('infinitiAuthStrategy', sinon.spy());
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();

      var config = {
        onAuthorized: function(){}
      };

      var user = {
        authPromise: {
          then: function(c){
            return c(true);
          }
        }
      };

      _spyOnAuthorized = sinon.spy(config, 'onAuthorized');

      $controller('AuthCtrl', { $scope: _scope, user: user });
    }));

    afterEach(function(){
      _spyOnAuthorized.restore();
    });

    describe('autorization callback', function() {
      it('should invoke onAuthorized function from config onse auth promise is resolved', function(){
        expect(_spyOnAuthorized.calledOnce).equal(true);
        expect(_spyOnAuthorized.calledWith(true)).equal(true);
      });
    });
  });
});
