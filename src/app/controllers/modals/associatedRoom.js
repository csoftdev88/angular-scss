'use strict';
// TODO: REMOVE!
/*
* This module controls single reservation in modal window
*/
angular.module('mobius.controllers.modals.associatedRoom', [])

.controller( 'AssociatedRoomCtrl', function($scope, $controller, $modalInstance,
  modalService, data) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.data = data;

  $scope.onClickViewMore = function() {
    $modalInstance.dismiss();
  };
});
