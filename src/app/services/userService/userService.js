'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function($rootScope, $q, $window, $state,
    userObject, apiService, _, loyaltyService, cookieFactory, dataLayerService, rewardsService, Settings, $timeout, stateService) {

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = Settings.authType === 'mobius' ? 'mobius-authentication' : 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = Settings.authType === 'mobius' ? 'mobius-authentication' : 'infinitiAuthN';

    var EVENT_CUSTOMER_LOADED = 'infiniti.customer.loaded';
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';
    // TODO Implement this with AuthCtrl
    var EVENT_ANONYMOUS_LOADED = 'infiniti.anonymous.loaded';

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function hasSSOCookies(){
      return Settings.authType === 'mobius' ? true : !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function isProfileLoaded(){
      // NOTE: Email data is loaded via customers API
      return !!(userObject.id && userObject.email);
    }

    function getCustomerId(){
      if(!hasSSOCookies()){
        return null;
      }

      if(Settings.authType === 'mobius'){
        return userObject.id || getStoredUser().id;
      }
      else{
        return userObject.id || cookieFactory(KEY_CUSTOMER_ID);
      }
      
    }

    function updateUser(data) {
      var customerId = getCustomerId();

      if (customerId) {
        return apiService.put(
          apiService.getFullURL('customers.customer', {customerId: customerId}), data)
        .then(function() {
          userObject = _.extend(userObject, data);
        });
      } else {
        throw new Error('No user logged in');
      }
    }

    function storeUserId(id) {
      localStorage.mobiusId = id;
    }

    function getStoredUser() {
      var data = {
        id: localStorage.mobiusId,
        token: localStorage.mobiusToken
      };
      return data;
    }

    function clearStoredUser() {
      localStorage.removeItem('mobiusId');
      localStorage.removeItem('mobiusToken');
      console.log(localStorage.mobiusToken);
    }

    function storeUserLanguage(lang) {
      localStorage.mobiusLanguagecode = lang;
      userObject.languageCode = lang;
    }

    function getUserLanguage() {
      return localStorage.mobiusLanguagecode;
    }

    function loadProfile() {

      console.log('loadProfile');

      var customerId = getCustomerId();

      //We need token to load mobius profile
      if(Settings.authType === 'mobius' && (!userObject.token || !getStoredUser().token)){
        // Logged in as anonymous
        if(authPromise){
          authPromise.resolve(false);
        }
        return;
      }

      if(customerId){
        // Setting up the headers for a future requests
        var headers = {};
        headers[HEADER_INFINITI_SSO] = Settings.authType === 'mobius' ? userObject.token || getStoredUser().token : cookieFactory(KEY_CUSTOMER_PROFILE);
        apiService.setHeaders(headers);

        // Loading profile data and users loyelties
        return $q.all([
          apiService.get(apiService.getFullURL('customers.customer', {customerId: customerId})),
          loadLoyalties(customerId), loadRewards(customerId)
        ]).then(function(data){
          var userData = data[0];

          // NOTE: data[0] is userProfile data
          // data[1] is loyalties data - handled in loadLoyalties function
          if(userData && _.isArray(userData.email) &&  userData.email.length){
            // Multiple email are not needed - we picking the first one
            userData.email =  userData.email[0].value;
            // Updating user details in data layer
            dataLayerService.setUserId(customerId);
          }

          userObject = _.extend(userObject, userData);
          userObject.avatarUrl = userObject.avatarUrl || '/static/images/v4/img-profile.png';
          userObject.languageCode = getUserLanguage() || stateService.getAppLanguageCode();

          $timeout(function(){
            $rootScope.$broadcast('USER_LOGIN_EVENT');
          });

          // Logged in as mobius user
          if(authPromise){
            authPromise.resolve(true);
          }
        }, function(){
          if(Settings.authType === 'mobius'){
            clearStoredUser();
          }
        });
      } else {
        return $q.reject({});
      }
    }

    function loadLoyalties(customerId){

      if(Settings.authType !== 'infiniti'){
        return;
      }

      customerId = customerId || getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        if(loyalties && loyalties.amount === undefined){
          loyalties.amount = 0;
        }

        userObject.loyalties = loyalties;

        return loyalties;
      });
    }

    function loadRewards(customerId){

      if(Settings.authType !== 'infiniti'){
        return;
      }
      
      customerId = customerId || getCustomerId();

      return rewardsService.getMy(customerId).then(function(rewards){
        userObject.rewards = rewards;

        return rewards;
      });
    }

    function logout() {
      $rootScope.$evalAsync(function(){
        userObject = {};
        $state.go('home');
      });
      // Removing auth headers
      var headers = {};
      headers[HEADER_INFINITI_SSO] = undefined;
      apiService.setHeaders(headers);

      clearStoredUser();

      authPromise = $q.defer().promise;

      $timeout(function(){
        $rootScope.$broadcast('USER_LOGIN_EVENT');
      });
    }

    function initSSOListeners(){
      // SSO event listeners
      $window.addEventListener(
        EVENT_CUSTOMER_LOADED,
      function(){
        loadProfile();
      });

      $window.addEventListener(
        EVENT_CUSTOMER_LOGGED_OUT,
      function(){
        logout();
      });

      $window.addEventListener(
        EVENT_ANONYMOUS_LOADED,
      function(){
        // Logged in as anonymous
        if(authPromise){
          authPromise.resolve(false);
        }
      });
    }

    initSSOListeners();

    return {
      isLoggedIn: function() {
        return hasSSOCookies() && isProfileLoaded();
      },

      getUser: function() {
        return userObject;
      },

      // NOTE: Will keep this function public for now.
      loadProfile: loadProfile,
      getCustomerId: getCustomerId,
      loadLoyalties: loadLoyalties,
      loadRewards: loadRewards,
      updateUser: updateUser,
      logout: logout,
      authPromise: authPromise.promise,
      storeUserId: storeUserId,
      getStoredUser: getStoredUser,
      clearStoredUser: clearStoredUser,
      storeUserLanguage: storeUserLanguage,
      getUserLanguage: getUserLanguage
    };
  });

