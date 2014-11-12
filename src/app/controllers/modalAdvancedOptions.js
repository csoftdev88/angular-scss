'use strict';
/*
* This module controls advanced options dialogs for booking widgets
*/
angular.module('mobius.controllers.modals.advancedOptions', [])

.controller( 'AdvancedOptionsCtrl', function($scope, $controller, $modalInstance) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  var MAX_ROOMS = 4;

  $scope.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  $scope.rates = [
    {value: '1', text: 'Best Available Rate'},
    {value: '2', text: 'Corporate Rate'},
    {value: '3', text: 'AAA/CAA Rate'},
    {value: '4', text: 'Seniors Rate'},
    {value: '5', text: 'Goverment Rates'}
  ];
  $scope.rate = '1';

  $scope.rooms = [
    {id: 'room1', adults: 1, childrens: 0}
  ];

  $scope.multiRoom = '0';
  $scope.canAddRoom = true;
  $scope.showRemove = false;

  // TODO: Simplify these functions into one
  $scope.addRoom = function(){
    var count = $scope.rooms.length;
    if (count < MAX_ROOMS){
      $scope.rooms.push({id: 'room' + (count - 1), adults: 1, childrens: 0});
    }
    if (count === MAX_ROOMS - 1){
      $scope.canAddRoom = false;
    }
  };

  $scope.removeRoom = function(){
    var count = $scope.rooms.length;
    if (count > 1){
      $scope.rooms.pop();
    }
    if (count - 1 < MAX_ROOMS){
      $scope.canAddRoom = true;
    }
  };

  $scope.isRemoveVisible = function(i){
    return (i === $scope.rooms.length - 1) && (i !== 0);
  };


/*  $scope.changePassword = function(){
    $scope.passwordChanged = true;
  };*/

});
