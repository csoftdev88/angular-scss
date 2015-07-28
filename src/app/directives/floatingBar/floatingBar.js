'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function(Settings) {
    var BOOKING = 'booking',
        ADVANCED_BOOKING = 'advancedBooking',
        MY_ACCOUNT = 'myAccount';

    var active = BOOKING;
    var isCollapsed = false;

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/floatingBar.html',

      // Widget logic goes here
      link: function(scope, $el) {
        scope.hasAdvancedTab = Settings.UI.bookingWidget.hasAdvancedTab;

        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;

        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        var EVENT_FLOATING_BAR = 'floatingBarEvent';

        scope.setActive = function(newActive) {
          if(scope.active === newActive){
            scope.isCollapsed = !scope.isCollapsed;
          }else if(scope.active && scope.isCollapsed){
            // Expanding when clicked on another tab
            scope.isCollapsed = false;
          }

          $el.toggleClass('active', !scope.isCollapsed);
          document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);

          scope.active = newActive;
          active = scope.active; // preserve between pages
          isCollapsed = scope.isCollapsed;
        };

        // This will be invoked from child bookingWidget directive
        // when booking tab should be opened
        scope.openBookingTab = function(){
          if(isCollapsed || scope.active !== BOOKING){
            scope.setActive(BOOKING);
          }
        };

        scope.isCollapsed = isCollapsed;
        scope.setActive(active);

        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
          if(viewport.isMobile){
            scope.isCollapsed = true;
          }
        });
        scope.$on(EVENT_FLOATING_BAR, function(event, floatingBar){
          scope.isCollapsed = floatingBar.isCollapsed;
        });
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
