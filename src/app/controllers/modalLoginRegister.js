'use strict';

angular.module('mobius.controllers.modals.loginRegister', [])

.controller( 'LoginRegisterCtrl', function($scope, $controller, $modalInstance,
  modalService) {
  $scope.email = '';
  $scope.success = false;

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.openPasswordResetDialog = function(){
    $scope.cancel();

    modalService.openPasswordResetDialog();
  };
});
