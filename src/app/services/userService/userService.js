'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function($rootScope, $q, $window,
    userObject, apiService, _, loyaltyService, cookieFactory, rewardsService) {

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = 'infinitiAuthN';

    var EVENT_CUSTOMER_LOADED = 'infiniti.customer.loaded';
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';
    // TODO Implement this with AuthCtrl
    var EVENT_ANONYMOUS_LOADED = 'infiniti.anonymous.loaded';

    // Promise is fullfiled when user logged in as mobius customer
    // or anonymous
    var authPromise = $q.defer();

    function hasSSOCookies(){
      return !!cookieFactory(KEY_CUSTOMER_PROFILE) && !!cookieFactory(KEY_CUSTOMER_ID);
    }

    function isProfileLoaded(){
      // NOTE: Email data is loaded via customers API
      return !!(userObject.id && userObject.email);
    }

    function getCustomerId(){
      if(!hasSSOCookies()){
        return null;
      }

      // TODO: Remove test customer ID when API is ready
      return userObject.id || cookieFactory(KEY_CUSTOMER_ID);
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

    function loadProfile() {
      var customerId = getCustomerId();

      if(customerId){
        // Setting up the headers for a future requests
        var headers = {};
        headers[HEADER_INFINITI_SSO] = cookieFactory(KEY_CUSTOMER_PROFILE);
        apiService.setHeaders(headers);

        // Loading profile data and users loyelties
        return $q.all([
          apiService.get(apiService.getFullURL('customers.customer', {customerId: customerId})),
          loadLoyalties(customerId), loadRewards(customerId)
        ]).then(function(data){
          // NOTE: data[0] is userProfile data
          // data[1] is loyalties data - handled in loadLoyalties function
          userObject = _.extend(userObject, data[0]);
          userObject.avatarUrl = userObject.avatarUrl || '/static/images/v4/img-profile.png';
          // Logged in as mobius user
          authPromise.resolve(true);
        });
      } else {
        return $q.reject({});
      }
    }

    function loadLoyalties(customerId){
      customerId = customerId || getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        userObject.loyalties = loyalties;

        return loyalties;
      });
    }

    function loadRewards(customerId){
      customerId = customerId || getCustomerId();

      return rewardsService.getMy(customerId).then(function(rewards){
        userObject.rewards = rewards;

        return rewards;
      });
    }

    function logout() {
      $rootScope.$evalAsync(function(){
        userObject = {};
      });
      // Removing auth headers
      var headers = {};
      headers[HEADER_INFINITI_SSO] = null;
      apiService.setHeaders(headers);

      authPromise = $q.defer().promise;
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
        authPromise.resolve(false);
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
      authPromise: authPromise.promise
    };
  });
