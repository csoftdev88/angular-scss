'use strict';
/*
 * This service is for processing and storing room upgrades
 */
angular.module('mobiusApp.services.roomUpgrades', [])
  .service('roomUpgradesService', function($state, apiService, _) {
    var currentUpgrade = {};

    //Function to retrieve room upgrade data from API
    function getRoomUpgrades(upgradeGuid){
      return apiService.get(apiService.getFullURL('reservations.upgradeRoom', {upgradeGuid: upgradeGuid}));
    }

    //Function to validate if an upgrade is available
    function findActiveRoomUpgrade(data, roomCode) {
      var upgrade = _.find(data.upgrades, function (upgrade) { //Find the relevant upgrade for the roomCode specified in the URL
        if (upgrade.room) { //Only return matching upgrades that are available
          return upgrade.available && upgrade.roomCode === roomCode;
        }
      });
      return upgrade;
    }
    
    //Function to process and action a valid upgrade
    function actionRoomUpgrade(reservation, upgrade, roomCode, upgradeGuid){
      //Store the upgrade data in our service
      currentUpgrade.reservation = reservation;
      currentUpgrade.upgrade = upgrade;

      var propertyCode = null;
      var productCode = null;

      if (reservation && reservation.property) {
        propertyCode = reservation.property.code;
      }

      if (reservation && reservation.product) {
        productCode = reservation.product.code;
      }

      if(propertyCode && productCode){
        goToReservation(propertyCode, roomCode, productCode, upgradeGuid);
      }
      else {
        console.log('Upgrade processing error: property code or product code could not be retrieved');
      }
    }

    function invalidateRoomUpgrade(){
      console.log('upgrade is invalid');
    }

    function goToReservation(propertyCode, roomCode, productCode, upgradeGuid) {
      var params = {
        property: propertyCode,
        roomID: roomCode,
        productCode: productCode,
        upgradeGuid: upgradeGuid
      };
      $state.go('reservation.details', params, { reload: true });
    }

    // Public methods
    return {
      getRoomUpgrades:getRoomUpgrades,
      findRoomUpgrade:findActiveRoomUpgrade,
      actionRoomUpgrade:actionRoomUpgrade,
      invalidateRoomUpgrade:invalidateRoomUpgrade
    };
  });
