'use strict';

angular.module('mobiusApp.directives.reservation.data', [])

.directive('reservationData', function($controller){
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '='
    },
    templateUrl: 'directives/reservationData/reservationData.html',

    // Widget logic goes here
    link: function(scope){
      $controller('ReservationDirectiveCtrl', {$scope: scope});
    }
  };
});
