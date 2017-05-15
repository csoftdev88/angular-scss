'use strict';
/*
* This a controller for auth-protected routes
*/
angular.module('mobius.controllers.common.auth', [])

.controller( 'AuthCtrl', function($scope, _, user, config) {

  var strategy;

  var isValidStrategy = function (strategy) {
    return _.isFunction(strategy.login) && _.isFunction(strategy.logout) && _.isFunction(strategy.isLoggedIn);
  };

  // If the config object contains an auth strategy, and one has not been set yet
  // then assign the strategy to the controller.
  if (_.isObject(config.strategy) && !strategy) {
    if (isValidStrategy(config.strategy)) {
      strategy = config.strategy;
    } else {
      console.warn('WARNING : Potentially unexpected behaviour. The auth strategy does not meet the requirments.');
    }
  }

  // Perform authentication callback passed by the config object
  user.authPromise.then(function(isMobiusUser){
    if(_.isFunction(config.onAuthorized)){
      config.onAuthorized(isMobiusUser);
    }
  });

  $scope.login = function() {
    if (strategy) {
      return strategy.login();
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  $scope.logout = function() {
    if (strategy) {
      return strategy.logout();
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  $scope.isLoggedIn = function() {
    if (strategy) {
      return strategy.isLoggedIn();
    }
    console.warn('WARNING : Unexpected beahviour, the auth strategy has not been set');
  };

  // Invalidate the auth callback when the controller looses scope
  $scope.$on('$destroy', function() {
    config.onAuthorized = _.noop;
  });

});
