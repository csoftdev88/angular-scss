'use strict';

angular.module('mobiusApp.directives.reservation.details', [])

.directive('reservationDetails', function($controller){
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '='
    },
    templateUrl: 'directives/reservationData/details/reservationDetails.html',

    // Widget logic goes here
    link: function(scope){
      $controller('ReservationDirectiveCtrl', {$scope: scope});
    }
  };
});
