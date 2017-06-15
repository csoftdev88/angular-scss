'use strict';
/*
* Service for retrieving loyalty, rewards, badges from the API
*/
angular.module('mobiusApp.services.loyalty', [])

.service( 'loyaltyService',  function($q, apiService, userObject) {
  function getAll(userId){
    var q = $q.defer();
    var headers = {
      figur8: userObject.figur8Id
    };
    apiService.setHeaders(headers);

    apiService.get(apiService.getFullURL('loyalties.all', {
      customerId: userId
    }), {figur8: userObject.figur8Id}, false).then(function(data){
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
