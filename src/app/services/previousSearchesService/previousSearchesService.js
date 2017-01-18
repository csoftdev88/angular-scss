'use strict';
/*
 * This service for dataLayer/Google tag manager
 */
angular.module('mobiusApp.services.previousSearches', [])
  .service('previousSearchesService', function($window, Settings, sessionDataService, cookieFactory, $state, $stateParams, _) {

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
        search = correctParams(searchParams);
        search.state = $state.current.name;
        search.locationSlug = $state.params.locationSlug;
        search.regionSlug = $state.params.locationSlug;
        search.state = $state.current.name;
        search.guid = sessionDataService.generateUUID(); //Specific GUID generated for each search that can be referenced for deletion
        search.sessionId = sessionDataService.getCookie().sessionData.sessionId; //Specific GUID for each session so that we can remove all searches from a session once booking is complete
      }
      return search;
    }

    //Add a search to the cookie
    function addSearchToCookie(search) {
      console.log('add this search');
      console.log(search);
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

    //Remove any unnecessary params
    function correctParams(searchParams) {
      var params = angular.copy(searchParams);
      params.rate = params.productGroupId;
      delete params.include;
      delete params.productGroupId;
      return params;
    }

    //Remove a specific search from the cookie
    function removeSearch() {

    }

    //Remove all searches related to a specific session
    function removeSessionSearches() {
      if (isPreviousSearchesActive() && sessionDataService.getCookie() && sessionDataService.getCookie().sessionData) {
        var currentSessionId = sessionDataService.getCookie().sessionData.sessionId;
        var previousSearches = getSearches();
        if (previousSearches && previousSearches.length) {
          var filteredPreviousSearches = _.reject(previousSearches, function(search) {
            return search.sessionId === currentSessionId;
          });
          var cookie = {
            searches: filteredPreviousSearches
          };
          generateSearchCookie(cookie);
        }
      }
    }

    //Check all previous searches and remove any that are in the past
    function removePastSearches() {
      var cookie = angular.fromJson(cookieFactory(cookieName)) || null;
      var previousSearches = cookie ? cookie.searches : null;
      if (previousSearches && previousSearches.length) {
        var today = $window.moment().format('YYYY-MM-DD');
        var filteredPreviousSearches = _.reject(previousSearches, function(search) {
          return $window.moment(search.from).isBefore(today, 'day') || $window.moment(search.to).isBefore(today, 'day');
        });
        cookie = {
          searches: filteredPreviousSearches
        };
        generateSearchCookie(cookie);
      }
    }

    //Generate the cookie to store searches in
    function generateSearchCookie(cookie) {
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
