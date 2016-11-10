'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.upsells', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('UpsellsCtrl', function($scope, $modalInstance, $controller, data, $window, goToReservationDetails) {
  $scope.data = data;
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.goToReservationDetails = function(roomCode){
    if(roomCode)
    {
      $scope.cancel();
      data.params.roomID = data.upsell.roomCode;
      goToReservationDetails(data.params);
    }
    else {
      $scope.cancel();
      goToReservationDetails(data.params);
    }
  };
});
