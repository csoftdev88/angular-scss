'use strict';

angular
  .module('mobiusApp.services.auth.keystone', [])
  .service( 'keystoneAuthStrategy', function($timeout, $state) {

    var login = function () {
      $timeout(function () {
        window.dispatchEvent(new CustomEvent('parent.request.login'));
        $('#mobile-menu-opener').click();
      });
    };

    var logout = function () {
      if (!window.KS.$me) {
        $state.go('home', {});
      } else {
        window.KS.$me.revoke().then(function() {
          $state.go('home', {});
        });
      }
    };

    var isLoggedIn = function () {
      return (window.KS && window.KS.$me && window.KS.$me.get() !== null);
    };

    var reset = function () {
      console.warn('Reset function is not supported by keystone');
    };

    var register = function () {
      console.warn('Register function is not supported by keystone');
    };

    var viewProfile = function () {
      console.warn('viewProfile function is not supported by keystone');
    };

    return {
      login: login,
      logout: logout,
      reset: reset,
      register: register,
      viewProfile: viewProfile,
      isLoggedIn: isLoggedIn
    };

  });
