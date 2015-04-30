'use strict';
/*
* This module controls user login and password reset dialogs
*/
angular.module('mobius.controllers.modals.loginRegister', [])

.controller( 'LoginRegisterCtrl', function($scope, $controller, $modalInstance,
  modalService, apiService, user, $log) {
  // TODO: same properties should be use for login/reset dialogs
  $scope.emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  $scope.formData = {};

  $scope.success = false;
  $scope.codePattern = /[0-9\-]{8}/;
  $scope.passwordChanged = false;

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.openPasswordResetDialog = function(){
    $scope.cancel();

    modalService.openPasswordResetDialog();
  };

  $scope.openEnterCodeDialog = function(){
    $scope.cancel();

    modalService.openEnterCodeDialog();
  };

  $scope.changePassword = function(){
    $scope.passwordChanged = true;
  };

  $scope.login = function(loginForm, formData){
    if (loginForm.$valid) {
      apiService.post(apiService.getFullURL('customers.login'), formData).then(
        function(response) {
          user.loadUser(response.id).then($scope.ok);
        },
        function(error) {
          $log.error('Login error: ' + JSON.stringify(error, null,4));
          loginForm.$error.wrongCredentials = true;
          loginForm.submitted = true;
        }
      ).finally(function() {
          loginForm.$setPristine();
        });
    }
  };
});
