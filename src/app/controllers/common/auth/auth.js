'use strict';
/*
* This a controller for auth-protected routes
*/
angular
  .module('mobius.controllers.common.auth', [
    'mobiusApp.services.auth.mobius',
    'mobiusApp.services.auth.infiniti',
    'mobiusApp.services.auth.keystone'
  ])
  .controller( 'AuthCtrl', function($scope, _, user, config, mobiusAuthStrategy, infinitiAuthStrategy,
                                    keystoneAuthStrategy, Settings) {

    // The auth strategy to use, it will be assigned to one of the <type>AuthStrategy services
    var strategy;

    // Function to ensure a strategy has the correct functions. As js does not have interfaces we need
    // to check at run time if the object is valid, otherwise a type error will be thrown
    var isValidStrategy = function (strategy) {
      return _.isFunction(strategy.login) && _.isFunction(strategy.logout) && _.isFunction(strategy.isLoggedIn);
    };

    // Set the auth strategy if it has not been set yet
    if (!strategy) {
      switch (Settings.authType) {
        case ('mobius'):
          strategy = mobiusAuthStrategy;
          break;
        case ('infiniti'):
          strategy = infinitiAuthStrategy;
          break;
        case ('keystone'):
          strategy = keystoneAuthStrategy;
          break;
        default:
          console.warn('The application has been configured without a valid auth type!!');
          break;
      }
      if (!isValidStrategy(strategy)) {
        console.warn('The application has been configured with an invalid auth strategy');
      }
    }

    console.log('the auth promise is', user.authPromise);
    // Set the callback to run once authenticated
    user.authPromise.then(function (isMobiusUser) {
      console.log('the auth promise called in user', isMobiusUser);
      if (_.isFunction(config.onAuthorized)) {
        return config.onAuthorized(isMobiusUser);
      }
    });

    // Invalidate the auth callback when the controller looses scope
    $scope.$on('$destroy', function() {
      config.onAuthorized = _.noop;
    });

    // ---- AUTH FUNCTIONS -----
    var login = function (options) {
      if (strategy) {
        return strategy.login($scope, options);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    var logout = function (options) {
      if (strategy) {
        return strategy.logout($scope, options);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    var isLoggedIn = function (options) {
      if (strategy) {
        return strategy.isLoggedIn($scope, options);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    var register = function (options) {
      if (strategy) {
        return strategy.register($scope, options);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    var viewProfile = function (options) {
      if (strategy) {
        return strategy.viewProfile($scope, options);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    var reset = function (resetForm, resetData) {
      if (strategy) {
        return strategy.reset(resetForm, resetData, $scope);
      }
      console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
    };

    // ---- UTILITY FUNCTIONS -----
    var getStrategy = function () {
      return Settings.authType;
    };

    var isInfiniti = function () {
      return Settings.authType === 'infiniti';
    };

    var isMobius = function () {
      return Settings.authType === 'mobius';
    };

    var isKeystone = function () {
      return Settings.authType === 'keystone';
    };

    var clearErrorMsg = function () {
      $scope.loginDialogError = false;
      $scope.missingFieldsError = false;
      $scope.incorrectEmailPasswordError = false;
      $scope.notRegisteredEmailError = false;
      $scope.passwordResetSuccess = false;
      $scope.error = false;
      $scope.userRegisteredError = false;
      $scope.genericError = false;
      $scope.missingFieldsError = false;
      $scope.submitted = false;
    };

    // Assign the API to a scope variable
    $scope.auth = {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      register: register,
      viewProfile: viewProfile,
      reset: reset,
      getStrategy: getStrategy,
      isInfiniti: isInfiniti,
      isMobius: isMobius,
      isKeystone: isKeystone,
      clearErrorMsg: clearErrorMsg
    };

  });
