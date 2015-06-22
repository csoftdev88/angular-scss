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
      var formatingRules = [
        {
          // It shows the day (day name) if the
          // check in date is within the next 7 days
          max: 7 * 86400000,
          format: 'dd'
        },
        {
          // If the check in date is between 8 and 90 days
          // it shows the numeric date and the month (ie 5 Aug)
          min: 7 * 86400000,
          max: 90 * 86400000,
          format: 'DD MMM'
        },
        {
          // If it's 90 days away it shows the month and year
          min: 90 * 86400000,
          format: 'MMM YYYY'
        }
      ];

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

      scope.getCheckInDateString = function(){
        if(!scope.reservation.arrivalDate){
          return '';
        }

        console.log($window.moment().format());
        var diff = $window.moment().diff(scope.reservation.arrivalDate);

        console.log(diff);
        for(var i = 0; i < formatingRules.length; i++){
          var rule = formatingRules[i];

          if(rule.min && diff < rule.min){
            continue;
          }

          if(rule.max && diff > rule.max){
            continue;
          }

          return $window.moment(scope.reservation.arrivalDate).format(rule.format);
        }

        return scope.reservation.arrivalDate;
      };
    }
  };
});
