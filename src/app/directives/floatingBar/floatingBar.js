'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', ['Settings', 'bookingService', '$window', function(
      Settings, bookingService, $window) {
    var BOOKING = 'booking',
        ADVANCED_BOOKING = 'advancedBooking',
        MY_ACCOUNT = 'myAccount';

    var active = BOOKING;
    var isCollapsed = false;
    var OUTPUT_DATE_FORMAT_DAY = 'D';
    var OUTPUT_DATE_FORMAT_FULL = 'D MMM, YYYY';
    var INPUT_DATE_FORMAT = 'YYYY-MM-DD';

    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/floatingBar.html',

      // Widget logic goes here
      link: function(scope, $el) {
        scope.hasMutiroomTab = Settings.UI.bookingWidget.hasMutiroomTab;
        scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;
        scope.isMobile = $window.innerWidth <= Settings.UI.screenTypes.mobile.maxWidth;
        isCollapsed = isCollapsed || scope.isMobile;
        scope.isCollapsed = isCollapsed;
        scope.active = active;
        document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);

        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;

        var bookingParams = bookingService.getAPIParams();

        scope.from = $window.moment.utc(bookingParams.from, INPUT_DATE_FORMAT)._d;
        scope.to = $window.moment.utc(bookingParams.to, INPUT_DATE_FORMAT)._d;
        scope.adults = bookingParams.adults;
        scope.children = bookingParams.children;

        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        var EVENT_FLOATING_BAR = 'floatingBarEvent';

        scope.setActive = function(newActive, isMobileToggle) {
          //scope.active === newActive && !scope.isMobile || isMobileToggle && !scope.isCollapsed && scope.isMobile
          if(scope.active === newActive || isMobileToggle){
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
          var tabType = isMRB?ADVANCED_BOOKING:BOOKING;

          if(isCollapsed || scope.active !== tabType){
            scope.setActive(tabType);
          }
        };

        scope.mobileToggleCollapse = function(){
          scope.isCollapsed = !scope.isCollapsed;
        };

        function getFormattedDate(format, date) {
          return $window.moment(date).format(format || Settings.UI.checkInDateFormats.defaultFormat).toUpperCase();
        }

        function isTheSameMonth() {
          return scope.from.getFullYear() === scope.to.getFullYear() &&
            scope.from.getMonth() === scope.to.getMonth();
        }

        scope.getCheckIn = function() {
          return (isTheSameMonth()) ?
            getFormattedDate(OUTPUT_DATE_FORMAT_DAY, scope.from) + ' - ' :
            getFormattedDate(OUTPUT_DATE_FORMAT_FULL, scope.from);
        };

        scope.getCheckOut = function() {
          return getFormattedDate(OUTPUT_DATE_FORMAT_FULL, scope.to);
        };

        scope.hasSearchParams = function() {
          return scope.from && scope.to && scope.adults && !isNaN(scope.from.getTime()) && !isNaN(scope.to.getTime());
        };

        scope.inLine = function() {
          return isTheSameMonth() && (!scope.children || parseInt(scope.children, 10) === 0);
        };

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
  }]).controller('GuestsCtrl', function($scope, $filter, Settings){
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
