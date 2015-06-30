'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $window) {
  $scope.sso = {
    // NOTE: INFINITI SSO doesnt expose the API methods right away
    login: function(){
      $window.infiniti.api.login();
    },
    register: function(){
      $window.infiniti.api.register();
    },
    profile: function(){
      $window.infiniti.api.profile();
    },
    logout: function(){
      $window.infiniti.api.logout();
    },
  };
});
