'use strict';
/*
* This service for dataLayer/Google tag manager
*/
angular.module('mobiusApp.services.previousSearches', [])
.service('previousSearchesService',  function($window, Settings, sessionDataService, cookieFactory, $state) {

  function isPreviousSearchesActive(){
    return Settings.UI.previousSearches && Settings.UI.previousSearches.enable;
  }

  var cookieName = isPreviousSearchesActive() ? Settings.UI.previousSearches.cookieName : null;

  function getSearches(){
     var cookie = angular.fromJson(cookieFactory(cookieName)) || null;
     var searches = cookie ? cookie.searches : null;
     return searches;
  }

  function addSearch(searchParams){
    console.log('Add this search');
    console.log(searchParams);
    if(isPreviousSearchesActive()){
      var search = buildSearchObject(searchParams);

      if(search)
      {
        addSearchToCookie(search);
      }
    }
  }

  //Create your search object
  function buildSearchObject(searchParams){
    var search = null;
    if(sessionDataService.getCookie() && sessionDataService.getCookie().sessionData){
      search = correctParams(searchParams);
      search.state = $state.current.name;
      search.guid = sessionDataService.generateUUID(); //Specific GUID generated for each search that can be referenced for deletion
      search.sessionId = sessionDataService.getCookie().sessionData.sessionId; //Specific GUID for each session so that we can remove all searches from a session once booking is complete
    }
    return search;
  }

  //Add a search to the cookie
  function addSearchToCookie(search){
    var cookie = null;
    if(!cookieFactory(cookieName))
    {
      console.log('build new MobiusPreviousSearches cookie');
      cookie = {
        searches:[search]
      };
      generateSearchCookie(cookie);
    }
    else {
      console.log('add to existing MobiusPreviousSearches cookie');
      var previousSearches = getSearches();
      if(previousSearches && previousSearches.length){
        cookie = {
          searches:previousSearches
        };
        cookie.searches.push(search);
        generateSearchCookie(cookie);
      }
    }
  }

  //Remove any unnecessary params
  function correctParams(searchParams){
    var params = angular.copy(searchParams);
    params.rate = params.productGroupId;
    delete params.include;
    delete params.productGroupId;
    return params;
  }

  //Remove a specific search from the cookie
  function removeSearch(){

  }

  //Remove all searches related to a specific session
  function removeSessionSearches(){

  }

  /*//Check all previous searches and remove any that are in the past
  function removePastSearches(){

  }*/

  //Generate the cookie to store searches in
  function generateSearchCookie(cookie){
    var cookieExpiryDate = null;
    if(Settings.UI.user.userPreferencesCookieExpiryDays && Settings.UI.user.userPreferencesCookieExpiryDays !== 0){
      cookieExpiryDate = new Date();
      cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.user.userPreferencesCookieExpiryDays);
    }
    $window.document.cookie = cookieName + '=' + angular.toJson(cookie) + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
  }

  // Public methods
  return {
    getSearches:getSearches,
    addSearch:addSearch,
    removeSearch:removeSearch,
    removeSessionSearches: removeSessionSearches
  };
});
