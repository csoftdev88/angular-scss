(function() {
  'use strict';

  angular
    .module('mobiusApp.services.user', [])
    .service('mobiusUserStrategy', MobiusUserStrategy);

  MobiusUserStrategy.$inject = ['$rootScope', '$q', '$window', 'userObject', 'apiService', '_', 'loyaltyService',
                                'cookieFactory', 'dataLayerService', 'Settings', '$timeout', 'stateService', '$log'];

  function MobiusUserStrategy($rootScope, $q, $window, userObject, apiService, _, loyaltyService, cookieFactory,
                              dataLayerService, rewardsService, Settings, $timeout, stateService, $log) {

    // Name of authentication header sent to the API
    var HEADER_INFINITI_SSO = 'mobius-authentication';

    // Promise is fullfiled when user logged in as mobius customer or anonymous
    var authPromise = $q.defer();

    // ViewModel
    var vm = this;

    // Cookie expiry time
    var expiryMins = Settings.API.sessionData.expiry || 15;
    var cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Run once on initialisation
    var init = function() {
      vm.loadProfile();
    };
    init();

    vm.getCustomerId = function() {
      return userObject.id || vm.getStoredUser().id;
    };

    vm.updateUser = function(data) {
      var customerId = vm.getCustomerId();

      if (customerId) {
        return apiService.put(
          apiService.getFullURL('customers.customer', {customerId: customerId}), data)
          .then(function() {
            userObject = _.extend(userObject, data);
          });
      } else {
        throw new Error('No user logged in');
      }
    };

    vm.storeUserId = function(id) {
      $window.document.cookie = 'MobiusId' + '=' + id + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
    };

    vm.getStoredUser = function() {
      return {
        id: cookieFactory('MobiusId'),
        token: cookieFactory('MobiusToken')
      };
    };

    function clearStoredUser() {
      $window.document.cookie = 'MobiusId' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'MobiusToken' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'CustomerID' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    vm.storeUserLanguage = function(lang) {
      $window.document.cookie = 'MobiusLanguageCode' + '=' + lang + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.languageCode = lang;
    };

    vm.getUserLanguage = function() {
      return cookieFactory('MobiusLanguageCode');
    };

    vm.storeUserCurrency = function(currency) {
      $window.document.cookie = 'MobiusCurrencyCode' + '=' + currency + '; expires=' + cookieExpiryDate.toUTCString() + '; path=/';
      userObject.currencyCode = currency;
    }

    vm.getUserCurrency = function() {
      return cookieFactory('MobiusCurrencyCode');
    };

    vm.loadProfile = function() {
      var customerId = vm.getCustomerId();

      //We need token to load mobius profile
      if(Settings.authType === 'mobius' && !(userObject.token || vm.getStoredUser().token)){
        // Logged in as anonymous
        if(authPromise){
          authPromise.resolve(false);
        }
        return;
      }

      if(customerId){
        // Setting up the headers for a future requests
        var headers = {};
        headers[HEADER_INFINITI_SSO] = userObject.token || vm.getStoredUser().token;
        apiService.setHeaders(headers);

        // Loading profile data and users loyelties
        return $q.all([
          apiService.get(apiService.getFullURL('customers.customer', {customerId: customerId})),
          vm.loadLoyalties(customerId), vm.loadRewards(customerId)
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
          userObject.languageCode = vm.getUserLanguage() || stateService.getAppLanguageCode();

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
    };

    vm.loadLoyalties = function(customerId) {

      if(!Settings.loyaltyProgramEnabled){
        return $q.when();
      }

      customerId = customerId || vm.getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        if(loyalties && loyalties.amount === undefined){
          loyalties.amount = 0;
        }

        userObject.loyalties = loyalties;

        return loyalties;
      });
    };

    vm.loadRewards = function(customerId) {

      if(!Settings.loyaltyProgramEnabled){
        return;
      }

      customerId = customerId || vm.getCustomerId();

      return rewardsService.getMy(customerId).then(function(rewards){
        userObject.rewards = rewards;

        return rewards;
      });
    };

    vm.getUser = function() {
      return userObject;
    };

    vm.getProfileUrl = function() {
      $log.warn('warn');
    };

    vm.openLogin = function() {
      $log.warn('warn');
    };

  }
}());
