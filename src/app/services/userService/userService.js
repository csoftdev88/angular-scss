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

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;

    cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function hasSSOCookies(){
      //console.log('hasSSOCookies: ' + cookieFactory(KEY_CUSTOMER_PROFILE));
      return Settings.authType === 'mobius' ? true : !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
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
      $window.document.cookie = 'MobiusId' + '=' + id + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
    }

    function getStoredUser() {
      var data = {
        id: cookieFactory('MobiusId'),
        token: cookieFactory('MobiusToken')
      };
      return data;
    }

    function clearStoredUser() {
      $window.document.cookie = 'MobiusId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'MobiusToken' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'CustomerID' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    function storeUserLanguage(lang) {
      $window.document.cookie = 'MobiusLanguageCode' + '=' + lang + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.languageCode = lang;
    }

    function getUserLanguage() {
      return cookieFactory('MobiusLanguageCode');
    }

    function storeUserCurrency(currency) {
      $window.document.cookie = 'MobiusCurrencyCode' + '=' + currency + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.currencyCode = currency;
    }

    function getUserCurrency() {
      return cookieFactory('MobiusCurrencyCode');
    }

    function loadProfile() {
      var customerId = getCustomerId();

      //We need token to load mobius profile
      if(Settings.authType === 'mobius' && !(userObject.token || getStoredUser().token)){
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

        if (Settings.authType === 'mobius') {
          return apiService.get(
            apiService.getFullURL('customers.customer',
              { customerId: customerId }), {}, false
          ).then(function(userData) {
            // NOTE: data[0] is userProfile data
            // data[1] is loyalties data - handled in loadLoyalties function
            if(userData && _.isArray(userData.email) &&  userData.email.length){
              // Multiple email are not needed - we picking the first one
              userData.email =  userData.email[0].value;
              // Updating user details in data layer
              dataLayerService.setUserId(customerId);
            }

            userObject = angular.extend(userObject, userData);
            //userObject = _.extend(userObject, userData);
            userObject.avatarUrl = userObject.avatar && userObject.avatarUrl ? userObject.avatarUrl : '/static/images/v4/img-profile.png';
            userObject.languageCode = getUserLanguage() || stateService.getAppLanguageCode();
            console.log('successfully gotten the user', userObject);
            return $q.all([
              loadLoyalties(customerId),
              loadRewards(customerId)
            ]).then(function () {

              $timeout(function(){
                $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
              });
              if(authPromise && authPromise.resolve){
                authPromise.resolve(true);
              }
            });
          }, function(){
            clearStoredUser();
          });
        }

        // Loading profile data and users loyalties
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
          userObject.avatarUrl = userObject.avatar && userObject.avatarUrl ? userObject.avatarUrl : '/static/images/v4/img-profile.png';
          userObject.languageCode = getUserLanguage() || stateService.getAppLanguageCode();

          // Logged in as mobius user
          if(Settings.authType === 'mobius'){
            $timeout(function(){
              $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
            });
          }


          if(authPromise && authPromise.resolve){
            authPromise.resolve(true);
          }

        }, function(){
          if(Settings.authType === 'mobius'){
            clearStoredUser();
          }
        });
      } else {
        //If for whatever reason we do not have a customerId, clear the stored user and reject the auth
        clearStoredUser();
        return $q.reject({});
      }
    }

    function loadLoyalties(customerId){

      if(!Settings.loyaltyProgramEnabled){
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

      if(!Settings.loyaltyProgramEnabled){
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
        $state.go('home', {}, {reload: true});

      });
      // Removing auth headers
      var headers = {};
      headers[HEADER_INFINITI_SSO] = undefined;
      apiService.setHeaders(headers);
      clearStoredUser();

      authPromise = $q.defer();

      if(Settings.authType === 'mobius'){
        $timeout(function(){
          $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
        });
      }
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

    function getUser () {
      return userObject;
    }

    if(Settings.authType === 'infiniti'){
      initSSOListeners();
    }
    else{
      loadProfile();
    }

    return {
      getUser: getUser,
      loadProfile: loadProfile,
      getCustomerId: getCustomerId,
      loadLoyalties: loadLoyalties,
      loadRewards: loadRewards,
      updateUser: updateUser,
      authPromise: authPromise.promise,
      storeUserLanguage: storeUserLanguage,
      getUserLanguage: getUserLanguage,
      storeUserId: storeUserId,
      getStoredUser: getStoredUser,
      clearStoredUser: clearStoredUser,
      storeUserCurrency: storeUserCurrency,
      getUserCurrency: getUserCurrency
    };
  });
