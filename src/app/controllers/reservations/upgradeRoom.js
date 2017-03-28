'use strict';
/*
 * This controller handles room upgrades when landing on /upgrade-room/:upgradeGuid
 */
angular.module('mobius.controllers.reservationUpgradeRoom', [])
  .controller('ReservationUpgradeRoomCtrl', function($scope, $stateParams, $state, reservationService){
    var upgradeGuid = $stateParams.upgradeGuid;
    
    reservationService.getRoomUpgrade(upgradeGuid).then(function(data){
      console.log('got upgrade');
      processRoomUpgrade(data, upgradeGuid);
    }, function(){
      console.log('upgrade could not be retrieved');
      var data = {
        'upgrade': {
          'propertyCode':'ZYYZ',
          'roomCode':'CPKN',
          'productCode':'CHAIN-SFP8'
        }
      };
      processRoomUpgrade(data, upgradeGuid);
    });

    function processRoomUpgrade(data, upgradeGuid){
      var upgrade = data.upgrade;
      goToReservation(upgrade.propertyCode, upgrade.roomCode, upgrade.productCode, upgradeGuid);
    }

    function goToReservation(propertyCode, roomCode, productCode, upgradeGuid){
      var params = {
        property: propertyCode,
        roomID: roomCode,
        productCode: productCode,
        upgradeGuid: upgradeGuid
      };
      $state.go('reservation.details', params, {reload: true});
    }
  }
);
