'use strict';

angular.module('mobiusApp.services.auth', [])

  .service( 'mobiusAuthStrategy', function($rootScope, $q, $timeout, $state, user, apiService, userObject) {

    // The header's attributes name
    var AUTH_HEADER = 'mobius-authentication';
    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'mobius-authentication';

    function clearErrorMsg(scope) {
      scope.loginDialogError = false;
      scope.missingFieldsError = false;
      scope.incorrectEmailPasswordError = false;
      scope.notRegisteredEmailError = false;
      scope.passwordResetSuccess = false;
    }

    var login = function (scope, options) {
      scope.loginForm.$submitted = true;

      if (scope.loginForm.$valid) {
        var headersObj = {};
        headersObj[KEY_CUSTOMER_ID] = undefined;
        apiService.setHeaders(headersObj);
        apiService.post(apiService.getFullURL('customers.login'), scope.loginData).then(function (data) {
          if (data.id !== null) {
            $rootScope.showLoginDialog = false;
            clearErrorMsg(scope);
            userObject.id = data.id;
            user.storeUserId(data.id);
            user.loadProfile();
          }
          else {
            scope.loginDialogError = true;
            scope.incorrectEmailPasswordError = true;
          }
        }, function () {
          scope.loginDialogError = true;
          scope.incorrectEmailPasswordError = true;
        });
      }
    };

    var logout = function (scope, options) {
      $rootScope.$evalAsync(function(){
        userObject = {};
        $state.go('home', {}, {reload: true});

      });
      // Removing auth headers
      var headers = {};
      headers[AUTH_HEADER] = undefined;
      apiService.setHeaders(headers);
      user.clearStoredUser();

      user.authPromise = $q.defer();

      $timeout(function () {
        $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
      });
    };

    var isLoggedIn = function (scope, options) {
      return !!(userObject.id && userObject.email);
    };

    var reset = function (scope) {
      scope.resetForm.$submitted = true;
      if (scope.resetForm.$valid) {
        apiService.post(apiService.getFullURL('customers.forgotPassword'), scope.resetData).then(function(){
          clearErrorMsg();
          scope.loginDialogError = true;
          scope.passwordResetSuccess = true;
        }, function () {
          scope.loginDialogError = true;
          scope.notRegisteredEmailError = true;
        });
      }
      else{
        scope.loginDialogError = true;
        scope.missingFieldsError = true;
      }
    };

    var register = function () {
      console.warn('Register function is not supported by mobius auth');
    };

    var viewProfile = function () {
      console.warn('ViewProfile function is not supported by mobius auth');
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
