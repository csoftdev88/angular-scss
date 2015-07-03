'use strict';
/*
* This a controller for auth-protected routes
*/
angular.module('mobius.controllers.common.auth', [])

.controller( 'AuthCtrl', function($scope, _, user, config) {
  var authPromise = user.authPromise;

  authPromise.then(function(isMobiusUser){
    if(_.isFunction(config.onAuthorized)){
      config.onAuthorized(isMobiusUser);
    }
  });

  $scope.$on('$destroy', function() {
    config.onAuthorized = _.noop;
  });
});
