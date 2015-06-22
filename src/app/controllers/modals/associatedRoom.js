'use strict';
/*
* This module controls single reservation in modal window
*/
angular.module('mobius.controllers.modals.associatedRoom', [])

.controller( 'AssociatedRoomCtrl', function($scope, $controller, $modalInstance,
  modalService, data, propertyCode) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
  $scope.propertyCode = propertyCode;

  $scope.roomDetails = data;

  $scope.onClickViewMore = function() {
    $modalInstance.dismiss();
  };
});
