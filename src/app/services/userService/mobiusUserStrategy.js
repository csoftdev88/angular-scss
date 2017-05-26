'use strict';

angular
  .module('mobiusApp.services.user', [])
  .service('mobiusUserStrategy', function($rootScope, $q, $window, $state, userObject, apiService, _, loyaltyService, cookieFactory,
                            dataLayerService, rewardsService, Settings, $timeout, stateService) {

    var HEADER_INFINITI_SSO = 'mobius-authentication';

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;

    cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function getCustomerId() {
      return userObject.id || getStoredUser().id;
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
      return {
        id: cookieFactory('MobiusId'),
        token: cookieFactory('MobiusToken')
      };
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
        headers[HEADER_INFINITI_SSO] = userObject.token || getStoredUser().token;
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
          userObject.avatarUrl = userObject.avatar && userObject.avatarUrl ? userObject.avatarUrl : '/static/images/v4/img-profile.png';
          userObject.languageCode = getUserLanguage() || stateService.getAppLanguageCode();

          $timeout(function(){
            $rootScope.$broadcast('MOBIUS_USER_LOGIN_EVENT');
          });

          if(authPromise && authPromise.resolve){
            authPromise.resolve(true);
          }

        }, function(){
          clearStoredUser();
        });
      } else {
        //If for whatever reason we do not have a customerId, clear the stored user and reject the auth
        clearStoredUser();
        return $q.reject({});
      }
    }

    function loadLoyalties(customerId){

      if(!Settings.loyaltyProgramEnabled){
        return $q.when();
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

    function getUser () {
      return userObject;
    }

    loadProfile();

    return {
      getProfileUrl: function() {
        console.warn('warn');
      },
      openLogin: function() {
        console.warn('warn');
      },
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
