'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http, $window, $interval, _, Settings, userObject, $cacheFactory) {
  var headers = Settings.API.headers;
  var apiCache = $cacheFactory('apiCache');

  function get(url, params) {
    var q = $q.defer();
    var canCache = !params || Object.keys(params).length === 0;
    
    if (canCache && angular.isUndefined(apiCache.get(url))) {
      //console.log('canCache and not cached: ' + url);
      $http({
        method: 'GET',
        url: url,
        headers: headers,
        params: params
      }).success(function(res, status, resHeaders) {
        //console.log('GET url 1: ' + url + ' The request headers are: ' + angular.toJson(headers) + ' and the response headers are: ' + angular.toJson(resHeaders()));
        if(Settings.authType === 'mobius' && resHeaders('mobius-authentication')){
          updateMobiusAuthHeader(resHeaders('mobius-authentication'));
        }
        apiCache.put(url, res);
        q.resolve(res);

      }).error(function(err) {
        q.reject(err);
      });
    }
    else if(canCache && angular.isDefined(apiCache.get(url))){
      q.resolve(apiCache.get(url));
    }
    else{
      //console.log('cannot cache: ' + url);
      $http({
        method: 'GET',
        url: url,
        headers: headers,
        params: params
      }).success(function(res, status, resHeaders) {
        //console.log('GET url 2: ' + url + ' with params: ' + params + ' The request headers are: ' + angular.toJson(headers) + ' and the response headers are: ' + angular.toJson(resHeaders()) + ' and the response status is: ' + status);
        if(Settings.authType === 'mobius' && resHeaders('mobius-authentication')){
          updateMobiusAuthHeader(resHeaders('mobius-authentication'));
        }
        q.resolve(res);

      }).error(function(err) {
        q.reject(err);
      });
    }
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
    }).success(function(res, status, resHeaders) {
      if(Settings.authType === 'mobius' && resHeaders('mobius-authentication')){
        updateMobiusAuthHeader(resHeaders('mobius-authentication'));
      }
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
    }).success(function(res, status, resHeaders) {
      if(Settings.authType === 'mobius' && resHeaders('mobius-authentication')){
        updateMobiusAuthHeader(resHeaders('mobius-authentication'));
      }
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

  function updateMobiusAuthHeader(val) {
    console.log('updateMobiusAuthHeader: ' + val);
    var headersObj = {};
    headersObj['mobius-authentication'] = val;
    setHeaders(headersObj);
    userObject.token = val;
  }

  var cache = {};

  function getThrottled(url, params, timeout) {
    var canCache = !params || Object.keys(params).length === 0;
    if (canCache) {
      if (!cache[url] || isCacheObjectExpired(url)) {
        timeout = timeout || Settings.API.defaultThrottleTimeout;

        cache[url] = {
          // Expiration timestamp
          ts: $window.moment().valueOf() + timeout * 1000,
          p: api.get(url, params)
        };
      }
      return cache[url].p;
    } else {
      return api.get(url, params);
    }
  }

  function isCacheObjectExpired(key){
    return cache[key].ts < $window.moment().valueOf();
  }

  function initCacheFlusher(delay){
    $interval(function(){
      _.each(_.keys(cache), function(key){
        if(isCacheObjectExpired(key)){
          delete cache[key];
        }
      });
    }, delay, 0, false);
  }

  if(Settings.API.cacheFlushInterval){
    initCacheFlusher(Settings.API.cacheFlushInterval * 1000);
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
