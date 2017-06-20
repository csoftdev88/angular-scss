'use strict';

angular.module('mobiusApp.services.api', [])

.service( 'apiService',  function($q, $http, $window, $rootScope, $location, $interval, _, Settings, userObject,
                                  $cacheFactory, sessionDataService, channelService, stateService) {

  var sessionCookie = sessionDataService.getCookie();
  var sessionId = sessionCookie.sessionData.sessionId;
  var env = document.querySelector('meta[name=environment]').getAttribute('content');
  var headers = {
    'mobius-tenant': Settings.API.headers['Mobius-tenantId'],
    'Mobius-channelId': channelService.getChannel().channelID,
    'mobius-sessionId': sessionId,
    'mobius-chainId': Settings.API.headers['Mobius-chainId'] ? Settings.API.headers['Mobius-chainId'] : null
  };

  var cookieExpiryDate = null;
  var expiryMins = Settings.API.sessionData.expiry || 15;

  cookieExpiryDate = new Date();
  cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

  function get(url, params, cacheParam) {

    // Promise to return
    var defer = $q.defer();

    // Http config options
    var config = {
      method: 'GET',
      url: url,
      headers: headers,
      params: params
    };

    // If there are any request parameters or the cacheParam is set to false, do not cache
    var canCache = !params || Object.keys(params).length === 0;
    canCache = cacheParam === false ? false : canCache;

    // Create the headers
    headers['mobius-requestId'] = $rootScope.requestId;
    handleSessionDataHeaders();

    // If we can cache the response, use angular's http cache
    // https://docs.angularjs.org/api/ng/service/$http#caching
    if (canCache) {
      config.cache = true;
    }

    $http(config).success(function(res, status, resHeaders) {
      if(Settings.authType === 'mobius' && resHeaders('mobius-authentication')){
        updateMobiusAuthHeader(resHeaders('mobius-authentication'));
      }
      defer.resolve(res);

    }).error(function(err, status, resHeaders) {
      logApiError('GET', err, url, params, resHeaders);
      defer.reject(err);
    });

    return defer.promise;
  }

  function post(url, data, params, ignoreHeaders, ignoreLogging) {
    var q = $q.defer();

    if(!ignoreHeaders)
    {
      //sessionData
      handleSessionDataHeaders();
    }

    headers['mobius-requestId'] = $rootScope.requestId;
    /*headers['mobius-test-override'] = '#MOB^$32ADjj*';
    headers['secrettest-customer-figur8'] = '179622';
    headers['secrettest-customer-mobius'] = '210404';*/

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
    }).error(function(err, status, resHeaders) {
      if(!ignoreLogging){
        logApiError('POST', err, url, params, resHeaders);
      }
      q.reject(err);
    });

    return q.promise;
  }

  function put(url, data, params) {
    var q = $q.defer();

    //sessionData
    handleSessionDataHeaders();

    headers['mobius-requestId'] = $rootScope.requestId;

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
    }).error(function(err, status, resHeaders) {
      logApiError('PUT', err, url, params, resHeaders);
      q.reject(err);
    });

    return q.promise;
  }

  function infinitiApeironPost(url, data, username, password) {
    var q = $q.defer();

    $http({
      method: 'POST',
      url: url,
      headers: {'Authorization':'Basic ' + btoa(username + ':' + password)},
      data: data
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      //logApiError('POST', err, url, null, resHeaders);
      q.reject(err);
    });

    return q.promise;
  }

  /*function serializeParams(obj, prefix) {
    var str = [], p;
    for(p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
        str.push((v !== null && typeof v === 'object') ?
          serializeParams(v, k) :
          encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return str.join('&');
  }*/

  function getFullURL(path, params) {
    var URL = getValue(Settings.API, path);
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var base = Settings.API.baseURL[env];

    if(Settings.API.languageInPath) { //If enabled this statement will add the language code to the URL path to circumvent cloudflare caching issue
      //Only use the first 2 characters of the language code because the doesn't support localised languages i.e. en-us
      var languageCode = stateService.getAppLanguageCode() ? stateService.getAppLanguageCode().substring(0, 2) : null;
      if(languageCode) {
        base += languageCode + '/';
      }
    }

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
    console.log('APi headers set to', obj);
  }

  function handleSessionDataHeaders(){
    if(Settings.API.sessionData.includeInApiCalls && sessionCookie){
      setHeaders(sessionCookie);
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

  function trackUsage(url, requestId) {
    if(Settings.API.trackUsage){
      var usagePayload = {
        'metric':'performance',
        'system':'mobius-web',
        'environment':env,
        'endpoint':url,
        'host':$location.host(),
        'requestID':requestId,
        'sessionID':sessionId,
        'type':'page load'
      };

      $http({
        method: 'POST',
        url: 'https://webservice.mobiuswebservices.com/monitor/record',
        data: usagePayload
      }).success(function() {}).error(function(err) {console.log(err);});
    }
  }

  function logApiError(type, error, url, params, resHeaders){
    //Only send alert if an error is passed
    if(error){
      //Send our error log to sentry
      $window.Raven.captureException('API ERROR - Type:'+ type +', Error:' + JSON.stringify(error) + ', URL:' + url + ', Params:' + JSON.stringify(params) + ', Headers:' + JSON.stringify(resHeaders()));

      //Send our error to alerts end-endpoint
      sendApiAlert(type, error, url, params, resHeaders);
    }
  }

  function sendApiAlert(type, error, url, params, resHeaders){
    if(Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env]){
      //error params url headers
      var alertData = {
        'client': Settings.infinitiApeironTracking[env].username,
        'id': Settings.infinitiApeironTracking[env].id,
        'component': 'mobius-web',
        'description': 'Failed api request sent from mobius-web',
        'meta': {
          'error': error,
          'type': type,
          'url': url,
          'params': params,
          'headers': resHeaders
        },
        'severity': 5
      };
      sendMobiusAlert(alertData);
    }
  }

  function sendMobiusAlert(alertData){
    post('https://webservice.mobiuswebservices.com/alerting/alert', alertData, null, true, true);
  }

  function sendApeironAlert(component, env, stateParams, reservationData, priceData){
    var numberOfOccupants = 0;
    if(stateParams.adults){
      numberOfOccupants += parseInt(stateParams.adults);
    }
    if(stateParams.children){
      numberOfOccupants += parseInt(stateParams.children);
    }
    var bookedDate = stateParams.dates ? stateParams.dates.split('_') : null;
    var fromDate = null;
    if (bookedDate && bookedDate.length) {
      fromDate = bookedDate[0];
    }
    var alertData = {
      'client': Settings.infinitiApeironTracking[env].username,
      'id': Settings.infinitiApeironTracking[env].id,
      'component': component,
      'description': 'Booking sent to Apeiron from Mobius-web',
      'meta': {
          'reference number': reservationData && reservationData.length ? reservationData[0].reservationCode : null,
          'bookDate': $window.moment.utc(new Date()).format('YYYY-MM-DD'),
          'stayDate': fromDate,
          'noOfOccupants': numberOfOccupants,
          'totalRate': priceData.totalAfterTaxAfterPricingRules
      },
      'severity': 5
    };
    sendMobiusAlert(alertData);
  }

  function mobiusTrackingPost(url, data) {
    var q = $q.defer();

    $http({
      method: 'POST',
      url: url,
      data: data
    }).success(function(res) {
      q.resolve(res);
    }).error(function(err) {
      //logApiError('POST', err, url, null, resHeaders);
      q.reject(err);
    });

    return q.promise;
  }

  // Public methods
  var api = {
    get: get,
    getThrottled: getThrottled,
    post: post,
    put: put,
    getFullURL: getFullURL,
    setHeaders: setHeaders,
    objectToQueryParams: objectToQueryParams,
    infinitiApeironPost: infinitiApeironPost,
    trackUsage: trackUsage,
    sendApeironAlert: sendApeironAlert,
    mobiusTrackingPost: mobiusTrackingPost
  };
  return api;
});
