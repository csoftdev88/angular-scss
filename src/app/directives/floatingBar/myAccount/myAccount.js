'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(user, _, $window, modalService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function(scope) {
        function loadLoyalities() {
          user.getUser().loyaltiesPromise.then(function(response) {
            badges = response.badges;
            loyaltyCard = response.loyaltyCard || {};
            loyaltyCard.stamps = _.reduce(_.sortBy(loyaltyCard.stamps, 'startPosition'), function(acc, stamp) {
              for (var i = stamp.startPosition; i <= stamp.endPosition; i++) {
                acc.push(stamp);
              }
              return acc;
            }, []);

            var lastEarnedBadge = badges ? _.sortBy(badges, 'earned')[0] : {};
            if (lastEarnedBadge.earned) {
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

        scope.user = user;

        var badges = [];
        var loyaltyCard = {};

        scope.showBadges = function() {
          modalService.openBadgesDialog(badges);
        };

        scope.showLoyaltyCard = function() {
          modalService.openLoyaltyDialog(loyaltyCard);
        };

        var userUnWatch = scope.$watch(
          function() {
            return user.isLoggedIn();
          },
          function(loggedIn) {
            if (loggedIn) {
              loadLoyalities();
            }
          }
        );

        scope.$on('$destroy', function() {
          userUnWatch();
        });
      }
    };
  });
