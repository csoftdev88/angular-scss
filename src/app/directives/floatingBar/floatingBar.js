'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.advancedBookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function() {
    var BOOKING_WIDGET = 'bookingWidget';
    var ADVANCED_BOOKING_WIDGET = 'advancedBookingWidget';
    var MY_ACCOUNT = 'myAccount';

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/floatingBar.html',

      // Widget logic goes here
      link: function(scope) {
        scope.BOOKING_WIDGET = BOOKING_WIDGET;
        scope.ADVANCED_BOOKING_WIDGET = ADVANCED_BOOKING_WIDGET;
        scope.MY_ACCOUNT = MY_ACCOUNT;

        scope.active = BOOKING_WIDGET;
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
