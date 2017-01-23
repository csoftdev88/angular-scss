'use strict';
/*
 * This service is for funnel retention
 */
angular.module('mobiusApp.services.funnelRetention', [])
  .service('funnelRetentionService', function($window, Settings, cookieFactory, previousSearchesService, apiService) {

    function isFunnelRetentionActive() {
      return Settings.UI.funnelRetention && Settings.UI.funnelRetention.enable;
    }

    function getCookie(cookieName) {
      return angular.fromJson(cookieFactory(cookieName)) || null;
    }

    function saveSessionCookie(cookieName, cookie) {
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; path=/';
    }

    function retention(){
      console.log('call retention end-point');
      apiService.post(apiService.getFullURL('retention')).then(function(){
        console.log('retention inactivity message sent');
      });
    }

    function sessionTimeTracker(firstCall){
      if(!firstCall){
        currentSessionLength += inactivityPeriodInterval;
      }

      previousSearches = previousSearchesService.getSearches();

      //If there are no previous searches make our retention checks
      if (!previousSearches || !previousSearches.length) {
        //Store the current session inactivity length in a session cookie
        saveSessionCookie(retentionCookieName, {inactiveTime:currentSessionLength});

        //If the session length is less than inactivity period, continue to check
        if(currentSessionLength < inactivityPeriod){
          setTimeout(sessionTimeTracker, inactivityPeriodInterval);
        }
        else {
          retention();
        }
      }
    }

    function getInactivity(){
      var cookie = getCookie(retentionCookieName);
      return cookie && cookie.inactiveTime ? cookie.inactiveTime : 0;
    }

    var inactivityPeriod = isFunnelRetentionActive() ? Settings.UI.funnelRetention.inactivityPeriod : null;
    var inactivityPeriodInterval = isFunnelRetentionActive() ? Settings.UI.funnelRetention.inactivityPeriodInterval : null;
    var retentionCookieName = isFunnelRetentionActive() ? Settings.UI.funnelRetention.cookieName: null;
    var currentSessionLength = isFunnelRetentionActive() ? getInactivity() : 0;
    var previousSearches = previousSearchesService.getSearches();
    //var displayExitModal = isFunnelRetentionActive() ? Settings.UI.funnelRetention.displayExitModal : null;

    if(inactivityPeriod && inactivityPeriodInterval && retentionCookieName && (currentSessionLength < inactivityPeriod)){
      sessionTimeTracker(true);
    }

    // Public methods
    return {
      getCookie: getCookie,
      saveSessionCookie: saveSessionCookie,
      isFunnelRetentionActive: isFunnelRetentionActive
    };
  });
