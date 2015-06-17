'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(user, _, $window, modalService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function(scope) {

        var badges = [];
        var stamps = [];

        function loadLoyalities() {
          user.getUser().loyaltiesPromise.then(function(response) {
            badges = response.badges;
            var loyaltyCard = response.loyaltyCard || {};
            stamps = loyaltyCard.stamps;

            var lastEarnedBadge = badges ? _.sortBy(badges, 'earned')[badges.length-1] : {};
            if (lastEarnedBadge.earned) {
              scope.lastBadge = lastEarnedBadge;
              scope.lastBadge.displayedDate = $window.moment(
                scope.lastBadge.earned, 'YYYY-MM-DD'
              ).format('D MMM YYYY');
            }

            scope.loyaltyName = loyaltyCard.name;
            scope.loyaltiesAll = stamps.length;
            scope.loyaltiesEarned = _.filter(stamps, 'earned').length;
          });
        }

        scope.user = user;

        scope.showBadges = function() {
          modalService.openBadgesDialog(badges);
        };

        scope.showLoyaltyCards = function() {
          modalService.openLoyaltiesDialog(stamps);
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
