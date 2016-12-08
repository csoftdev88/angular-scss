'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $rootScope, $timeout, $window, $state, Settings, apiService, userObject, _, user) {

  function isSSOReady(){
    return $window.infiniti && $window.infiniti.api;
  }

  function isInfinitiLogin(){
    return Settings.authType === 'infiniti';
  }

  function clearErrorMsg(){
    $scope.loginDialogError = false;
    $scope.missingFieldsError = false;
    $scope.incorrectEmailPasswordError = false;
    $scope.notRegisteredEmailError = false;
    $scope.passwordResetSuccess = false;
  }
  clearErrorMsg();

  $rootScope.showLoginDialog = false;

  $scope.sso = {
    // NOTE: INFINITI SSO doesnt expose the API methods right away
    isInfiniti: function(){
      return isInfinitiLogin();
    },
    login: function(){
      if(isInfinitiLogin() && isSSOReady()){
        $window.infiniti.api.login();
      }
      else{
        $rootScope.showLoginDialog = !$rootScope.showLoginDialog;
      }
    },
    doLogin: function(loginForm, loginData){
      if(!isInfinitiLogin()){
        loginForm.$submitted = true;
        if (loginForm.$valid) {
          var headersObj = {};
          headersObj['mobius-authentication'] = undefined;
          apiService.setHeaders(headersObj);
          apiService.post(apiService.getFullURL('customers.login'), loginData).then(function(data){
            if(data.id !== null)
            {
              $rootScope.showLoginDialog = false;
              clearErrorMsg();
              userObject.id = data.id;
              user.storeUserId(data.id);
              user.loadProfile();
            }
            else {
              $scope.loginDialogError = true;
              $scope.incorrectEmailPasswordError = true;
            }
          }, function(){
            $scope.loginDialogError = true;
            $scope.incorrectEmailPasswordError = true;
          });
        }
        else{
          $scope.loginDialogError = true;
          $scope.missingFieldsError = true;
        }
      }
    },
    register: function(){
      if(isInfinitiLogin() && isSSOReady()){
        $window.infiniti.api.register();
      }
    },
    reset: function(resetForm, resetData){
      if(!isInfinitiLogin()){
        resetForm.$submitted = true;
        if (resetForm.$valid) {
          apiService.post(apiService.getFullURL('customers.forgotPassword'), resetData).then(function(){
            clearErrorMsg();
            $scope.loginDialogError = true;
            $scope.passwordResetSuccess = true;
          }, function(){
            $scope.loginDialogError = true;
            $scope.notRegisteredEmailError = true;
          });
        }
        else{
          $scope.loginDialogError = true;
          $scope.missingFieldsError = true;
        }
      }
    },
    profile: function(){
      if(isInfinitiLogin() && isSSOReady()){
        $window.infiniti.api.profile();
      }

    },
    logout: function(){
      if(isInfinitiLogin() && isSSOReady()){
        $window.infiniti.api.logout();
      }
      else{
        user.logout();
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
    },
    clearErrors: function(){
      clearErrorMsg();
    }
  };
});
