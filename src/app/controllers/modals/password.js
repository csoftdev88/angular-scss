'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.password', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('PasswordCtrl', function($scope, $modalInstance, $controller, data, $state) {
  $scope.data = data;
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.ok = function() {
    var decodedPassword = atob($scope.data.thirdparty.key);
    if($scope.password && $scope.password === decodedPassword){
      data.passwordInvalid = false;
      $modalInstance.close($scope.data);
    }
    else {
      data.passwordInvalid = true;
    }
  };

  $scope.cancel = function() {
    $state.go('home');
    $modalInstance.dismiss('cancel');
  };
});
