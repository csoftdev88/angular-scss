'use strict';
/*
* This service gets content for application main menu
*/
angular
  .module('mobiusApp.services.rewards', [])
  .service( 'rewardsService',  function(apiService) {
    // TODO - Take cusomer ID from userService
    function getAll(customerId){
      return apiService.get(apiService.getFullURL('rewards.all'), {
        customerId: customerId
      });
    }

    function getMy(customerId){
      return apiService.get(apiService.getFullURL('rewards.my', {
        customerId: customerId
      }), {}, false);
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
