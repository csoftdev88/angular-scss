'use strict';
/*
 * This service is for funnel retention
 */
angular.module('mobiusApp.services.funnelRetention', [])
  .service('funnelRetentionService', function($window, Settings, cookieFactory, previousSearchesService, apiService, userObject, _) {

    function isFunnelRetentionActive() {
      return Settings.UI.funnelRetention && Settings.UI.funnelRetention.enable;
    }

    function getCookie(cookieName) {
      return angular.fromJson(cookieFactory(cookieName)) || null;
    }

    function saveSessionCookie(cookieName, cookie) {
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; path=/';
    }

    function sendRetentionMessage(body){
      console.log('call retention end-point');
      apiService.post(apiService.getFullURL('retention'), body).then(function(){
        console.log('retention inactivity message sent');
      });
    }

    function retentionCheck(){
      if(isFunnelRetentionActive() && previousSearchesService.isPreviousSearchesActive() && previousSearchesService.hasSearchedInSession()){
        previousSearches = previousSearchesService.getSearches();
        if(previousSearches && previousSearches.length){
          var lastSearch = _.last(previousSearches);
          var searchBody = cleanParams(lastSearch.params);
          sendRetentionMessage(searchBody);
        }
      }
    }

    function sessionTimeTracker(firstCall){
      if(!firstCall){
        currentSessionLength += inactivityPeriodInterval;
      }

      //If there are no previous searches in the current session make our retention checks
      if (!previousSearchesService.hasSearchedInSession()) {
        //Store the current session inactivity length in a session cookie
        saveSessionCookie(retentionCookieName, {inactiveTime:currentSessionLength});

        //If the session length is less than inactivity period, continue to check
        if(currentSessionLength < inactivityPeriod){
          setTimeout(sessionTimeTracker, inactivityPeriodInterval);
        }
        else {
          sendRetentionMessage();
        }
      }
    }

    function getInactivity(){
      var cookie = getCookie(retentionCookieName);
      return cookie && cookie.inactiveTime ? cookie.inactiveTime : 0;
    }

    function cleanParams(params){
      if(params.dates){
        var datesArray = params.dates.split('_');
        if(datesArray.length){
          params.from = datesArray[0];
          params.to = datesArray[1];
        }
        delete params.dates;
      }
      params.propertyCode = params.property;
      params.productGroupId = params.rate;
      params.customer = userObject;
      delete params.property;
      delete params.rate;
      delete params.fromSearch;
      delete params.propertySlug;
      delete params.locationSlug;
      delete params.regionSlug;
      delete params.scrollTo;

      return params;
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
      isFunnelRetentionActive: isFunnelRetentionActive,
      retentionCheck: retentionCheck,
    };
  });
