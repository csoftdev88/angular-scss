'use strict';

angular.module('mobiusApp.directives.reservation.details', [])

.directive('reservationDetails', function($controller){
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '=',
      currencyCode: '='
    },
    templateUrl: 'directives/reservationData/details/reservationDetails.html',

    // Widget logic goes here
    link: function(scope){
      $controller('ReservationDirectiveCtrl', {$scope: scope});
      scope.$watch('property', function(property){
        if(property){
          $controller('ConfirmationNumberCtrl', {$scope: scope, propertyCode: scope.property.code});
        }
      }, false);
    }
  };
});
