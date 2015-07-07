'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.rewards', [])

  .controller('RewardsCtrl', function($scope, $controller, rewardsService,
    $q, preloaderFactory, $state, user, $stateParams, modalService, breadcrumbsService) {

    //$controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Rewards');

    function onAuthorized(isMobiusUser){
      if(!isMobiusUser){
        $state.go('home');
      }else{
        // Init
        init();
      }
    }

    function init(){
      var rewardsPromise = $q.all([
        rewardsService.getConsumed(user.getCustomerId()),
        rewardsService.getConsumable(user.getCustomerId()),
      ]).then(function(data){
        console.log(data);
        $scope.consumedRewards = data[0];
        $scope.consumableRewards = data[1];

      }, function(){
        $state.go('home');
      });

      preloaderFactory(rewardsPromise);
    }

    // Rewards are auth protected - user must be logged in
    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    $scope.openRewardDetails = modalService.openRewardDetailsDialog;

    $scope.viewMode = 'consumed';

    /*
    var NUMBER_OF_RELEVANT_REWARDS = 3;

    var selectRewardIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    rewardsService.getAll(userId).then(function(response) {
      $scope.rewardsList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        //selectReward($stateParams.code);
      }
    });

    /*
    rewardsService.getAll(userId).then(function(response) {
      $scope.rewardsList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        //selectReward($stateParams.code);
      }
    });


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
