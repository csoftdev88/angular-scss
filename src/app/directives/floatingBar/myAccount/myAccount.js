'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(loyaltyService, _, $window, modalService){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function(scope) {
        var badges;

        loyaltyService.getAll().then(function(response) {
          badges = response.badges;

          var lastEarnedBadge = scope.badges ? _.sortBy(scope.badges, 'earned')[0] : {};
          if(lastEarnedBadge.earned) {
            scope.lastBadge = lastEarnedBadge;
            scope.lastBadge.displayedDate = $window.moment(
              scope.lastBadge.earned, 'YYYY-MM-DD'
            ).format('D MMM YYYY');
          }

          scope.loyaltyCard = response.loyaltyCard || {};
          scope.loyaltyCard.stamps = _.sortBy(scope.loyaltyCard.stamps, 'startPosition');
        });

        scope.showBadges = function(){
          modalService.openBadgesDialog(badges);
        };

        scope.showLoyaltyCards = function(){
          modalService.openLoyaltiesDialog(scope.loyaltyCard.stamps);
        };
      }
    };
  });
