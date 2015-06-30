'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function() {
    var BOOKING = 'booking',
        ADVANCED_BOOKING = 'advancedBooking',
        MY_ACCOUNT = 'myAccount';

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/floatingBar.html',

      // Widget logic goes here
      link: function(scope, $el) {
        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;

        scope.setActive = function(newActive) {
          $el.removeClass(scope.active);

          if (newActive === scope.active) {
            scope.active = false;
          } else {
            scope.active = newActive;
            $el.addClass(newActive);
          }
          // Set class on root element, so we can change
          // bottom margin of footer
          console.log(scope.active);
          $el.toggleClass('active', !!scope.active);
        };

        scope.setActive(BOOKING);
      }
    };
  });
