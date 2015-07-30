'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.rewards', [])

  .controller('RewardsCtrl', function($scope, $controller, rewardsService,
    $q, preloaderFactory, $state, user, $stateParams, modalService, breadcrumbsService,
    userMessagesService) {

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
        rewardsService.getMy(user.getCustomerId()),
        rewardsService.getAll(user.getCustomerId()),
      ]).then(function(data){
        $scope.consumedRewards = data[0];
        $scope.consumableRewards = data[1].map(function(reward){
          // Adding affordable flag
          reward._isAffordable = user.getUser().loyalties.amount >= reward.pointCost;
          return reward;
        });

      }, function(){
        $state.go('home');
      });

      preloaderFactory(rewardsPromise);
      // NOTE: Showing my rewards by default
      $scope.viewMode = 'consumed';
    }

    // Rewards are auth protected - user must be logged in
    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    $scope.openRewardDetails = function(reward){
      modalService.openRewardDetailsDialog(reward).then(function(){
        // Buying a new reward
        var buyPromise = rewardsService.buyReward(user.getCustomerId(), reward.id).then(function(){
          // Consumed a new reward
          userMessagesService.addMessage('<div>You have successfully bought ' +
            reward.name);

          // Reloading user loyalties data
          user.loadLoyalties().then(function(){
            init();

            // Scrolling to the top of the page so user sees notification message
            angular.element('html, body').animate({
              scrollTop: 0
            }, 1000);
          });
        }, function(){
          // Something went wrong
          userMessagesService.addMessage('<div>Sorry, we could not complete the transaction, please try again.</div>');
        });
        preloaderFactory(buyPromise);
      });
    };

    $scope.toogleFullListMode = function(){
      $scope.viewMode = 'consumable';
    };

    $scope.viewMode = 'consumed';
  });
