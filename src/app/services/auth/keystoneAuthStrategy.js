/**
 * Auth service used when authType is set to keystone in mobiusApp.config.Settings.
 *
 * The majority of this services function is to interface with the client side keystone
 * library (window.KS). If you find yourself using window.KS, please check to ensure if it
 * should be called via this service.
 *
 * @see AuthCtrl
 * @author Bryan Kneis
 * @version 1.0.0
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp.services.auth.keystone', [])
    .service( 'keystoneAuthStrategy', function($timeout, $state, $log) {

      /**
       * Submit an event to keystone to request the login modal to appear
       *
       * @note The jQuery click emulation is a hack, because the keystone modal is injected into the header,
       * in mobile view the header is collapsed into the side of the screen using a transform. Becuase the modal
       * is position fixed, the z-index is ignored and it makes the modal not appear. So as a work around we need
       * to show the menu on mobile so the modal shows above it.
       */
      this.login = function () {
        $timeout(function () {
          window.dispatchEvent(new CustomEvent('parent.request.login'));
          $('#mobile-menu-opener').click();
        });
      };

      /**
       * Perform a logout and return home, if they are not logged in, just return home
       */
      this.logout = function () {
        if (!window.KS.$me) {
          $state.go('home', {});
        } else {
          window.KS.$me.revoke().then(function() {
            $state.go('home', {});
          });
        }
      };

      /**
       * Check if the current session's user if authenticated by checking if window.KS.$me.get() returns an object
       * @returns {boolean}
       */
      this.isLoggedIn = function () {
        return (window.KS && window.KS.$me && window.KS.$me.get() !== null);
      };

      /**
       * Keystone handles password resets internally so there is no need to supply anything
       */
      this.reset = function () {
        $log.warn('Reset function is not supported by keystone');
      };

      /**
       * Keystone does not have a function to show register, so show login so the user can choose register
       */
      this.register = function () {
        this.login();
      };

      /**
       * The keystone profile is embedded in the profile page within ks-profile-panel, therefore
       * just direct the state to that page
       */
      this.viewProfile = function () {
        $state.go('profile');
      };

    });
}());
