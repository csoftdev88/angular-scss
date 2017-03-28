'use strict';
/*
 * This controller handles room upgrades when landing on /upgrade-room/:upgradeGuid
 */
angular.module('mobius.controllers.upgradeRoom', [])
  .controller('UpgradeRoomCtrl', function($scope, $stateParams, upgradeRoomService){
    console.log($scope);
    console.log($stateParams);
    var upgradeGuid = $stateParams.upgradeGuid;
    upgradeRoomService.getUpgrade(upgradeGuid).then(function(){
      console.log('got upgrade');
    });
  }
);
