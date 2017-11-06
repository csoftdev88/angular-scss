(function () {
  'use strict';

  angular
    .module('mobiusApp.services.auth.infiniti', [])
    .service( 'infinitiAuthStrategy', InfinitiAuthStrategy);

  function InfinitiAuthStrategy($window, userObject, cookieFactory) {

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    // The infiniti script doesn't return a promise for logout so use the event
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';

    $window.addEventListener(EVENT_CUSTOMER_LOGGED_OUT, function() {
      // Do a full reload! Fixes subtle issues after logout that we don't want to fix as Keystone is the go-forward SSO
      $window.location.reload();
    });

    function isSSOReady () {
      return $window.infiniti && $window.infiniti.api;
    }

    function hasSSOCookies () {
      return !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function isProfileLoaded () {
      return !!(userObject.id && userObject.email);
    }

    var login = function () {
      if (isSSOReady()) {
        $window.infiniti.api.login();
      } else {
        console.warn('Login could not happen as infiniti has not been loaded..');
      }
    };

    var logout = function () {
      if (isSSOReady()) {
        $window.infiniti.api.logout();
      } else {
        console.warn('logout could not happen as infiniti has not been loaded..');
      }
    };

    var isLoggedIn = function () {
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

  }

}());
