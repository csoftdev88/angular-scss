'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function($q, $cookies, userObject, apiService, _,
    loyaltyService, Settings) {

    // We are looking for this cookie in order to detect SSO
    var KEY_CUSTOMER_PROFILE = 'CustomerProfile';

    var HEADER_INFINITI_SSO = 'infinitiAuthN';

    // SSO will expose mobius customer ID via this cookie
    var KEY_CUSTOMER_ID = 'CustomerId-Mobius';

    function hasSSOCookies(){
      return !!$cookies[KEY_CUSTOMER_PROFILE];
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
      return userObject.id || $cookies[KEY_CUSTOMER_ID] || Settings.UI.SSO.customerId || null;
    }

    function loadLoyalties(customerId){
      customerId = customerId || getCustomerId();

      return loyaltyService.getAll(customerId).then(function(loyalties){
        userObject.loyalties = loyalties;

        return loyalties;
      });
    }

    return {
      isLoggedIn: function() {
        return hasSSOCookies() && isProfileLoaded();
      },

      getUser: function() {
        return userObject;
      },

      loadProfile: function() {
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
            return userObject;
          });
        } else {
          return $q.reject({});
        }
      },

      getCustomerId: getCustomerId,
      loadLoyalties: loadLoyalties
    };
  });
