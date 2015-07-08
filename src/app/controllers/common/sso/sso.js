'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $timeout, $window) {
  function isSSOReady(){
    return $window.infiniti && $window.infiniti.api;
  }

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
    trackPageView: function(){
      if(!isSSOReady()){
        return;
      }

      $timeout(function(){
        $window.infiniti.api.trackPageView();
      }, 1000);
    },
    trackPageLeave: function(){
      if(!isSSOReady()){
        return;
      }

      $window.infiniti.api.trackPageLeave();
    }
  };
});
