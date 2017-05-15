'use strict';
/*
* This a controller for auth-protected routes
*/
angular.module('mobius.controllers.common.auth', [])

.controller( 'AuthCtrl', function($scope, _, user, config, mobiusAuthStrategy, infinitiAuthStrategy, Settings) {

  // The auth strategy to use, it will be assigned to on of the <type>AuthStrategy services
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
      default:
        console.warn('The application has been configured without a valid auth type!!');
        break;
    }
    if (isValidStrategy(strategy)) {
      console.warn('The application has been configured with an invalid auth strategy');
    }
  }

  // Perform authentication callback passed by the config object
  user.authPromise.then(function(isMobiusUser){
    if(_.isFunction(config.onAuthorized)){
      config.onAuthorized(isMobiusUser);
    }
  });

  $scope.login = function (options) {
    if (strategy) {
      return strategy.login($scope, options);
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  $scope.logout = function (options) {
    if (strategy) {
      return strategy.logout($scope, options);
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  $scope.isLoggedIn = function (options) {
    if (strategy) {
      return strategy.isLoggedIn($scope, options);
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  // Invalidate the auth callback when the controller looses scope
  $scope.$on('$destroy', function() {
    config.onAuthorized = _.noop;
  });

});
