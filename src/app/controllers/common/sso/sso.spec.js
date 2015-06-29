'use strict';

describe('mobius.controllers.common.sso', function() {
  describe('SSOCtrl', function() {
    var _scope, _spyInfinitiLogin, _spyInfinitiRegister;

    beforeEach(function() {
      module('mobius.controllers.common.sso', function($provide) {
        $provide.value('$window', {
            infiniti: {
              api: {
                login: function(){},
                register: function(){}
              }
            }
          });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $window) {
      _scope = $rootScope.$new();

      // Spy
      _spyInfinitiLogin = sinon.spy($window.infiniti.api, 'login');
      _spyInfinitiRegister = sinon.spy($window.infiniti.api, 'register');

      $controller('SSOCtrl', { $scope: _scope });
    }));

    afterEach(function() {
      _spyInfinitiLogin.restore();
      _spyInfinitiRegister.restore();
    });

    describe('methods', function() {
      describe('login', function(){
        it('should define sso object with login function on scope', function() {
          expect(_scope.sso.login).to.be.a('function');
        });

        it('should invoke intiniti.api.login function', function() {
          _scope.sso.login();
          expect(_spyInfinitiLogin.calledOnce).equal(true);
        });
      });

      describe('register', function(){
        it('should define sso object with login function on scope', function() {
          expect(_scope.sso.register).to.be.a('function');
        });

        it('should invoke intiniti.api.register function', function() {
          _scope.sso.register();
          expect(_spyInfinitiRegister.calledOnce).equal(true);
        });
      });
    });
  });
});