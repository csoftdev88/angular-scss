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
  if($scope.roomDetails.images[0]) {
    $scope.selectedImage = $scope.roomDetails.images[0];
  }

  $scope.onImageClick = function(image) {
    $scope.selectedImage = image;
  };

  $scope.onClickViewMore = function() {
    $modalInstance.dismiss();
  };
});
