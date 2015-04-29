'use strict';

angular.module('mobiusApp.services.user', [])
  .service( 'user',  function(userObject, apiService, _) {

    return {
      isLoggedIn: function() {
        return userObject.id ? true : false;
      },
      getUser: function() {
        return userObject;
      },
      loadUser: function(id) {
        userObject.id = id ? id : userObject.id;
        if(userObject.id) {
          apiService.get(apiService.getFullURL('customers.getCustomer')+'/'+userObject.id).then(
          function(response) {
            userObject = _.extend(response, response);
          }
          );

        } else {
          return {};
        }
      }
    };
  });
