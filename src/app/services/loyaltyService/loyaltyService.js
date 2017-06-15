'use strict';
/*
* Service for retrieving loyalty, rewards, badges from the API
*/
angular
  .module('mobiusApp.services.loyalty', [])
  .service( 'loyaltyService',  function($q, apiService) {
  function getAll(userId){
    var q = $q.defer();

    apiService.get(apiService.getFullURL('loyalties.all', {
      customerId: userId
    }), {}, false).then(function(data){
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
