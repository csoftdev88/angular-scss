'use strict';
/*
 * This service for dataLayer/Google tag manager
 */
angular.module('mobiusApp.services.previousSearches', [])
  .service('previousSearchesService', function($window, Settings, sessionDataService, cookieFactory, $state, _) {

    function isPreviousSearchesActive() {
      return Settings.UI.previousSearches && Settings.UI.previousSearches.enable;
    }

    function getSearches() {
      removePastSearches();
      var cookie = angular.fromJson(cookieFactory(cookieName)) || null;
      var searches = cookie ? cookie.searches : null;
      return searches;
    }

    function addSearch(searchParams) {
      if (isPreviousSearchesActive()) {
        //If there are no region or loation slug data, do not add a search
        if(($state.current.name === 'hotel' || $state.current.name === 'room') && (!$state.params.regionSlug || !$state.params.locationSlug)){
          return;
        }
        var search = buildSearchObject(searchParams);
        if (search) {
          addSearchToCookie(search);
        }
      }
    }

    //Create your search object
    function buildSearchObject(searchParams) {
      var search = null;
      if (sessionDataService.getCookie() && sessionDataService.getCookie().sessionData) {
        search = {};
        search.params = angular.copy(searchParams);
        search.state = $state.current.name;
        search.guid = sessionDataService.generateUUID(); //Specific GUID generated for each search that can be referenced for deletion
        search.sessionId = sessionDataService.getCookie().sessionData.sessionId; //Specific GUID for each session so that we can remove all searches from a session once booking is complete
      }
      console.log('search object');
      console.log(search);
      return search;
    }

    //Add a search to the cookie
    function addSearchToCookie(search) {
      var cookie = null;

      //If cookie doesn't exist create one
      if (!cookieFactory(cookieName)) {
        cookie = {
          searches: [search]
        };
        generateSearchCookie(cookie);
      }

      //Otherwise add to our existing cookie
      else {
        var previousSearches = getSearches();
        if (previousSearches && previousSearches.length) {
          //If we have reached the maximum amount of searches, remove the oldest result before adding a new one
          if (maxSearches && previousSearches.length >= maxSearches) {
            previousSearches.shift();
          }
          cookie = {
            searches: previousSearches
          };
          cookie.searches.push(search);
          generateSearchCookie(cookie);
        }
      }
    }

    //Remove a specific search from the cookie
    function removeSearch() {

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
            var cookie = {
              searches: filteredPreviousSearches
            };
            generateSearchCookie(cookie);
          }
        }
      }
    }

    //Check all previous searches and remove any that are in the past
    function removePastSearches() {
      var changedCookie = false;
      var cookie = angular.fromJson(cookieFactory(cookieName)) || null;
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
          cookie = {
            searches: filteredPreviousSearches
          };
          generateSearchCookie(cookie);
        }
      }
    }

    //Generate the cookie to store searches in
    function generateSearchCookie(cookie) {
      console.log('new cookie obj');
      console.log(cookie);
      var cookieExpiryDate = null;
      if (Settings.UI.user.userPreferencesCookieExpiryDays && Settings.UI.user.userPreferencesCookieExpiryDays !== 0) {
        cookieExpiryDate = new Date();
        cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.user.userPreferencesCookieExpiryDays);
        $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      }
    }

    var cookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.cookieName : null;
    var maxSearches = isPreviousSearchesActive() ? Settings.UI.previousSearches.maxSearches : null;

    // Public methods
    return {
      getSearches: getSearches,
      addSearch: addSearch,
      removeSearch: removeSearch,
      removeSessionSearches: removeSessionSearches
    };
  });
