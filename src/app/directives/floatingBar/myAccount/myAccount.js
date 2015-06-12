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
          scope.showAccountPanelContent = true;
          badges = response.badges;
          var lastEarnedBadge = scope.badges ? _.sortBy(scope.badges, 'earned')[0] : {};
          if(lastEarnedBadge.earned) {
            scope.lastBadge = lastEarnedBadge;
            scope.lastBadge.displayedDate = $window.moment(
              scope.lastBadge.earned, 'YYYY-MM-DD'
            ).format('D MMM YYYY');
          }
        });

        scope.showBadges = function(){
          modalService.openBadgesDialog(badges);
        };
      }
    };
  });
