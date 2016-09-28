'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http, $window, $interval, _, Settings, userObject, $cacheFactory, sessionDataService, channelService) {

  var headers = {
    'mobius-tenant': Settings.API.headers['Mobius-chainId'],
    'Mobius-channelId': channelService.getChannel().channelID
  };

  var apiCache = $cacheFactory('apiCache');

  var cookieExpiryDate = null;
  var expiryMins = Settings.API.sessionData.expiry || 15;

  cookieExpiryDate = new Date();
  cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

  function get(url, params, cacheParam) {
    var q = $q.defer();
    var canCache = !params || Object.keys(params).length === 0;
    canCache = cacheParam === false ? false : canCache;

    //sessionData
    handleSessionDataHeaders();

    if (canCache && angular.isUndefined(apiCache.get(url))) {
      $http({
        method: 'GET',
        url: url,
        headers: headers,
        params: params
      }).success(function(res, status, resHeaders) {
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
      $http({
        method: 'GET',
        url: url,
        headers: headers,
        params: params
      }).success(function(res, status, resHeaders) {
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

  function post(url, data, params, ignoreHeaders) {
    var q = $q.defer();

    if(!ignoreHeaders)
    {
      //sessionData
      handleSessionDataHeaders();
    }

    $http({
      method: 'POST',
      url: url,
      headers: !ignoreHeaders ? headers : null,
      data: data,
      params: params ? params : null
    }).success(function(res, status, resHeaders) {
      if(!ignoreHeaders && (Settings.authType === 'mobius' && resHeaders('mobius-authentication'))){
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

    //sessionData
    handleSessionDataHeaders();

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
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var base = Settings.API.baseURL[env] || Settings.API.baseURL[env];
    // NOTE: We might want to throw error in case when path is not found
    $window._.each(params, function(value, key){
      URL = URL.replace(':' + key, value).replace(',','%2C');
    });

    return base + URL;
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

  function handleSessionDataHeaders(){
    if(Settings.API.sessionData.includeInApiCalls && sessionDataService.getCookie()){
      setHeaders(sessionDataService.getCookie());
    }
  }

  function updateMobiusAuthHeader(val) {
    var headersObj = {};
    headersObj['mobius-authentication'] = val;
    setHeaders(headersObj);
    userObject.token = val;
    $window.document.cookie = 'MobiusToken' + '=' + val + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
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
