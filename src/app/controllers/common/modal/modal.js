'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.generic', [])

.controller( 'ModalCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
