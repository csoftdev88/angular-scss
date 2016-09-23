'use strict';
/*
* Service for tracking 404s
*/

angular.module('mobiusApp.services.track404s', [])
.service('track404sService',  function(Settings, apiService) {
  function track(host, path, from) {
    var todaysDate = new Date();
    var dd = todaysDate.getDate();
    var mm = todaysDate.getMonth()+1; //January is 0!
    var yyyy = todaysDate.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    }
    if(mm<10) {
        mm='0'+mm;
    }
    todaysDate = mm+'-'+dd+'-'+yyyy;

    var data = {
      'host':host,
      'path':path
    };

    var fromPath = from !== null ? from : host;
    var safeFromPath = fromPath.split('/').join('|');
    var url = Settings.API.track404s.url + '/' + host + '/404/' +  safeFromPath + '/' + todaysDate;
    return apiService.post(url, JSON.stringify(data), null, true);
  }

  // Public methods
  return {
    track: track,
  };
});
