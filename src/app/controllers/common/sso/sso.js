'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $window) {
  $scope.sso = {
    login: $window.infiniti.api.login,
    register: $window.infiniti.api.register
  };
});
