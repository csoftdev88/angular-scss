'use strict';
/*
* This a controller for auth-protected routes
*/
angular.module('mobius.controllers.common.auth', [])

.controller( 'AuthCtrl', function($scope, _, user, config) {
  var customerId = user.getCustomerId();
  if(customerId && _.isFunction(config.onAuthorized)){
    config.onAuthorized();
  }
});
