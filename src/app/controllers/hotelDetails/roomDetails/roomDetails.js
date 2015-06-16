'use strict';
/*
*  Controller for room details page
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, modalService) {
  $scope.selectProduct = function(product){
    $scope.selectedProduct = product;
  };

  $scope.setRoomDetails = function(roomDetails){
    $scope.roomDetails = roomDetails;
    debugger;
  };

  $scope.openPoliciesInfo = function(){
    modalService.openPoliciesInfo($scope.selectedProduct);
  };

  $scope.openPriceBreakdownInfo = function(){
    modalService.openPriceBreakdownInfo($scope.roomDetails, $scope.selectedProduct);
  };
});
