'use strict';

angular.module('mobiusApp.directives.reservation.data', [])

.directive('reservationData', function($window, _){
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '='
    },
    templateUrl: 'directives/reservationData/reservationData.html',

    // Widget logic goes here
    link: function(scope){
      function getCount(prop){
        if(!scope.reservation){
          return 0;
        }

        return _.reduce(
            _.map(scope.reservation.rooms, function(room){
              return room[prop];
            }), function(total, n){
              return total + n;
            });
      }

      scope.getAdultsCount = function(){
        return getCount('adults');
      };

      scope.getChildrenCount = function(){
        return getCount('children');
      };
    }
  };
});
