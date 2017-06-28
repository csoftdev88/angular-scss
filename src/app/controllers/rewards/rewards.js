'use strict';

/*
 * This module controlls offers page
 */
angular
  .module('mobius.controllers.rewards', [])
  .controller('RewardsCtrl', function($scope, $controller, rewardsService, $q, preloaderFactory, $state, user,
                                      $stateParams, modalService, breadcrumbsService, userMessagesService, _,
                                      userObject, scrollService, $timeout, Settings) {

    //$controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Rewards');

    function onAuthorized() {
      if (!$scope.auth.isLoggedIn()) {
        $state.go('home');
      } else {
        init();
      }
    }

    $scope.config = Settings.UI.viewsSettings.rewards;

    function init(){
      var rewardsPromise = $q.all([
        rewardsService.getMy(user.getCustomerId()),
        rewardsService.getAll(user.getCustomerId()),
      ]).then(function(data){
        $scope.consumedRewards = _.sortBy(data[0], 'earned').reverse();
        $scope.consumableRewards = data[1].map(function(reward){
          // Adding affordable flag
          reward._isAffordable = user.getUser().loyalties.amount >= reward.pointCost;
          return reward;
        });
        console.log('user a', userObject);
        $scope.pointsBalance = userObject.loyalties.amount;

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
      if(!reward._isAffordable){
        reward._customerTotalPoints = user.getUser().loyalties.amount;
      }

      modalService.openRewardDetailsDialog(reward).then(function(){

        // Buying a new reward
        var buyPromise = rewardsService.buyReward(user.getCustomerId(), reward.id).then(function(){
          // Consumed a new reward
          userMessagesService.addMessage('<div>You have successfully redeemed points to purchase: ' +
            reward.name + '</div>');

          // Reloading user loyalties data
          userObject.loyalties.amount = userObject.loyalties.amount - reward.pointCost;
          init();
          $timeout(function(){
            scrollService.scrollTo('top');
          }, 0);

          //Hiding this as backend doesn't update points quickly enough
          /*
          user.loadLoyalties().then(function(){
            init();
          });
          */
        }, function(){
          // Something went wrong
          userMessagesService.addMessage('<div>Sorry, we could not complete the transaction, please try again.</div>');
          $timeout(function(){
            scrollService.scrollTo('top');
          }, 0);
        });
        preloaderFactory(buyPromise);
      });
    };

    $scope.toogleFullListMode = function(){
      $scope.viewMode = 'consumable';
    };

    $scope.viewMode = 'consumed';
  });
