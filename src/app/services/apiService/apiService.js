'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http, Settings) {
  function get(url, params) {
    var q = $q.defer();
    console.log('Settings.API.headers'  + JSON.stringify(Settings.API.headers, null,4));

    $http({
      method: 'GET',
      url: url,
      headers: {
        'Authorization': 'Basic ZGllZ286ZGllZ28=',
        'Mobius-chainId': '1',
        'Mobius-channelId': '6'
      },
      params: params
    }).success(function(res) {
      q.resolve(res);

    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }


  function post(url, data) {
    var q = $q.defer();

    $http({
      method: 'POST',
      url: url,
      headers: {
        'Authorization': 'Basic ZGllZ286ZGllZ28=',
        'Mobius-chainId': '1',
        'Mobius-channelId': '6'
      },
      data: data
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }

  function getFullURL(path) {
    var URL = getValue(Settings.API, path);
    // NOTE: We might want to throw error in case when path is not found
    return Settings.API.baseURL + URL;
  }

  function getValue(obj, path) {
    var keys = path.split('.');
    for(var i=0; i<keys.length; i++){
      obj = obj[keys[i]];

      if(typeof obj === 'undefined'){
        return '';
      }
    }

    return obj;
  }

  // Public methods
  return {
    get: get,
    post: post,
    getFullURL: getFullURL
  };
});
