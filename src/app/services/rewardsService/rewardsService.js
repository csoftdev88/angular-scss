'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.rewards', [])
.service( 'rewardsService',  function(apiService) {

  function getRewards(customerId, params){
    return apiService.get(apiService.getFullURL(
      'rewards.all', {customerId: customerId}),
    params);
  }

  function getConsumable(customerId){
    return getRewards(customerId, {scope:'consumable'});
  }

  function getConsumed(customerId){
    return getRewards(customerId, {scope:'consumed'});
  }

  // Public methods
  return {
    getConsumable: getConsumable,
    getConsumed: getConsumed
  };
});
