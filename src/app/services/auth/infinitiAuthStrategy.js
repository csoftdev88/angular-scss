'use strict';

angular.module('mobiusApp.services.auth', [])

  .service( 'infinitiAuthStrategy', function($timeout, $state, $window, userObject, cookieFactory) {

    // The header's attributes name
    var AUTH_HEADER = 'infinitiAuthN';
    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    function isSSOReady () {
      return $window.infiniti && $window.infiniti.api;
    }

    function hasSSOCookies () {
      return !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function isProfileLoaded () {
      return !!(userObject.id && userObject.email);
    }

    var login = function (scope, options) {
      if (isSSOReady()) {
        $window.infiniti.api.login();
      } else {
        console.warn('Login could not happen as infiniti has not been loaded..');
      }
    };

    var logout = function (scope, options) {
      if (isSSOReady()) {
        $window.infiniti.api.logout();
      } else {
        console.warn('logout could not happen as infiniti has not been loaded..');
      }
    };

    var isLoggedIn = function (scope, options) {
      return hasSSOCookies() && isProfileLoaded();
    };

    var reset = function () {
      console.warn('Reset function is not supported by mobius auth');
    };

    var register = function () {
      if(isSSOReady()){
        $window.infiniti.api.register();
      } else {
        console.warn('register could not happen as infiniti has not been loaded..');
      }
    };

    var viewProfile = function () {
      if(isSSOReady()){
        $window.infiniti.api.profile();
      } else {
        console.warn('viewProfile could not happen as infiniti has not been loaded..');
      }
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
