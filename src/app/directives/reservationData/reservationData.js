'use strict';

angular.module('mobiusApp.directives.reservation.data', [])

.directive('reservationData', function($controller, $state, _) {
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '=',
      currencyCode: '='
    },
    templateUrl: 'directives/reservationData/reservationData.html',

    // Widget logic goes here
    link: function(scope) {
      $controller('ReservationDirectiveCtrl', {
        $scope: scope
      });
      scope.$state = $state;

      scope.getTotal = function(prop) {
        return _.reduce(
          _.map(scope.reservation.rooms, function(room) {
            return room.priceDetail ? room.priceDetail[prop] : null;
          }),
          function(t, n) {
            return t + n;
          });
      };
    }
  };
});
