'use strict';
/*
* This module controls user login and password reset dialogs
*/
angular.module('mobius.controllers.modals.loginRegister', [])

.controller( 'LoginRegisterCtrl', function($scope, $controller, $modalInstance,
  modalService) {
  // TODO: same properties should be use for login/reset dialogs
  $scope.email = '';
  $scope.success = false;

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.openPasswordResetDialog = function(){
    $scope.cancel();

    modalService.openPasswordResetDialog();
  };
});
