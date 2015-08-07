'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(user, _, $window,
    $state, modalService, $controller, Settings) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function(scope) {

        var badges = [];
        var loyaltyCard = {};

        $controller('SSOCtrl', {$scope: scope});
        scope.displaySettings = Settings.UI.myAccount.displaySettings;
        function loadLoyalities() {
          // NOTE: Loyalties object should be already loaded
          // However, we are fetching the latest data
          user.loadLoyalties().then(function(response) {
            badges = response.badges;
            loyaltyCard = response.loyaltyCard || {};
            loyaltyCard.stamps = _.reduce(_.sortBy(loyaltyCard.stamps, 'startPosition'), function(acc, stamp) {
              for (var i = stamp.startPosition; i <= stamp.endPosition; i++) {
                acc.push(stamp);
              }
              return acc;
            }, []);

            var lastEarnedBadge = badges ? _.chain(badges).filter('earned').sortBy('earned').last().value() : {};
            if (lastEarnedBadge && lastEarnedBadge.earned) {
              scope.lastBadge = lastEarnedBadge;
              scope.lastBadge.displayedDate = $window.moment(
                scope.lastBadge.earned, 'YYYY-MM-DD'
              ).format('D MMM YYYY');
            }

            scope.loyaltyName = loyaltyCard.name;
            scope.loyaltiesAll = loyaltyCard.stamps.length;
            scope.loyaltiesEarned = _.filter(loyaltyCard.stamps, 'earned').length;
          });
        }

        function loadRewards(){
          user.loadRewards().then(function(rewards) {
            // Sorting by earned date
            // TODO - timestampt should be used instead
            // once API is ready
            var earnedRewards = _.sortBy(rewards, 'earned').reverse();
            scope.lastReward = earnedRewards && earnedRewards.length?earnedRewards[0]:{};
          });
        }

        scope.user = user;

        scope.showBadges = function() {
          modalService.openBadgesDialog(badges);
        };

        scope.showLoyaltyCard = function() {
          modalService.openLoyaltyDialog(loyaltyCard);
        };

        scope.showRewards = function(){
          $state.go('rewards');
        };

        var userUnWatch = scope.$watch(
          function() {
            return user.isLoggedIn();
          },
          function(isLoggedIn) {
            if (isLoggedIn) {
              loadLoyalities();
              loadRewards();
            }
          }
        );

        scope.$on('$destroy', function() {
          userUnWatch();
        });
      }
    };
  });
