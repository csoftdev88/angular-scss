'use strict';
/*
* This module controls a modal which displays a list of policies
*/
angular.module('mobius.controllers.modals.policy', [])

.controller( 'PolicyCtrl', function($scope, $controller, $modalInstance,
  Settings, data) {

    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data});
    $controller('SanitizeCtrl', {$scope: $scope});

    $scope.getPolicyTitle = function(policyCode){
      return Settings.UI.policies[policyCode] || policyCode;
    };
  }
);
