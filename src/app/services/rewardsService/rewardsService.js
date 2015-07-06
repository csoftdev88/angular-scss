'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.rewards', [])
.service( 'rewardsService',  function(apiService) {

  function getAll(userId){
    return apiService.get(apiService.getFullURL('rewards.all'), {
      customerId: userId
    });
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
