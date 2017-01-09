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

  if($scope.data.upsell.description)
  {
    $scope.data.upsell.displayDescription = $scope.data.upsell.description;
  }
  else if($scope.data.upsell.roomHighlight)
  {
    $scope.data.upsell.displayDescription = $scope.data.upsell.roomHighlight;
  }
  else {
    $scope.data.upsell.displayDescription = $scope.data.upsell.roomDescription;
  }

  $scope.goToReservationDetails = function(roomCode){
    if(roomCode)
    {
      $scope.cancel();
      data.params.roomID = data.upsell.roomCode;
      goToReservationDetails(data.product, data.params, true);
    }
    else {
      $scope.cancel();
      goToReservationDetails(data.product, data.params, false);
    }
  };
});
