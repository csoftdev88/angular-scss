'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function() {
    var BOOKING = 'booking',
        ADVANCED_BOOKING = 'advancedBooking',
        MY_ACCOUNT = 'myAccount';

    var active = BOOKING;

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
          if (newActive === scope.active) {
            scope.active = false;
          } else {
            scope.active = newActive;
          }
          // Set class on root element, so we can change
          // bottom margin of footer
          $el.toggleClass('active', !!scope.active);
          active = scope.active; // preserve between pages
        };

        scope.setActive(active);
      }
    };
  // Generic controller for booking tabs - defines numbers of guests
  }).controller('GuestsCtrl', function($scope, $filter, Settings){
    var numberToListFilter = $filter('numberToList');
    var settings = Settings.UI.bookingWidget;

    $scope.guestsOptions = {
      adults: numberToListFilter([], settings.adults.min, settings.adults.max,
        // TODO: Localize
        {
          '1': '{} Adult',
          'plural': '{} Adults'
        }),
        children: numberToListFilter([], settings.children.min, settings.children.max,
          // TODO: Localize
          {
            '0': 'No Children',
            '1': '{} Child',
            'plural': '{} Children'
          })
        };
  });
