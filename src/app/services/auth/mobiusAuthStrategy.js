/**
 * Auth service used when the mobiusApp.config.Settings has been set to mobius.
 *
 * This service interacts with mobius soap to rest customer endpoint (mobius auth). For new tenants, please
 * ensure you use keystone, this should only be kept for legacy support.
 *
 * @see Auth
 * @tenants Meandall, national
 * @author Bryan Kneis
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp.services.auth.mobius', [])
    .service( 'mobiusAuthStrategy', MobiusAuthStrategy);

  function MobiusAuthStrategy($rootScope, $q, $timeout, $state, user, apiService, userObject, $log) {

    // The header's attributes name
    var AUTH_HEADER = 'mobius-authentication';
    // Name of the cookie to expose mobius customer ID
    var KEY_CUSTOMER_ID = 'mobius-authentication';

    /**
     * Clear the error messages on the login / register modal
     * The booleans are bound to the page's controller, hence why its passed in via param
     * @param scope
     */
    function clearErrorMsg (scope) {
      scope.loginDialogError = false;
      scope.missingFieldsError = false;
      scope.incorrectEmailPasswordError = false;
      scope.notRegisteredEmailError = false;
      scope.passwordResetSuccess = false;
    }

    /**
     * Function used to perform the login, its bound to the scope via the call to login.
     * @param loginForm
     * @param loginData
     */
    var doLogin = function (loginForm, loginData) {
      loginForm.$submitted = true;
      if (loginForm.$valid) {
        var headersObj = {};
        var that = this;
        headersObj[KEY_CUSTOMER_ID] = undefined;
        apiService.setHeaders(headersObj);
        apiService.post(apiService.getFullURL('customers.login'), loginData)
          .then(function (data) {
            if (data.id !== null) {
              $rootScope.showLoginDialog = false;
              clearErrorMsg(that);
              userObject.id = data.id;
              user.storeUserId(data.id);
              user.loadProfile();
            } else {
              that.loginDialogError = true;
              that.incorrectEmailPasswordError = true;
            }
          })
          .catch(function () {
            that.loginDialogError = true;
            that.incorrectEmailPasswordError = true;
          });
      }
    };

    /**
     * Function to show the login modal.
     * As we need a unified API for authenticating due to the 3 different providers, all this login
     * function does is show the login modal and bind the function doLogin to the controllers scope. Then
     * that page will have the login button itself that calls doLogin.
     * @param scope
     * @todo Find a better way to do this
     */
    this.login = function (scope) {
      $rootScope.showLoginDialog = !$rootScope.showLoginDialog;
      scope.doLogin = doLogin.bind(scope);
    };

    /**
     * Perform a logout for the current session's user and clear the headers persisted in the apiService
     * @see apiService
     */
    this.logout = function () {
      $rootScope.$evalAsync(function() {
        userObject = {};
        $state.go('home', {}, {reload: true});
      });
      // Removing auth headers
      var headers = {};
      headers[AUTH_HEADER] = undefined;
      apiService.setHeaders(headers);
      user.clearStoredUser();

      // Create a new auth promise
      // @todo Why do we need to do this ?
      user.authPromise = $q.defer();

      // Submit a login event that updates the base ctrl's function isLoggedIn
      // @todo again, why the hell do we do this?
      $timeout(function () {
        $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
      });
    };

    /**
     * Function to check if the current session is authenticated
     * @returns {boolean}
     */
    this.isLoggedIn = function () {
      return !!(userObject.id && userObject.email);
    };

    /**
     * Function to reset the customer's password
     * @param resetForm
     * @param resetData
     * @param scope
     */
    this.reset = function (resetForm, resetData, scope) {
      resetForm.$submitted = true;
      if (resetForm.$valid) {
        apiService.post(apiService.getFullURL('customers.forgotPassword'), resetData)
          .then(function() {
            clearErrorMsg(scope);
            scope.loginDialogError = true;
            scope.passwordResetSuccess = true;
          })
          .catch(function () {
            scope.loginDialogError = true;
            scope.notRegisteredEmailError = true;
          });
      }
      else{
        scope.loginDialogError = true;
        scope.missingFieldsError = true;
      }
    };

    this.register = function () {
      $log.warn('Register function is not supported by mobius auth');
    };

    this.viewProfile = function () {
      $log.warn('ViewProfile function is not supported by mobius auth');
    };

  }

}());
