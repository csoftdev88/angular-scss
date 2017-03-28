'use strict';
/*
* Service for upgrading a room
*/

angular.module('mobiusApp.services.upgradeRoomService', [])
.service('upgradeRoomService',  function(Settings, apiService, $q) {
  function getUpgrade(upgradeGuid){
    var q = $q.defer();
    
    apiService.get(apiService.getFullURL('upgradeRoom'), upgradeGuid).then(function(upgradeData){
      q.resolve(upgradeData);
    });

    return q.promise;
  }

  // Public methods
  return {
    getUpgrade: getUpgrade,
  };
});
