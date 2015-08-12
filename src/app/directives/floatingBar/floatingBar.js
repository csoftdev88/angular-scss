'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', function(Settings, $window) {
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
        scope.hasMutiroomTab = Settings.UI.bookingWidget.hasMutiroomTab;
        scope.isMobile = $window.innerWidth <= Settings.UI.screenTypes.mobile.maxWidth;
        isCollapsed = scope.isMobile;

        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;
        

        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        var EVENT_FLOATING_BAR = 'floatingBarEvent';

        scope.setActive = function(newActive, isMobileToggle) {

          if(scope.active === newActive && !scope.isMobile || isMobileToggle && !scope.isCollapsed && scope.isMobile){
            scope.isCollapsed = !scope.isCollapsed;
          }else if(scope.active && scope.isCollapsed){
            // Expanding when clicked on another tab
            scope.isCollapsed = false;
          }

          $el.toggleClass('active', !scope.isCollapsed);

          scope.active = newActive;
          active = scope.active; // preserve between pages
          isCollapsed = scope.isCollapsed;
          document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);
        };

        // This will be invoked from child bookingWidget directive
        // when booking tab should be opened
        scope.openBookingTab = function(isMRB){
          if(scope.isMobile){
            return;
          }
          var tabType = isMRB?ADVANCED_BOOKING:BOOKING;

          if(isCollapsed || scope.active !== tabType){
            scope.setActive(tabType);
          }
        };

        scope.mobileToggleCollapse = function(){
          scope.isCollapsed = !scope.isCollapsed;
        };

        scope.isCollapsed = isCollapsed;
        scope.setActive(active);

        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
          scope.isMobile = viewport.isMobile;
          if(viewport.isMobile){
            scope.isCollapsed = true;
            $el.toggleClass('active', !scope.isCollapsed);
            document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);
          }
        });
        scope.$on(EVENT_FLOATING_BAR, function(event, floatingBar){
          scope.isCollapsed = floatingBar.isCollapsed;
          document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);
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
            '0': 'Children',
            '1': '{} Child',
            'plural': '{} Children'
          })
        };
  });
