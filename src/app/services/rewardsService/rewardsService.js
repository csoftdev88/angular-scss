'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.rewards', [])
.service( 'rewardsService',  function(apiService, userObject) {
  // TODO - Take cusomer ID from userService
  function getAll(customerId){
    var headers = {
      figur8: userObject.figur8Id
    };
    apiService.setHeaders(headers);
    return apiService.get(apiService.getFullURL('rewards.all'), {
      customerId: customerId,
      figur8: userObject.figur8Id || null
    });
  }

  function getMy(customerId){
    var headers = {
      figur8: userObject.figur8Id
    };
    apiService.setHeaders(headers);
    return apiService.get(apiService.getFullURL('rewards.my', {
      customerId: customerId
    }), {
      figur8: userObject.figur8Id || null
    }, false);
  }

  function buyReward(customerId, rewardId){
    return apiService.post(apiService.getFullURL('rewards.my', {
        customerId: customerId
      }), {
      rewardId: rewardId
    });
  }

  // Public methods
  return {
    getAll: getAll,
    getMy: getMy,
    buyReward: buyReward
  };
});
