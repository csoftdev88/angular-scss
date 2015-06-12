'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(loyaltyService, _, $window){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function(scope) {
        loyaltyService.getAll().then(function(response) {
          scope.badges = response.badges;
          var lastEarnedBadge = scope.badges ? _.sortBy(scope.badges, 'earned')[0] : {};
          if(lastEarnedBadge.earned) {
            scope.lastBadge = lastEarnedBadge;
            scope.lastBadge.displayedDate = $window.moment(scope.lastBadge.earned, 'YYYY-MM-DD').format('D MMM YYYY');
          }
          console.log('scope.lastBadge' + scope.lastBadge);
        });

        scope.showBadgeDetail = function (/*index*/) {
          console.log('showBadgeDetail');
        };
      }
    };
  });
