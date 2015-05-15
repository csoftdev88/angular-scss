'use strict';

angular.module('mobiusApp.directives.reservation.data', [])

.directive('reservationData', function(stateService){
  return {
    restrict: 'E',
    scope: {reservation: '=reservation'},
    templateUrl: 'directives/reservationData/reservationData.html',

    // Widget logic goes here
    link: function(scope){
      stateService.setDefaultScopeAppCurrencyChangeListener(scope);
    }

  };
});
