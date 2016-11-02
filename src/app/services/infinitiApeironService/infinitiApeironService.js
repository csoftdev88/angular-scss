'use strict';
/*
 * This service sends tracking events to infiniti apeiron
 */
angular.module('mobiusApp.services.infinitiApeironService', []).service('infinitiApeironService', [
  'Settings',
  'apiService',
  function (Settings, apiService) {
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var endpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].endpoint : null;

    function trackPurchase(postData) {
      if(endpoint)
      {
        console.log(postData);
        apiService.post('scooobydoo', postData).then(function () {
        }, function (err) {
          console.log('Infiniti apeiron purchase tracking error: ' + angular.toJson(err));
        });
      }
    }

    return {
      trackPurchase: trackPurchase
    };
  }
]);
