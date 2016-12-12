'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.campaign', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('CampaignCtrl', function($scope, $modalInstance, $controller, data) {
  if(data && data.campaign){
    $scope.campaign = data.campaign;
  }
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  console.log('show the data');
  console.log($scope.campaign);
});
