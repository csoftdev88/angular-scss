'use strict';
/*
 * This controller handles room upgrades when landing on /upgrade-room/:upgradeGuid
 */
angular.module('mobius.controllers.roomUpgrades', [])
  .controller('RoomUpgradesCtrl', function ($scope, $stateParams, $state, roomUpgradeService, _) {
    var upgradeGuid = $stateParams.upgradeGuid;
    var roomCode = $stateParams.roomID;
    
    roomUpgradeService.getRoomUpgrades(upgradeGuid).then(function (data) { //Get the room upgrades from our upgrades end-point
      var upgrade = roomUpgradeService.findActiveRoomUpgrade(data, roomCode); //Find the relevant active room upgrade
      if(upgrade){ //If a valid upgrade is retrieved, action the room upgrade
        roomUpgradeService.actionRoomUpgrade(data.reservation, upgrade);
      }
      else { //Otherwise invalidate the room upgrade
        roomUpgradeService.invalidateRoomUpgrade();
      }
    }, function (error) {
      console.log('Error retrieving upgrades');
      console.log(error);
    });
  }
  );
