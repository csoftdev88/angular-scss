'use strict';
/*
 * This service is for funnel retention
 */
angular.module('mobiusApp.services.funnelRetention', [])
  .service('funnelRetentionService', function ($window, $q, Settings, cookieFactory, previousSearchesService, apiService, userObject, modalService, _) {

    function isFunnelRetentionActive() {
      return Settings.UI.funnelRetention && Settings.UI.funnelRetention.enable;
    }

    function getCookie(cookieName) {
      return angular.fromJson(cookieFactory(cookieName)) || null;
    }

    function saveSessionCookie(cookieName, cookie) {
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; path=/';
    }

    function getRetentionMessage(body) {
      var q = $q.defer();
      apiService.post(apiService.getFullURL('retention'), body).then(function (data) {
        q.resolve(data);
      }, function (error) {
        q.reject(error);     
      });
      return q.promise;
    }
    
    function displayExitMessage(){
      if(genericRetentionData){
        modalService.openFunnelRetentionExitDialog(genericRetentionData);
      }
      else {
        console.log('get generic retention message');
        getRetentionMessage().then(function(data){
          genericRetentionData = data;
          modalService.openFunnelRetentionExitDialog(genericRetentionData);
        });  
      }
    }

    function displayRetentionAlert(searchBody){
      //If we have params for a contextual message
      if(searchBody){
        getRetentionMessage(searchBody).then(function(retentionMessage){
          console.log('contextual message broadcast alert');
          $scope.$emit('RETENTION_GROWL_ALERT_EMIT', retentionMessage);
        }); 
      }
      //Otherwise if we already have the generic message stored, display it
      else if(genericRetentionData){     
        console.log('generic message broadcast alert');
        $scope.$emit('RETENTION_GROWL_ALERT_EMIT', genericRetentionData);
      }
      //Otherwise if no generic message stored
      else {
        getRetentionMessage().then(function(retentionMessage){
          console.log('new generic message broadcast alert');
          $scope.$emit('RETENTION_GROWL_ALERT_EMIT', retentionMessage);
        }); 
      }
    }

    function retentionClickCheck() {
      if (isFunnelRetentionActive() && previousSearchesService.isPreviousSearchesActive() && previousSearchesService.hasSearchedInSession()) {
        previousSearches = previousSearchesService.getSearches();
        if (previousSearches && previousSearches.length) {
          var lastSearch = _.last(previousSearches);
          var searchBody = buildParams(lastSearch.p);
          displayRetentionAlert(searchBody);
        }
      }
    }

    function sessionTimeTracker(firstCall) {
      if (!firstCall) {
        currentSessionLength += inactivityPeriodInterval;
      }

      //If there are no previous searches in the current session make our retention checks
      if (!previousSearchesService.hasSearchedInSession()) {
        //Store the current session inactivity length in a session cookie
        saveSessionCookie(retentionCookieName, { inactiveTime: currentSessionLength });

        //If the session length is less than inactivity period, continue to check
        if (currentSessionLength < inactivityPeriod) {
          setTimeout(sessionTimeTracker, inactivityPeriodInterval);
        }
        else {
          displayRetentionAlert();
        }
      }
    }

    function getInactivity() {
      var cookie = getCookie(retentionCookieName);
      return cookie && cookie.inactiveTime ? cookie.inactiveTime : 0;
    }

    function buildParams(params) {
      if (params.d) {
        var datesArray = params.d.split('_');
        if (datesArray.length) {
          params.from = datesArray[0];
          params.to = datesArray[1];
        }
        delete params.d;
      }
      params.adults = params.a ? params.a : undefined;
      params.children = params.c ? params.c : undefined;
      params.propertyCode = params.p ? params.p : undefined;
      params.customer = userObject ? userObject : undefined;
      params.productGroupId = params.ra ? params.ra : undefined; //Selected rate filter
      params.promoCode = params.pc ? params.pc : undefined;
      params.groupCode = params.gc ? params.gc : undefined;
      params.corpCode = params.cc ? params.cc : undefined;

      delete params.a;
      delete params.c;
      delete params.p;
      delete params.ra;
      delete params.pc;
      delete params.gc;
      delete params.cc;

      return params;
    }
    
    function init(scope){
      //Bind access to our top level scope
      $scope = scope;
      
      //Set our initial retention data
      console.log('get generic retention message');
      getRetentionMessage().then(function(data){
        genericRetentionData = data;
      });    
    }

    var $scope = null;
    var genericRetentionData = null;
    var inactivityPeriod = isFunnelRetentionActive() ? Settings.UI.funnelRetention.inactivityPeriod : null;
    var inactivityPeriodInterval = isFunnelRetentionActive() ? Settings.UI.funnelRetention.inactivityPeriodInterval : null;
    var retentionCookieName = isFunnelRetentionActive() ? Settings.UI.funnelRetention.cookieName : null;
    var currentSessionLength = isFunnelRetentionActive() ? getInactivity() : 0;
    var previousSearches = previousSearchesService.getSearches();
    //var displayExitModal = isFunnelRetentionActive() ? Settings.UI.funnelRetention.displayExitModal : null;

    if (inactivityPeriod && inactivityPeriodInterval && retentionCookieName && (currentSessionLength < inactivityPeriod)) {
      sessionTimeTracker(true);
    }

    // Public methods
    return {
      init:init,
      getCookie: getCookie,
      saveSessionCookie: saveSessionCookie,
      isFunnelRetentionActive: isFunnelRetentionActive,
      retentionClickCheck: retentionClickCheck,
      displayExitMessage: displayExitMessage
    };
  });
