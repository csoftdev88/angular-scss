'use strict';
/*
* This a controller for SSO methods
*/
angular.module('mobius.controllers.common.sso', [])

.controller( 'SSOCtrl', function($scope, $timeout, $window, Settings, apiService) {

  function isSSOReady(){
    return $window.infiniti && $window.infiniti.api;
  }

  function isInfinitiLogin(){
    return Settings.authType === 'infiniti';
  }

  function setErrorMsg(msg){
    $scope.loginDialogError = msg;
  }

  function clearErrorMsg(){
    $scope.loginDialogError = null;
  }

  $scope.loginDialogError = null;
  $scope.showLoginDialog = false;

  $scope.sso = {
    // NOTE: INFINITI SSO doesnt expose the API methods right away
    isInfiniti: function(){
      return isInfinitiLogin();
    },
    login: function(){
      if(isInfinitiLogin()){
        $window.infiniti.api.login();
      }
      else{
        $scope.showLoginDialog = !$scope.showLoginDialog;
        console.log($scope.showLoginDialog);
      }
    },
    doLogin: function(loginForm, loginData){
      if(!isInfinitiLogin()){
        loginForm.$submitted = true;
        if (loginForm.$valid) {
          apiService.get(apiService.getFullURL('customers.login'), loginData).then(function(){
            clearErrorMsg();
          }, function(){
            //TODO: Move into locale
            setErrorMsg('The email and/or password you entered is incorrect');
          });
        }
        else{
          setErrorMsg('Please fill out all the fields indicated');
        }
      }
    },
    register: function(registerForm, registerData){
      if(isInfinitiLogin()){
        $window.infiniti.api.register();
      }
      else{
        registerForm.$submitted = true;
        if (registerForm.$valid) {
          apiService.post(apiService.getFullURL('customers.register'), registerData).then(function(){
            clearErrorMsg();
          }, function(){
            //TODO: Move into locale
            setErrorMsg('Sorry, there was an error, please try again');
          });
        }
        else{
          setErrorMsg('Please fill out all the fields indicated');
        }
      }
    },
    reset: function(resetForm, resetData){
      if(!isInfinitiLogin()){
        resetForm.$submitted = true;
        if (resetForm.$valid) {
          apiService.post(apiService.getFullURL('customers.forgotPassword'), resetData).then(function(data){
            clearErrorMsg();
            setErrorMsg(data.status);
          }, function(){
            //TODO: Move into locale
            setErrorMsg('The email you entered is not registered');
          });
        }
        else{
          setErrorMsg('Please fill out all the fields indicated');
        }
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
    },
    clearErrors: function(){
      clearErrorMsg();
    }
  };
});
