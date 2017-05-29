(function() {
  'use strict';

  /**
   * Infiniti user strategy, this strategy interacts with the infiniti API ($window.infiniti.api) loaded
   * using the infinitiScript directive. This strategy should NEVER be injected directly, but instead use
   * it's context, the userService and ensure the auth type is set to infiniti.
   *
   * @see infinitiScript
   * @see userService
   * @author Bryan Kneis
   */
  angular
    .module('mobiusApp.services.infinitiUserStrategy', [])
    .service('infinitiUserStrategy', InfinitiUserStrategy);

  function InfinitiUserStrategy($rootScope, $q, $window, $state, userObject, apiService, _, loyaltyService,
                                cookieFactory, dataLayerService, rewardsService, Settings, stateService, $log) {

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = 'infinitiAuthN';

    var EVENT_CUSTOMER_LOADED = 'infiniti.customer.loaded';
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';

    // TODO Implement this with AuthCtrl
    var EVENT_ANONYMOUS_LOADED = 'infiniti.anonymous.loaded';

    var cookieExpiryDate = null;
    var expiryMins = Settings.API.sessionData.expiry || 15;

    cookieExpiryDate = new Date();
    cookieExpiryDate.setTime(cookieExpiryDate.getTime() + (expiryMins * 60 * 1000));

    // Promise is fullfiled when user logged in as mobius customer or anonymous
    var authPromise = $q.defer();

    var vm = this;

    var init = function() {
      initSSOListeners();
    };
    init();

    function hasSSOCookies(){
      return !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function initSSOListeners(){
      // SSO event listeners
      $window.addEventListener(
        EVENT_CUSTOMER_LOADED,
        function(){
          vm.loadProfile();
        });

      $window.addEventListener(
        EVENT_CUSTOMER_LOGGED_OUT,
        function(){
          vm.logout();
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

    function clearStoredUser() {
      var expireTokenString = ' expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
      $window.document.cookie = 'MobiusId =;' + expireTokenString;
      $window.document.cookie = 'MobiusToken =;' + expireTokenString;
      $window.document.cookie = 'CustomerID =;' + expireTokenString;
    }

    vm.getCustomerId = function() {
      if (!hasSSOCookies()) {
        return null;
      }
      return userObject.id || cookieFactory(KEY_CUSTOMER_ID);
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

    vm.updateUser = function(data) {
      var customerId = vm.getCustomerId();

      if (customerId) {
        return apiService.put(
          apiService.getFullURL('customers.customer', {customerId: customerId}), data)
          .then(function() {
            userObject = _.extend(userObject, data);
          });
      }

      throw new Error('No user logged in');
    };

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
    };

    vm.getUserCurrency = function() {
      return cookieFactory('MobiusCurrencyCode');
    };

    vm.loadProfile = function() {
      var customerId = vm.getCustomerId();

      if (customerId) {
        // Setting up the headers for a future requests
        var headers = {};
        headers[HEADER_INFINITI_SSO] = cookieFactory(KEY_CUSTOMER_PROFILE);
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

          if(authPromise && authPromise.resolve){
            authPromise.resolve(true);
          }

        }, function () {});
      } else {
        //If for whatever reason we do not have a customerId, clear the stored user and reject the auth
        clearStoredUser();
        return $q.reject({});
      }
    };

    vm.loadLoyalties = function(customerId){

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

    vm.logout = function() {
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
    };

    vm.getUser = function() {
      return userObject;
    };

    vm.getProfileUrl = function() {
      $log.warn('userService.getProfileUrl is not supported by the infiniti user strategy');
    };

  }
}());
