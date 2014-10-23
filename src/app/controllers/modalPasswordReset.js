'use strict';

angular.module('mobius.controllers.modalPasswordReset', [])

.controller( 'ModalPasswordResetCtrl', function($scope, $modalInstance) {
  $scope.email = '';
  $scope.success = false;

  $scope.ok = function(email) {
    $scope.success = true;
    $scope.email = email;
    // $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
