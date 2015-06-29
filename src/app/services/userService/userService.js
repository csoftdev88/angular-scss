'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function($q, $cookies, $window,
    userObject, apiService, _, loyaltyService) {


    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'MobiusID';
    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = 'infinitiAuthN';

    var EVENT_CUSTOMER_LOADED = 'infiniti.customer.loaded';
    var EVENT_CUSTOMER_LOGGED_OUT = 'infiniti.customer.logged.out';
    var EVENT_ANONYMOUS_LOADED = 'infiniti.anonymous.loaded';

    function hasSSOCookies(){
      return !!$cookies[KEY_CUSTOMER_PROFILE] && !!$cookies[KEY_CUSTOMER_ID];
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
      return userObject.id || $cookies[KEY_CUSTOMER_ID] || null;
    }

    function updateUser(data) {
      var customerId = getCustomerId();

      if (customerId) {
        userObject = _.extend(userObject, data);
        return apiService.put(apiService.getFullURL('customers.customer', {customerId: customerId}), userObject);
      } else {
        throw new Error('No user logged in');
      }
    }

    function loadProfile() {
      var customerId = getCustomerId();

      if(customerId){
        // Setting up the headers for a future requests
        var headers = {};
        headers[HEADER_INFINITI_SSO] = $cookies[KEY_CUSTOMER_PROFILE];
        apiService.setHeaders(headers);

        // Loading profile data and users loyelties
        return $q.all([
          apiService.get(apiService.getFullURL('customers.customer', {customerId: customerId})),
          loadLoyalties(customerId)
        ]).then(function(data){
          // NOTE: data[0] is userProfile data
          // data[1] is loyalties data - handled in loadLoyalties function
          userObject = _.extend(userObject, data[0]);
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

    function logout() {
      userObject = {};
      // Removing auth headers
      var headers = {};
      headers[HEADER_INFINITI_SSO] = null;
      apiService.setHeaders(headers);
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
        console.log('anon');
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
      updateUser: updateUser,
      logout: logout
    };
  });
