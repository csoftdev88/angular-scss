'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $timeout, $window, Settings) {

  function isSSOReady(){
    return $window.infiniti && $window.infiniti.api;
  }

  function isInfinitiLogin(){
    return Settings.API.loginEndpoint === 'infiniti';
  }

  $scope.sso = {
    // NOTE: INFINITI SSO doesnt expose the API methods right away
    isInfiniti: function(){
      return isInfinitiLogin();
    },
    login: function(){
      if(isInfinitiLogin()){
        $window.infiniti.api.login();
      }
      
    },
    register: function(){
      if(isInfinitiLogin()){
        $window.infiniti.api.register();
      }
      
    },
    profile: function(){
      if(isInfinitiLogin()){
        $window.infiniti.api.profile();
      }
      
    },
    logout: function(){
      if(isInfinitiLogin()){
        $window.infiniti.api.logout();
      }
    },
    trackPageView: function(){
      if(!isSSOReady() || !isInfinitiLogin()){
        return;
      }

      $timeout(function(){
        $window.infiniti.api.trackPageView();
      }, 1000);
    },
    trackPageLeave: function(){
      if(!isSSOReady() || !isInfinitiLogin()){
        return;
      }

      $window.infiniti.api.trackPageLeave();
    }
  };
});
