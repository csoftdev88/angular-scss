'use strict';
/*
* Service for retrieving loyalty, rewards, badges from the API
*/
angular.module('mobiusApp.services.loyalty', [])

.service( 'loyaltyService',  function($q, apiService, user) {
  function getAll(){
    if(!user.isLoggedIn()){
      throw new Error('User must be logged in');
    }

    var q = $q.defer();

    apiService.get(apiService.getFullURL('loyalties.all', {
      customerId: user.getUser().id
    })).then(function(data){
      q.resolve(data);
    }, function(error){
      q.reject(error);
    });

    return q.promise;
  }

  // Public methods
  return {
    getAll: getAll
  };
});
