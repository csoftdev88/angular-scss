'use strict';

angular.module('mobiusApp.directives.floatingBar', [
  'mobiusApp.directives.floatingBar.bookingWidget',
  'mobiusApp.directives.floatingBar.myAccount'
])

  .directive('floatingBar', ['Settings', 'bookingService', '$window', '$rootScope', '$timeout', function(
      Settings, bookingService, $window, $rootScope, $timeout) {
    var BOOKING = 'booking',
        ADVANCED_BOOKING = 'advancedBooking',
        MY_ACCOUNT = 'myAccount',
        CAMPAIGN = 'campaign';

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
        scope.hasMultiroomTab = Settings.UI.bookingWidget.hasMultiroomTab;
        scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;
        scope.isMobile = $window.innerWidth <= Settings.UI.screenTypes.mobile.maxWidth;
        isCollapsed = isCollapsed || scope.isMobile;
        scope.isCollapsed = isCollapsed;
        scope.active = active;
        scope.floatingBarTopRight = Settings.UI.bookingWidget.mobileTopRight;
        if(scope.isCollapsed){
          document.body.classList.remove('floating-bar-active');
        }
        else{
          document.body.classList.add('floating-bar-active');
        }


        scope.BOOKING = BOOKING;
        scope.ADVANCED_BOOKING = ADVANCED_BOOKING;
        scope.MY_ACCOUNT = MY_ACCOUNT;
        scope.CAMPAIGN = CAMPAIGN;

        var bookingParams = bookingService.getAPIParams();

        scope.from = bookingParams.from ? $window.moment.utc(bookingParams.from, INPUT_DATE_FORMAT)._d : null;
        scope.to = $window.moment.utc(bookingParams.to, INPUT_DATE_FORMAT)._d;
        scope.adults = bookingParams.adults;
        scope.children = bookingParams.children;



        var EVENT_FLOATING_BAR = 'floatingBarEvent';

        scope.closeWidget = function() {
          scope.isCollapsed = true;
          if (Settings.engine === 'loyalty') {
            $('floating-bar').css('display', 'none');
          }
        };

        scope.setActive = function(newActive, isMobileToggle) {
          //remove css transition end classes
          $('booking-widget').removeClass('transEnd');
          $('my-account').removeClass('transEnd');

          //scope.active === newActive && !scope.isMobile || isMobileToggle && !scope.isCollapsed && scope.isMobile
          if(scope.active === newActive || isMobileToggle && scope.isMobile){
            scope.isCollapsed = !scope.isCollapsed;
          }else if(scope.active && scope.isCollapsed){
            // Expanding when clicked on another tab
            scope.isCollapsed = false;
          }

          $el.toggleClass('active', !scope.isCollapsed);
          $el.toggleClass('multi-room', newActive === ADVANCED_BOOKING);

          scope.active = newActive;
          active = scope.active; // preserve between pages
          isCollapsed = scope.isCollapsed;
          if(isCollapsed){
            document.body.classList.remove('floating-bar-active');
          }
          else{
            document.body.classList.add('floating-bar-active');
          }
        };

        // This will be invoked from child bookingWidget directive
        // when booking tab should be opened
        scope.openBookingTab = function(isMRB){
          var tabType = isMRB?ADVANCED_BOOKING:BOOKING;
          isCollapsed = scope.isCollapsed;
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
          if(!scope.from){
            return false;
          }
          return scope.from.getFullYear() === scope.to.getFullYear() &&
            scope.from.getMonth() === scope.to.getMonth();
        }

        scope.getCheckIn = function() {
          return (isTheSameMonth()) ?
            getFormattedDate(OUTPUT_DATE_FORMAT_DAY, bookingParams.from) + ' -&nbsp;' :
            getFormattedDate(OUTPUT_DATE_FORMAT_FULL, bookingParams.from) + ' -&nbsp;';
        };

        scope.getCheckOut = function() {
          return getFormattedDate(OUTPUT_DATE_FORMAT_FULL, bookingParams.to);
        };

        scope.hasDates = function() {
          return scope.from && scope.to;
        };

        scope.hasSearchParams = function() {
          return scope.from && scope.to && !isNaN(scope.from.getTime()) && !isNaN(scope.to.getTime()) || scope.adults;
        };

        scope.inLine = function() {
          return isTheSameMonth() && (!scope.children || parseInt(scope.children, 10) === 0);
        };

        scope.openDatePicker = function(){
          $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
              openDatePicker: true
            });
        };

        //Android soft keyboard triggers window resize event, thus closing the booking bar when it opens which is unwanted behaviour
        //Keeping below code as not sure why it was added in the first place
        //Possible workaround: check if focus is on an input field before closing
        //if($(document.activeElement).attr('type') === 'text') {
        /*
        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
          scope.isMobile = viewport.isMobile;
          if(viewport.isMobile){
            scope.isCollapsed = true;
            $el.toggleClass('active', !scope.isCollapsed);
            document.body.classList.toggle('floating-bar-active', !scope.isCollapsed);
          }
        });
        */
        scope.$on(EVENT_FLOATING_BAR, function(event, floatingBar){
          scope.isCollapsed = floatingBar.isCollapsed;
          if(scope.isCollapsed){
            document.body.classList.remove('floating-bar-active');
          }
          else{
            document.body.classList.add('floating-bar-active');
          }
        });

        scope.initialShow = function(){
          //Delay the initial show bar animation by 2 seconds
          $timeout(function() {
            scope.showAfterLoad = true;
            //Toggle css trasition classes
            $('booking-widget').on('transitionend webkitTransitionEnd otransitionend MSTransitionEnd', function() {
              $('booking-widget').addClass('transEnd');
            });

            $('my-account').on('transitionend webkitTransitionEnd otransitionend MSTransitionEnd', function() {
              $('my-account').addClass('transEnd');
            });
          }, 2000);
        };
      }
    };
  // Generic controller for booking tabs - defines numbers of guests
  }]).controller('GuestsCtrl', function($scope, $filter, Settings, bookingService, _){
    var numberToListFilter = $filter('numberToList');
    var settings = Settings.UI.bookingWidget;

    $scope.setAdultsOptions = function(options){
      var adultOptions =  numberToListFilter([], settings.adults.min, settings.adults.max,
          // TODO: Localize
          {
            '1': '{} ' + options.adult,
            'plural': '{} ' + options.adults
          });
      $scope.guestsOptions.adults = adultOptions;
      $scope.selected.adults = _.find($scope.guestsOptions.adults, {
        value: parseInt(bookingService.getAPIParams(true).adults, 10) || settings.defaultAdultCount
      });
      // If there is a rooms object in the URL, then try to load the previous search options into the adults and children select
      var urlRooms = bookingService.getMultiRoomData();
      if (urlRooms) {
        _.each($scope.selected.rooms, function(room, index) {
          $scope.selected.rooms[index].adults = _.findWhere($scope.guestsOptions.adults, {
            value: urlRooms[index].adults
          });
          $scope.selected.rooms[index].children = _.findWhere($scope.guestsOptions.children, {
            value: urlRooms[index].children
          });
        });
      } else {
        _.each($scope.selected.rooms, function(room, index){
          $scope.selected.rooms[index].adults = _.findWhere($scope.guestsOptions.adults, {
            value: 1
          });
        });
      }
    };

    $scope.setChildrenOptions = function(options){
      var childrenOptions =  numberToListFilter([], settings.children.min, settings.children.max,
          // TODO: Localize
          {
            '1': '{} ' + options.child,
            'plural': '{} ' + options.children
          });
      $scope.guestsOptions.children = childrenOptions;
      $scope.selected.children = _.find($scope.guestsOptions.children, {
        value: parseInt(bookingService.getAPIParams(true).children, 10) || 0
      });
    };

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
