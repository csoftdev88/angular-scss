'use strict';
/*
 * This service is for processing and storing room upgrades
 */
angular.module('mobiusApp.services.roomUpgrades', [])
  .service('roomUpgradesService', function($state, apiService, $timeout, _) {
    var currentUpgrade = {};

    //Function to retrieve room upgrade data from API
    function getRoomUpgrades(upgradeGuid){
      return apiService.get(apiService.getFullURL('reservations.upgradeRoom', {upgradeGuid: upgradeGuid}),null,true);
    }

    //Function to validate if an upgrade is available
    function findActiveRoomUpgrade(data, roomCode) {
      var upgrade = _.find(data.upgrades, function (upgrade) { //Find the relevant upgrade for the roomCode specified in the URL
        if (upgrade.room) { //Only return matching upgrades that are available
          return upgrade.available && upgrade.room.code === roomCode;
        }
      });
      return upgrade;
    }
    
    //Function to process and action a valid upgrade
    function actionRoomUpgrade(reservation, upgrade, roomCode, upgradeGuid){
      //Store the upgrade data in our service
      var upgradeData = {};
      upgradeData.reservation = reservation;
      upgradeData.upgrade = upgrade;

      //Store the upgrade data in our service
      setStoredUpgrade(upgradeData);

      //Advance to the reservation flow 
      goToReservation(reservation, roomCode, upgradeGuid);
    }

    function invalidateRoomUpgrade(){
      console.log('upgrade is invalid');
      notifyUpgrade('fail');
      $state.go('home');
    }

    //Function to format reservation URL and send user to this URL
    function goToReservation(reservation, roomCode, upgradeGuid) {
      var propertyCode = reservation.property ? reservation.property.code : null;
      var productCode = reservation.product ? reservation.product.code : null;
      var dates = reservation.from && reservation.to ? reservation.from + '_' + reservation.to : null;

      //TODO: REMOVE TEMPORARY REMOVAL OF PROPERTY PREFIX FROM ROOMCODE
      var propRoomCodeArray = roomCode.split('-');
      var parsedRoomCode = propRoomCodeArray.length ? propRoomCodeArray[1] : null;

      if(propertyCode && productCode){
        var params = {
          property: propertyCode,
          roomID: parsedRoomCode,
          productCode: productCode,
          roomUpgrade: upgradeGuid,
          adults: reservation.adults,
          children: reservation.children,
          dates: dates,
          reservation: reservation.reference,
          email:reservation.customer ? reservation.customer.email : null
        };
        $state.go('reservation.details', params, { reload: true });
      }
      else {
        console.log('Invalid upgrade, property code and product code required');
        invalidateRoomUpgrade();
      }
    }

    //Function to trigger growl alerts
    function notifyUpgrade(scope, type){
      $timeout(function(){
        scope.$broadcast('ROOM_UPGRADE_GROWL_ALERT', type);
      });
    }

    //Retrieve the upgrade that has been previously stored
    function getStoredUpgrade(){
      return currentUpgrade;
    }

    //Save / Update the current stored upgrade
    function setStoredUpgrade(upgrade){
      currentUpgrade = upgrade;
    }

    // Public methods
    return {
      getRoomUpgrades:getRoomUpgrades,
      findActiveRoomUpgrade:findActiveRoomUpgrade,
      actionRoomUpgrade:actionRoomUpgrade,
      invalidateRoomUpgrade:invalidateRoomUpgrade,
      getStoredUpgrade:getStoredUpgrade,
      notifyUpgrade:notifyUpgrade
    };
  });
