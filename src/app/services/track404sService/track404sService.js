'use strict';
/*
* Service for tracking 404s
*/

angular.module('mobiusApp.services.track404s', [])
.service('track404sService',  function(Settings, apiService) {
  function track(host, path) {
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

    var safePath = path.split('/').join('|');
    var url = Settings.API.track404s.url + '/' + host + '/404/' +  safePath + '/' + todaysDate;
    return apiService.post(url, data, null, true);
  }

  // Public methods
  return {
    track: track,
  };
});
