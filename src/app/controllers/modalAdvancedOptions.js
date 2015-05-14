'use strict';
/*
* This module controls advanced options dialogs for booking widgets
*/
angular.module('mobius.controllers.modals.advancedOptions', [])

.controller( 'AdvancedOptionsCtrl', function($scope, contentService, $controller, $modalInstance) {

  $controller('ModalCtrl', {$scope: $scope, contentService: contentService, $modalInstance: $modalInstance});

  var MAX_ROOMS = 4;

  $scope.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  $scope.rates = [];
  $scope.rate = '1';

  $scope.rooms = [
    {id: 'room1', adults: 1, childrens: 0}
  ];

  $scope.multiRoom = '0';
  $scope.canAddRoom = true;
  $scope.showRemove = false;

  /**
   * Function loads list of available rate types from API (eg Corporate Rate, Best Available Rate)
   */
  $scope.loadValidRates = function(){
    contentService.getRates().then(function(data) {
      $scope.rates = data;
    })
  }

  $scope.loadValidRates();

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
