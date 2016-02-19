'use strict';
/*
 * This service stores user preferences
 */
angular.module('mobiusApp.services.userPreferenceService', [])
  .service( 'userPreferenceService',  function($window, cookieFactory, Settings) {

    var cookieExpiryDate = null;
    if(Settings.UI.user.userPreferencesCookieExpiryDays && Settings.UI.user.userPreferencesCookieExpiryDays !== 0){
      cookieExpiryDate = new Date();
      cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.user.userPreferencesCookieExpiryDays);
    }

    function setCookie(key, value){
      var cookie = angular.fromJson(cookieFactory('mobiusUserPreferences')) || {};
      cookie[key] = value;
      $window.document.cookie = 'mobiusUserPreferences=' + angular.toJson(cookie) + (!cookieExpiryDate ? '' : '; expires=' + cookieExpiryDate.toUTCString()) + '; path=/';
    }

    function getCookie(){
      return angular.fromJson(cookieFactory('mobiusUserPreferences'));
    }

    // Public methods
    return {
      setCookie: setCookie,
      getCookie: getCookie
    };
  });
