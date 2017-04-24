'use strict';

angular.module('mobiusApp.directives.reservation.details', [])

.directive('reservationDetails', function($controller, stateService, Settings){
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
      scope.config = Settings.UI.reservations;
      scope.viewSettings = Settings.UI.viewsSettings.reservationsOverview;
      scope.isMobile = stateService.isMobile();
      scope.$watch('property', function(property){
        if(property){
          $controller('ConfirmationNumberCtrl', {$scope: scope, propertyCode: scope.property.code});
        }
      }, false);
    }
  };
});
