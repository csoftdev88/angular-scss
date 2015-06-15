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
            userObject = _.extend(userObject, response);

            userObject._loyalties = null;
            userObject._loyaltiesObject = {};

            userObject.reloadLoyalties = function() {
              userObject._loyalties = loyaltyService.getAll(userObject.id).then(function(loyalties) {
                userObject._loyaltiesObject = loyalties;
              });
            };

            userObject.getLoyalties = function() {
              if (!userObject._loyalties) {
                userObject.reloadLoyalties();
              }
              return userObject._loyalties;
            };

            userObject.getLoyaltiesObject = function() {
              return userObject._loyaltiesObject;
            };

            return userObject.getLoyalties().then(function() {
              return userObject;
            });
          });
        } else {
          return $q.reject({});
        }
      }
    };
  });
