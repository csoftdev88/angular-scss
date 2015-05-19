'use strict';
/*
* This module controls advanced options dialogs for booking widgets
*/
angular.module('mobius.controllers.modals.advancedOptions', [])

.controller( 'AdvancedOptionsCtrl', function($scope, data, Settings, contentService,
  $controller, $modalInstance) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.settings = {
    maxAdults: Settings.UI.bookingWidget.maxAdults,
    maxChildren: Settings.UI.bookingWidget.maxChildren,
    maxRooms: Settings.UI.bookingWidget.advanced.maxRooms
  };

  $scope.rates = [];

  $scope.options = {
    selectedRate: data.rate || null,
    multiRoom: data.multiRoom || false,
    rooms: data.rooms || [{id: 'room1', adults: 1, children: 0}]
  };

  $scope.canAddRoom = true;
  $scope.showRemove = false;

  /**
   * Function loads list of available rate types from API (eg Corporate Rate, Best Available Rate)
   */
  // TODO: Add cache
  $scope.loadValidRates = function(){
    contentService.getRates().then(function(data) {
      $scope.rates = data;
    });
  };

  $scope.loadValidRates();

  // TODO: Simplify these functions into one
  $scope.addRoom = function(){
    var count = $scope.options.rooms.length;
    if (count < $scope.settings.maxRooms){
      $scope.options.rooms.push({id: 'room' + (count + 1), adults: 1, children: 0});
    }
    if (count === $scope.settings.maxRooms - 1){
      $scope.canAddRoom = false;
    }
  };

  $scope.removeRoom = function(){
    var count = $scope.options.rooms.length;
    if (count > 1){
      $scope.options.rooms.pop();
    }
    if (count - 1 < $scope.settings.maxRooms){
      $scope.canAddRoom = true;
    }
  };

  $scope.isRemoveVisible = function(i){
    return (i === $scope.options.rooms.length - 1) && (i !== 0);
  };

  $scope.submit = function() {
    var result = {
      multiRoom: $scope.options.multiRoom,
    };

    // Rate
    if($scope.options.selectedRate){
      result.rate = $scope.options.selectedRate;
    }

    // Rooms
    if($scope.options.multiRoom){
      result.rooms = $scope.options.rooms;
    }

    $modalInstance.close(result);
  };
});
