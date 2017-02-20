'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.funnelRetentionExit', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('FunnelRetentionExitCtrl', function($scope, $modalInstance, $controller, $state, $stateParams, data) {
  $scope.data = data;
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.addVoucher = function(voucherCode){
    $stateParams.voucher = voucherCode;
    $state.reload();
    $scope.ok();
  };
});
