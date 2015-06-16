'use strict';

angular.module('mobiusApp.services.user', [])
  .service('user', function(userObject, apiService, _, $q, loyaltyService) {

    return {
      isLoggedIn: function() {
        return userObject.id ? true : false;
      },
      getUser: function() {
        return userObject;
      },
      loadUser: function(id) {
        id = id || userObject.id;
        if (id) {
          return apiService.get(apiService.getFullURL('customers.customer', {customerId: id})).then(function(response) {
            userObject.loyaltiesPromise = null;
            userObject.loyalties = {};

            userObject.reloadLoyalties = function() {
              userObject.loyaltiesPromise = loyaltyService.getAll(userObject.id);
              userObject.loyaltiesPromise.then(function(loyalties) {
                userObject.loyalties = loyalties;
                return loyalties;
              });
              return userObject.loyaltiesPromise;
            };

            return userObject.reloadLoyalties().then(function() {
              userObject = _.extend(userObject, response);
              return userObject;
            });
          });
        } else {
          return $q.reject({});
        }
      }
    };
  });
