'use strict';
/*
 * This service is for tracking previous searches
 */
angular.module('mobiusApp.services.previousSearches', [])
  .service('previousSearchesService', function($window, Settings, sessionDataService, cookieFactory, $state, modalService, _) {

    function isPreviousSearchesActive() {
      return Settings.UI.previousSearches && Settings.UI.previousSearches.enable;
    }

    function getCookie(cookieName){
      return angular.fromJson(cookieFactory(cookieName)) || null;
    }

    function getSearchDataCookie(){
      return getCookie(searchDataCookieName);
    }

    function getSearches() {
      if(isPreviousSearchesActive()){
        removePastSearches();
        var cookie = getSearchDataCookie();
        var searches = cookie ? cookie.searches : null;
        return searches;
      }
      else {
        return false;
      }
    }

    function addSearch(searchParams, searchName) {
      if (isPreviousSearchesActive()) {

        //Prevent modal from displaying in this session
        saveSearchDisplayCookie();

        //Save cookie to denote that user has searched in current session
        saveSearchInSessionCookie();

        var search = buildSearchObject(searchParams, searchName);
        if (search) {
          addSearchToCookie(search);
        }
      }
    }

    //Create your search object
    function buildSearchObject(searchParams, searchName) {
      var search = null;
      if (sessionDataService.getCookie() && sessionDataService.getCookie().sessionData) {
        search = {};
        search.params = angular.copy(searchParams);
        search.state = $state.current.name;
        search.name = searchName ? searchName : 'All hotels';
        search.guid = sessionDataService.generateUUID(); //Specific GUID generated for each search that can be referenced for deletion
        search.sessionId = sessionDataService.getCookie().sessionData.sessionId; //Specific GUID for each session so that we can remove all searches from a session once booking is complete
      }
      return search;
    }

    //Add a search to the cookie
    function addSearchToCookie(search) {
      var cookie = getSearchDataCookie();

      //If cookie doesn't exist create one
      if (!cookie) {
        saveSearchDataCookie({'searches':[search]});
      }

      //Otherwise add to our existing cookie
      else {
        var previousSearches = getSearches();
        if (previousSearches && previousSearches.length) {
          //If we have reached the maximum amount of searches, remove the oldest result before adding a new one
          if (maxSearches && previousSearches.length >= maxSearches) {
            previousSearches.shift();
          }
          cookie.searches = previousSearches;
          cookie.searches.push(search);
          saveSearchDataCookie(cookie);
        }
      }
    }

    //Remove a specific search from the cookie
    function removeSearch(search) {
      var previousSearches = getSearches();
      var filteredSearches = _.reject(previousSearches, function(savedSearch) {
        return savedSearch.guid === search.guid && !search.display;
      });
      var cookie = getSearchDataCookie();
      if(cookie){
        if(filteredSearches.length){      
          cookie.searches = filteredSearches;
          saveSearchDataCookie(cookie);
        }
        else {
          cookie.searches = [];
          saveSearchDataCookie(cookie);
        }
      }
    }

    //Remove all searches related to a specific session
    function removeSessionSearches() {
      if (isPreviousSearchesActive() && sessionDataService.getCookie() && sessionDataService.getCookie().sessionData) {
        var currentSessionId = sessionDataService.getCookie().sessionData.sessionId;
        var previousSearches = getSearches();
        var changedCookie = false;
        if (previousSearches && previousSearches.length) {
          var filteredPreviousSearches = _.reject(previousSearches, function(search) {
            if(search.sessionId === currentSessionId){
              changedCookie = true;
              return true;
            }
            else {
              return false;
            }
          });
          if(changedCookie){
            var cookie = getSearchDataCookie();
            cookie.searches = filteredPreviousSearches;
            saveSearchDataCookie(cookie);
          }
        }
      }
    }

    //Check all previous searches and remove any that are in the past
    function removePastSearches() {
      var changedCookie = false;
      var cookie = getSearchDataCookie();
      var previousSearches = cookie ? cookie.searches : null;
      if (previousSearches && previousSearches.length) {
        var today = $window.moment().format('YYYY-MM-DD');
        var filteredPreviousSearches = _.reject(previousSearches, function(search) {
          if(search.params && search.params.dates){
            var datesArray = search.params.dates.split('_');
            if(datesArray.length){
              var from = datesArray[0];
              var to = datesArray[1];
              if($window.moment(from).isBefore(today, 'day') || $window.moment(to).isBefore(today, 'day')){
                changedCookie = true;
                return true;
              }
              else {
                return false;
              }
            }
          }
        });
        if(changedCookie){
          cookie.searches = filteredPreviousSearches;
          saveSearchDataCookie(cookie);
        }
      }
    }

    //Generate the cookie to store searches in
    function saveSearchDataCookie(cookie) {
      //If we have searches, save the cookie
      if(cookie.searches.length && cookie.searches.length > 0){
        if (searchDataCookieExpiry && searchDataCookieExpiry !== 0) {
          var cookieExpiryDate = null;
          cookieExpiryDate = new Date();
          cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (searchDataCookieExpiry * 60 * 1000));
          saveCookie(searchDataCookieName, cookie, cookieExpiryDate);
        }
      }
      //If we don't have searches, delete the cookie
      else {
        deleteCookie(searchDataCookieName);
      }
    }

    function saveSearchDisplayCookie(){
      var cookie = {
        display:true
      };
      var cookieExpiryDate = null;
      if (searchDisplayCookieExpiry && searchDisplayCookieExpiry !== 0) {
        cookieExpiryDate = new Date();
        cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (searchDisplayCookieExpiry * 60 * 1000));
      }
      saveCookie(searchDisplayCookieName, cookie, cookieExpiryDate);
    }

    function saveSearchInSessionCookie(){
      var cookie = {
        searched:true
      };
      var cookieExpiryDate = null;
      if (searchInSessionCookieExpiry && searchInSessionCookieExpiry !== 0) {
        cookieExpiryDate = new Date();
        cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (searchInSessionCookieExpiry * 60 * 1000));
      }
      saveCookie(searchInSessionCookieName, cookie, cookieExpiryDate);
    }

    function saveCookie(cookieName, cookie, cookieExpiryDate){
      var expiry = cookieExpiryDate ? cookieExpiryDate.toUTCString() : '';
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + expiry + '; path=/';
    }

    function deleteCookie(cookieName){
      $window.document.cookie = cookieName + '=' + 'clear' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    //Display searches in the front-end of the app
    function displaySearches(){
      if(isPreviousSearchesActive()){
        if(!getCookie(searchDisplayCookieName)){
          var previousSearches = getSearches();
          if(previousSearches && previousSearches.length){
            saveSearchDisplayCookie();
            modalService.openPreviousSearchesDialog(previousSearches, removeSearch);
          }
        }
      }
    }

    function hasSearchedInSession(){
      if(getCookie(searchInSessionCookieName)){
        return true;
      }
      else {
        return false;
      }
    }

    var searchDataCookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDataCookieName : null;
    var searchDataCookieExpiry = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDataCookieExpiry: null;
    var searchDisplayCookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDisplayCookieName : null;
    var searchDisplayCookieExpiry = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDisplayCookieExpiry: null;
    var searchInSessionCookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchInSessionCookieName: null;
    var searchInSessionCookieExpiry = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchInSessionCookieExpiry: null;
    var maxSearches = isPreviousSearchesActive() ? Settings.UI.previousSearches.maxSearches : null;

    // Public methods
    return {
      isPreviousSearchesActive: isPreviousSearchesActive,
      getSearches: getSearches,
      addSearch: addSearch,
      displaySearches: displaySearches,
      removeSearch: removeSearch,
      removeSessionSearches: removeSessionSearches,
      hasSearchedInSession: hasSearchedInSession
    };
  });
