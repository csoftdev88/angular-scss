'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.rewards', [])

  .controller('RewardsCtrl', function($scope, $controller, rewardsService,
         $state, $stateParams, _, breadcrumbsService, modalService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('My Rewards');

    console.log('rewards ctrol');

    
    var NUMBER_OF_RELEVANT_REWARDS = 3;

    var selectRewardIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    $scope.rewardsList = [
      {
        'image': {
          'uri': 'http://res.cloudinary.com/dmh2cjswj/image/upload/v1435679651/SAN/offers/government-offer.jpg',
          'alt': 'image'
        },
        'URI': '/api/2.7.1/rewards/FREEUP',
        'code': 'Freeup',
        'name': 'free upgrade',
        'desc': 'present this reward on check in to get a free upgrade',
        'pointCost': '450'
      },
      {
        'image': {
          'uri': 'http://res.cloudinary.com/dmh2cjswj/image/upload/v1435679651/SAN/offers/government-offer.jpg',
          'alt': 'image'
        },
        'URI': '/api/2.7.1/rewards/FREEUP',
        'code': 'Freeup',
        'name': 'free upgrade',
        'desc': 'present this reward on check in to get a free upgrade',
        'pointCost': '450'
      },
      {
        'image': {
          'uri': 'http://res.cloudinary.com/dmh2cjswj/image/upload/v1435679651/SAN/offers/government-offer.jpg',
          'alt': 'image'
        },
        'URI': '/api/2.7.1/rewards/FREEUP',
        'code': 'Freeup',
        'name': 'free upgrade',
        'desc': 'present this reward on check in to get a free upgrade',
        'pointCost': '450'
      }
    ];


    /*
    rewardsService.getAll().then(function(response) {
      $scope.rewardsList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        selectReward($stateParams.code);
      }
    });
*/

    $scope.getRelevant = function(reward, index) {
      var offset = selectRewardIndex < NUMBER_OF_RELEVANT_REWARDS ? 1 : 0;
      return selectRewardIndex !== index && NUMBER_OF_RELEVANT_REWARDS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function(reward) {
      modalService.openRewardDetail(reward);
    };


      /*
    function selectReward(code) {
      selectRewardIndex = _.findIndex($scope.rewardsList, {code: code});
      if (selectRewardIndex < 0) {
        return $state.go('rewards', {code: null});
      }
      $scope.selectedReward = $scope.rewardsList[selectRewardIndex];
      breadcrumbsService.clear()
        .addBreadCrumb('My Rewards', 'rewards', {code: null})
        .addBreadCrumb($scope.selectedRewards.title);
    }
    */
    



  });
