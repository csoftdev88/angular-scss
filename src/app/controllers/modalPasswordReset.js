'use strict';

angular.module('mobius.controllers.modals.passwordReset', [])

.controller( 'ModalPasswordResetCtrl', function($scope, $controller, $modalInstance) {
  $scope.email = '';
  $scope.success = false;

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
});
