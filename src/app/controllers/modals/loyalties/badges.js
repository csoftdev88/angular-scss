'use strict';
/*
* This module controls a modal which displays a list of badges
*/
angular.module('mobius.controllers.modals.loyalties.badges', [])

// NOTE: (ALEX) It seems like loyalties/badges dialogues will have the same functionality
// so we can use the same controller for two dialogues
// TODO: Check ^^^
.controller( 'BadgesCtrl', function($scope, $controller, $modalInstance,
  Settings, data) {

    $controller('ModalDataCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data});

    // NOTE: put this back if some of the badges have pure HTML content
    //$controller('SanitizeCtrl', {$scope: $scope});
    $scope.items = data;
    if(data.length){
      $scope.selectItem(data[0]);
    }

   	$scope.selectItem = function(item){
      $scope.selectedItem = item;
   	};
  }
);
