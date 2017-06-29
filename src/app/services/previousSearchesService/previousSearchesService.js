'use strict';
/*
 * This service is for tracking previous searches
 */
angular.module('mobiusApp.services.previousSearches', [])
  .service('previousSearchesService', function($window, Settings, sessionDataService,
                                               cookieFactory, $state, modalService,
                                               propertyService, locationService, $q, _) {

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
        removeInvalidSearches();
        var cookie = getSearchDataCookie();
        var searches = cookie ? cookie.searches : null;
        return searches;
      }
      else {
        return false;
      }
    }

    function addSearch(stateName, searchParams, searchName, propertyCode, locationCode, roomCode) {
      if (isPreviousSearchesActive()) {

        //Prevent modal from displaying in this session
        saveSearchDisplayCookie();

        //Save cookie to denote that user has searched in current session
        saveSearchInSessionCookie();

        var search = buildSearchObject(stateName, searchParams, searchName, propertyCode, locationCode, roomCode);
        if (search) {
          addSearchToCookie(search);
        }
      }
    }

    //Create your search object
    function buildSearchObject(stateName, searchParams, searchName, propertyCode, locationCode, roomCode) {
      var search = null;
      if (sessionDataService.getCookie() && sessionDataService.getCookie().sessionData) {
        search = {};
        search.s = stateName;
        search.n = searchName ? searchName : 'All hotels';
        search.id = sessionDataService.generateUUID(); //Specific GUID generated for each search that can be referenced for deletion
        search.sid = sessionDataService.getCookie().sessionData.sessionId; //Specific GUID for each session so that we can remove all searches from a session once booking is complete
        search.p = buildSearchParamStore(searchParams);
        search.p.r = roomCode ? roomCode : undefined;
        if(propertyCode){
          search.p.p = propertyCode;
        }
        else if(locationCode){
          search.p.l = locationCode;
        }
      }
      return search;
    }

    function buildSearchParamStore(searchParams){
      var params = {};
      params.a = searchParams.adults ? searchParams.adults : undefined;
      params.c = searchParams.children ? searchParams.children : undefined;
      params.d = searchParams.dates ? searchParams.dates : undefined;
      params.ra = searchParams.rate ? searchParams.rate : undefined; //The selected rate filter / productGroupId
      params.pc = searchParams.promoCode ? searchParams.promoCode : undefined;
      params.gc = searchParams.groupCode ? searchParams.groupCode : undefined;
      params.cc = searchParams.corpCode ? searchParams.corpCode : undefined;
      return params;
    }

    function buildSearchUrlParams(searchParams, propertySlug, locationSlug, regionSlug){
      var params = {};
      params.adults = searchParams.a ? searchParams.a : undefined;
      params.children = searchParams.c ? searchParams.c : undefined;
      params.dates = searchParams.d ? searchParams.d : undefined;
      params.property = null;
      params.roomSlug = searchParams.r ? searchParams.r : undefined;
      params.propertySlug = propertySlug ? propertySlug : undefined;
      params.locationSlug = locationSlug ? locationSlug : undefined;
      params.regionSlug = regionSlug ? regionSlug : undefined;
      params.scrollTo = undefined;
      params.fromSearch = undefined;
      return params;
    }

    //Retrieves all required parameters to form a search URL
    function getSearchUrlParams(search){
      var q = $q.defer();
      if(search.p){
        if(search.p.r && search.p.p){
          propertyService.getRoomDetails(search.p.p, search.p.r).then(function(room){
            propertyService.getPropertyDetails(search.p.p).then(function(property){
              propertyService.getPropertyRegionData(property.locationCode).then(function(data){
                var params = buildSearchUrlParams(search.p, property.meta.slug, data.location.meta.slug, data.region.meta.slug, room.meta.slug);
                q.resolve(params);
              }, function(error){
                q.reject(error);
              });
            });
          });
        }
        else if(search.p.p){
          propertyService.getPropertyDetails(search.p.p).then(function(property){
            propertyService.getPropertyRegionData(property.locationCode).then(function(data){
              var params = buildSearchUrlParams(search.p, property.meta.slug, data.location.meta.slug, data.region.meta.slug);
              q.resolve(params);
            }, function(error){
              q.reject(error);
            });
          });
        }
        else if(search.p.l){
          propertyService.getPropertyRegionData(search.p.l).then(function(data){
            var params = buildSearchUrlParams(search.p, null, data.location.meta.slug, data.region.meta.slug);
            q.resolve(params);
          }, function(error){
            q.reject(error);
          });
        }
      }
      return q.promise;
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
          var searchExists = false;
          //Check through each previous search to see if any of them match the new search
          _.each(previousSearches, function (previousSearch) {
            //If the search state doesn't matche the previous search state
            if (search.s !== previousSearch.s) {
              return;
            }
            //If the new search has parameters
            if (search.p) {
              //If search location code doesn't match the previous search
              if (search.p.l !== previousSearch.p.l) {
                return;
              }
              //If search property code doesn't match the previous search
              if (search.p.p !== previousSearch.p.p) {
                return;
              }
              //If search room code doesn't match the previous search
              if (search.p.r !== previousSearch.p.r) {
                return;
              }
              //If search adults doesn't match the previous search
              if (search.p.a !== previousSearch.p.a) {
                return;
              }
              //If search children doesn't match the previous search
              if (search.p.c !== previousSearch.p.c) {
                return;
              }
              //If search dates doesn't match the previous search
              if (search.p.d !== previousSearch.p.d) {
                return;
              }
            }
            searchExists = true;
          });

          //If the new search does not already exist
          if (!searchExists) {
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
    }

    //Remove a specific search from the cookie
    function removeSearch(search) {
      var previousSearches = getSearches();
      var filteredSearches = _.reject(previousSearches, function(savedSearch) {
        return savedSearch.id === search.id && !search.display;
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
        var currentSessionId = sessionDataService.getCookie().sessionData.sid;
        var previousSearches = getSearches();
        var changedCookie = false;
        if (previousSearches && previousSearches.length) {
          var filteredPreviousSearches = _.reject(previousSearches, function(search) {
            if(search.sid === currentSessionId){
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

    function hasPropertyName(search) {
      if (search.n) {
        return !(/^\s*-/.test(search.n));
      }
      return false;
    }

    function datesInPast(search) {
      if (search.p && search.p.d) {
        var today = $window.moment().format('YYYY-MM-DD');
        var datesArray = search.p.d.split('_');
        if (datesArray.length) {
          var from = datesArray[0];
          var to = datesArray[1];
          // Checking that the dates aren't in the past
          if ($window.moment(from).isBefore(today, 'day') || $window.moment(to).isBefore(today, 'day')) {
            return true;
          }
          return false;
        }
      }
    }

    //Check all previous searches and remove any that are in the past
    function removeInvalidSearches() {
      var changedCookie = false;
      var cookie = getSearchDataCookie();
      var previousSearches = cookie ? cookie.searches : null;
      if (previousSearches && previousSearches.length) {
        var filteredPreviousSearches = _.reject(previousSearches, function(search) {

          var invalidSearch = false;
          if (!hasPropertyName(search) || datesInPast(search)) {
            invalidSearch = true;
            changedCookie = true;
          }
          return invalidSearch;
        });
        if (changedCookie){
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
      //If expiry defined create a cookie with expiry
      if(expiry){
        $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + expiry + '; path=/';
      }
      //Otherwise create a session cookie (no expiry)
      else {
        $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; path=/';
      }
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
            /*var searchPromises = [];
            _.each(previousSearches, function(search){
              ///Generate the search url
              searchPromises.push(getSearchUrlParams(search).then(function(params){
                search.params = params;
              }));
            });
            $q.all(searchPromises).then(function () {
              modalService.openPreviousSearchesDialog(previousSearches, removeSearch);
            });*/
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
      hasSearchedInSession: hasSearchedInSession,
      getSearchUrlParams: getSearchUrlParams
    };
  });
