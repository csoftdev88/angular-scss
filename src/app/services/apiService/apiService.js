'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http, $window, _, Settings) {
  var headers = Settings.API.headers;

  function get(url, params) {
    var q = $q.defer();
    $http({
      method: 'GET',
      url: url,
      headers: headers,
      params: params
    }).success(function(res) {
      q.resolve(res);

    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }

  function post(url, data, params) {
    var q = $q.defer();

    $http({
      method: 'POST',
      url: url,
      headers: headers,
      data: data,
      params: params
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }

  function put(url, data, params) {
    var q = $q.defer();

    $http({
      method: 'PUT',
      url: url,
      headers: headers,
      data: data,
      params: params
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      q.reject(err);
    });

    return q.promise;
  }

  function getFullURL(path, params) {
    var URL = getValue(Settings.API, path);
    // NOTE: We might want to throw error in case when path is not found
    $window._.each(params, function(value, key){
      URL = URL.replace(':' + key, value);
    });

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

  function setHeaders(obj) {
    _.extend(headers, obj);
  }

  var cache = {};

  function getThrottled(url, params, timeout) {
    var canCache = !params || Object.keys(params).length === 0;
    if (canCache) {
      timeout = timeout || Settings.API.defaultThrottleTimeout;
      var ts = (new Date()).valueOf();
      if (!cache[url] || (cache[url].ts + timeout * 1000) < ts) {
        cache[url] = {
          ts: ts,
          p: api.get(url, params)
        };
      }
      return cache[url].p;
    } else {
      return api.get(url, params);
    }
  }

  function objectToQueryParams(obj){
    return $window.$.param(obj);
  }

  // Public methods
  var api = {
    get: get,
    getThrottled: getThrottled,
    post: post,
    put: put,
    getFullURL: getFullURL,
    setHeaders: setHeaders,
    objectToQueryParams: objectToQueryParams
  };
  return api;
});
