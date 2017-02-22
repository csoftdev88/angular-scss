'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.altProducts', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('AltProductsCtrl', function($scope, $modalInstance, $controller, $state, $stateParams, data) {
  $scope.data = data;
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
});
