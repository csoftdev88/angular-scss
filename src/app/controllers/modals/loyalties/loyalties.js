'use strict';
/*
 * This module controls a modal which displays a list of
 * badges/loyalty cards
 */
angular.module('mobius.controllers.modals.loyalties', [])

.controller( 'BadgesCtrl', function($scope, $controller, $modalInstance,
  Settings, data, _) {

    $controller('ModalDataCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data});
    // NOTE: (Alex) put this back if some of the badges/loyalties have pure HTML content
    //$controller('SanitizeCtrl', {$scope: $scope});

    if(_.isEmpty(data)){
      return;
    }

    $scope.items = data;

    $scope.selectItem = function(item){
      $scope.selectedItem = item;
    };

    $scope.selectItem(data[0]);
  }
);
