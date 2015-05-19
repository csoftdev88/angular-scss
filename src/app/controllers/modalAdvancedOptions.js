'use strict';
/*
* This module controls advanced options dialogs for booking widgets
*/
angular.module('mobius.controllers.modals.advancedOptions', [])

.controller( 'AdvancedOptionsCtrl', function($scope, data, Settings, contentService,
  $controller, $modalInstance, $window) {

  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  $scope.settings = {
    maxAdults: Settings.UI.bookingWidget.maxAdults,
    maxChildren: Settings.UI.bookingWidget.maxChildren,
    maxRooms: Settings.UI.bookingWidget.advanced.maxRooms
  };

  $scope.rates = [];
  console.log(data);

  $scope.options = {
    // NOTE: Selected rate will be replaced with selectedRate object
    // once rates are loaded from the server
    selectedRate: data.rate || null,
    multiRoom: data.multiRoom || false,
    rooms: data.rooms || [{adults: 1, children: 0}]
  };

  $scope.canAddRoom = true;
  $scope.showRemove = false;

  /**
   * Function loads list of available rate types from API (eg Corporate Rate, Best Available Rate)
   */
  // TODO: Add cache
  $scope.loadValidRates = function(){
    contentService.getRates().then(function(data) {
      // Checking if selected rate exist in the list
      if($scope.options.selectedRate){
        var rateIndex = $window._.findIndex(data, function(r){
          return r.id === $scope.options.selectedRate;
        });

        if(rateIndex === -1){
          // Invalidating the value when rate is not found
          $scope.options.selectedRate = null;
        }
      }

      $scope.rates = data;
    });
  };

  $scope.loadValidRates();

  // TODO: Simplify these functions into one
  $scope.addRoom = function(){
    var count = $scope.options.rooms.length;
    if (count < $scope.settings.maxRooms){
      $scope.options.rooms.push({adults: 1, children: 0});
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

    console.log(result);
    $modalInstance.close(result);
  };
});
