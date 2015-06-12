'use strict';
/*
* This module controls a modal which displays a list of badges
*/
angular.module('mobius.controllers.modals.loyalties.badges', [])

.controller( 'BadgesCtrl', function($scope, $controller, $modalInstance,
  Settings, data) {

    $controller('ModalDataCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data});

    // NOTE: put this back if some of the badges have pure HTML content
    //$controller('SanitizeCtrl', {$scope: $scope});
    $scope.badges = data;
    $scope.selectedBadge = data[0];
  }
);
