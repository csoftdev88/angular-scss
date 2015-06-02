'use strict';
/*
*  Controller for room details page
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, modalService) {
  $scope.selectProduct = function(product){
    $scope.selectedProduct = product;
  };

  $scope.openPoliciesInfo = modalService.openPoliciesInfo;

  $scope.openPriceBreakdownInfo = function(){
    modalService.openPriceBreakdownInfo($scope.selectedProduct);
  };
});
