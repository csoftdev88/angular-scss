'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.rewards', [])
.service( 'rewardsService',  function(apiService) {
  // TODO - Take cusomer ID from userService
  function getRewards(customerId, params){
    return apiService.get(apiService.getFullURL(
      'rewards.all', {customerId: customerId}),
    params);
  }

  function getAll(customerId){
    return getRewards(customerId);
  }

  function getConsumed(customerId){
    return getRewards(customerId, {scope:'consumed'});
  }

  function consumeReward(customerId, rewardId){
    return apiService.put(apiService.getFullURL(
      'rewards.consume', {
        customerId: customerId,
        rewardId: rewardId
      }));
  }

  // Public methods
  return {
    getAll: getAll,
    getConsumed: getConsumed,
    consumeReward: consumeReward
  };
});
