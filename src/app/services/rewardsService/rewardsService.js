'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.rewards', [])
.service( 'rewardsService',  function(apiService, $q) {

  function getAll(userId){

    var q = $q.defer();

    apiService.get(apiService.getFullURL('rewards.all', {
      customerId: userId
    })).then(function(data){
      q.resolve(data);
    }, function(error){
      q.reject(error);
    });

    return q.promise;
  }

  function getRewardDetails(rewardCode, params){
    var URL = apiService.getFullURL('rewards.details', {rewardCode: rewardCode});
    return apiService.get(URL, params);
  }

  // Public methods
  return {
    getAll: getAll,
    getRewardDetails: getRewardDetails
  };
});
