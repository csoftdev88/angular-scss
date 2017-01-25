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
      if(filteredSearches.length){
        var cookie = getSearchDataCookie();
        if(cookie){
          cookie.searches = filteredSearches;
          saveSearchDataCookie(cookie);
        }
      }
      else {
        //Delete searchDataCookie as it is now empty
        $window.document.cookie = searchDataCookieName+ '=' + 'clear' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
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
      var cookieExpiryDate = null;
      if (Settings.UI.previousSearches.cookieExpiryDays && Settings.UI.previousSearches.cookieExpiryDays !== 0) {
        cookieExpiryDate = new Date();
        cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.previousSearches.cookieExpiryDays);
        saveCookie(searchDataCookieName, cookie, cookieExpiryDate);
      }
    }

    function saveSearchDisplayCookie(){
      if(searchDisplayCookieName) {
        var cookie = {
          display:true
        };
        saveCookie(searchDisplayCookieName, cookie);
      }
    }

    function saveCookie(cookieName, cookie, cookieExpiryDate){
      var expiry = cookieExpiryDate ? cookieExpiryDate.toUTCString() : '';
      $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + expiry + '; path=/';
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

    var searchDataCookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDataCookieName : null;
    var searchDisplayCookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.searchDisplayCookieName : null;
    var maxSearches = isPreviousSearchesActive() ? Settings.UI.previousSearches.maxSearches : null;

    // Public methods
    return {
      isPreviousSearchesActive: isPreviousSearchesActive,
      getSearches: getSearches,
      addSearch: addSearch,
      displaySearches: displaySearches,
      removeSearch: removeSearch,
      removeSessionSearches: removeSessionSearches
    };
  });
