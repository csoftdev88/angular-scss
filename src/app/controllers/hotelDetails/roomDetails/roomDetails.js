'use strict';
/*
*  Controller for room details page
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope) {
  $scope.selectProduct = function(product){
    console.log(product, 'prod');
    $scope.selectedProduct = product;
  };
});
