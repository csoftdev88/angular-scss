'use strict';
/*
* This module controls single reservation in modal window
*/
angular.module('mobius.controllers.modals.reservation', [])

.controller( 'ModalReservationCtrl', function($scope, $controller, $modalInstance,
  modalService, reservation) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.reservation = reservation;
});
