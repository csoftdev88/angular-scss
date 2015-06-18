'use strict';
/*
* This module controls single reservation in modal window
*/
angular.module('mobius.controllers.modals.associatedRoom', [])

.controller( 'AssociatedRoomCtrl', function($scope, $controller, $modalInstance,
  modalService) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  //$scope.reservation = reservation;
});
