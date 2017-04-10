'use strict';
/*
 * This controller handles room upgrades when landing on /upgrade-room/:upgradeGuid
 */
angular.module('mobius.controllers.roomUpgrades', [])
  .controller('RoomUpgradesCtrl', function ($scope, $stateParams, $state, roomUpgradesService) {
    var upgradeGuid = $stateParams.upgradeGuid;
    var roomCode = $stateParams.roomID;
    
    roomUpgradesService.getRoomUpgrades(upgradeGuid).then(function (data) { //Get the room upgrades from our upgrades end-point
      var upgrade = roomUpgradesService.findActiveRoomUpgrade(data, roomCode); //Find the relevant active room upgrade
      if(upgrade){ //If a valid upgrade is retrieved, action the room upgrade
        roomUpgradesService.actionRoomUpgrade(data.reservation, upgrade, roomCode, upgradeGuid);
      }
      else { //Otherwise invalidate the room upgrade
        roomUpgradesService.invalidateRoomUpgrade();
      }
    }, function () {
      console.log('Error retrieving upgrades');
      roomUpgradesService.invalidateRoomUpgrade();
    });
  }
  );
