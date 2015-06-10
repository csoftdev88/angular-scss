'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function() {
    var BOOKING = 'booking';
    var ADVANCED_BOOKING = 'advancedBooking';
    var MY_ACCOUNT = 'myAccount';

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/floatingBar.html',

      // Widget logic goes here
      link: function(scope) {
        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;

        scope.active = BOOKING;
        scope.setActive = function(newActive) {
          if (newActive === scope.active) {
            scope.active = null;
          } else {
            scope.active = newActive;
          }
        };
      }
    };
  });
