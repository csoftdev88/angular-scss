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
        userObject.id = id ? id : userObject.id;
        if (userObject.id) {
          userObject.getLoyalties = function() {
            if (!userObject._loyalties) {
              userObject._loyalties = loyaltyService.getAll(userObject.id);
            }
            return userObject._loyalties;
          };
          userObject.getLoyaltiesObject = function() {
            if (!userObject._loyaltiesObject) {
              userObject._loyaltiesObject = {};
              userObject.getLoyalties().then(function(loyalties) {
                userObject._loyaltiesObject = loyalties;
              });
            }
            return userObject._loyaltiesObject;
          };

          return apiService.get(apiService.getFullURL('customers.customers') + '/' + userObject.id).then(function(response) {
            userObject = _.extend(userObject, response);
          });
        } else {
          return $q.reject({});
        }
      }
    };
  });
