'use strict';
/*
 * This service handles session data to be sent in API headers
 */
angular.module('mobiusApp.services.sessionDataService', [])
  .service( 'sessionDataService',  function($window, cookieFactory, Settings, userObject, channelService) {

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;
    var cookieName = Settings.API.sessionData.cookieName;
    var cookie = {};


    function generateUUID() {
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === 'function'){
        d += window.performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;// jshint ignore:line
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);// jshint ignore:line
      });
      return uuid;
    }


    function initCookie(){
      if(!Settings.API.sessionData.includeInApiCalls){
        return;
      }
      //set defaults
      if(!cookieFactory(cookieName)){
        cookie[Settings.API.sessionData.httpHeaderFieldName] = Settings.API.sessionData.data;
        cookie[Settings.API.sessionData.httpHeaderFieldName].channel = channelService.getChannel().channelID;
        cookie[Settings.API.sessionData.httpHeaderFieldName].sessionId = generateUUID();
        setCookie();
      }
      else{
        cookie = angular.fromJson(cookieFactory(cookieName));
      }
    }
    initCookie();


    function setCookieExpiry(){
      cookieExpiryDate = new Date();
      cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));
    }

    function setCookie(){
      //update expiry
      setCookieExpiry();
      cookie[Settings.API.sessionData.httpHeaderFieldName].customerId = userObject && userObject.id ? userObject.id : null;
      cookie[Settings.API.sessionData.httpHeaderFieldName].profile = userObject && userObject.id ? userObject : null;
      cookie[Settings.API.sessionData.httpHeaderFieldName].infinitiSessionId = userObject && userObject.id && cookieFactory('INFSSID') ? cookieFactory('INFSSID') : null;
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
    }

    function getCookie(){
      if(!cookieFactory(cookieName)){
        initCookie();
      }
      //upadte cookie
      setCookie();
      return angular.fromJson(cookieFactory(cookieName));
    }

    // Public methods
    return {
      getCookie: getCookie,
      generateUUID: generateUUID
    };
  });
