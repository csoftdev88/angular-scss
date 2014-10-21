'use strict';

angular.module('mobius.controllers.modal', [])

.controller( 'ModalCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
