'use strict';

/**
 * Directive built on the top of jquery datapicker widget
 * for range data selection.
 */

angular.module('mobiusApp.directives.datepicker', [])

.directive('rangeDatepicker', function($window, $filter, $rootScope, $timeout, stateService, Settings, _) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      highlights: '=',
      inputText: '=',
      paneTitle: '='
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      var DATE_FORMAT = 'yy-mm-dd';
      var DATES_SEPARATOR = '_';
      var CLASS_DATE_SELECTED = 'date-range-selected';
      var CLASS_RANGE_START = 'date-range-start';
      var CLASS_RANGE_END = 'date-range-end';
      var CLASS_EDIT_RANGE = 'date-range-edit';
      var CLASS_DATE_UNAVAILABLE = 'date-unavailable';
      var CLASS_DATE_PARTIALLY_AVAILABLE = 'date-partially-available';

      var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
      var resizeUnbindHandler;

      var originalWidth = $window.innerWidth;

      var startDate, endDate;
      var rangeSelection = attrs.rangeSelection === '1';
      var forceEndDate = attrs.forceEndDate ? attrs.forceEndDate : false;

      var maxDate = null;
      if(Settings.UI.bookingWidget.searchOffset.enable){
        maxDate = Settings.UI.bookingWidget.searchOffset.days;
      }

      var hasCounter = Settings.UI.bookingWidget.datePickerHasCounter;
      var counterHasDates = Settings.UI.bookingWidget.datePickerCounterIncludeDates;
      var editDateRangeInProgress = false;

      var counterPluralizationRules;
      var isStartDateSelected;
      var counterDatesRules;

      if(hasCounter){
        counterPluralizationRules = scope.$eval(attrs.counterPluralization) || {};
      }
      if(counterHasDates){
        counterDatesRules = scope.$eval(attrs.counterDates) || {};
      }

      //stop event bubbling from that container to avoid clicks behing the datepicker
      angular.element(document).ready(function () {
        $('#ui-datepicker-div').click( function(event) {
          event.stopPropagation();
        });
      });

      scope.availabilityOverview = [
        {
          'date': '2016-11-01',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-02',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-03',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-04',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-05',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-06',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-07',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-08',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-09',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-10',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-11',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-12',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-13',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-14',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-15',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-16',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-17',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-18',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-19',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-20',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 173.75,
          'description': ''
        },
        {
          'date': '2016-11-21',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-22',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-23',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-24',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-25',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-26',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-27',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-28',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-29',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-11-30',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-01',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-02',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-03',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-04',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-05',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-06',
          'available': false,
          'fullyAvailable': false,
          'priceFrom': null,
          'description': ''
        },
        {
          'date': '2016-12-07',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-08',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-09',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Minimum 3 Night stay if arriving on this day'
        },
        {
          'date': '2016-12-10',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Minimum 3 Night stay if arriving on this day'
        },
        {
          'date': '2016-12-11',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Minimum 3 Night stay if arriving on this day'
        },
        {
          'date': '2016-12-12',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Minimum 3 Night stay if arriving on this day'
        },
        {
          'date': '2016-12-13',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-14',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Number of occupants must be exactly 5'
        },
        {
          'date': '2016-12-15',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Number of occupants must be exactly 5'
        },
        {
          'date': '2016-12-16',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Number of occupants must be exactly 5'
        },
        {
          'date': '2016-12-17',
          'available': true,
          'fullyAvailable': false,
          'priceFrom': 121.63,
          'description': 'Number of occupants must be exactly 5'
        },
        {
          'date': '2016-12-18',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-19',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-20',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-21',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-22',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-23',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-24',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-25',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-26',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-27',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-28',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-29',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-30',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 121.63,
          'description': ''
        },
        {
          'date': '2016-12-31',
          'available': true,
          'fullyAvailable': true,
          'priceFrom': 169.76,
          'description': ''
        }
      ];


      /**
       * Don't hide the date picker when changing dates
       */
      function selectDateOverride(id, dateStr) {
        /*jshint validthis:true */
        var inst = this._getInst($(id)[0]);
        inst.inline = true;
        /*jshint validthis:true */
        $.datepicker._selectDateOverload(id, dateStr);
        inst.inline = false;
        this._updateDatepicker(inst);
      }

      function beforeShow() {
        // NOTE: using setHours(0) is safe for different timezones. By default
        // jquery date picker returns dates at 00 hour

        if (ngModelCtrl.$modelValue !== undefined && ngModelCtrl.$modelValue !== '') {
          // TODO: use $parsers/$formates in case when dates should be presented not
          // as a string
          if (typeof(ngModelCtrl.$modelValue) === 'string') {
            var dates = ngModelCtrl.$modelValue.split(DATES_SEPARATOR);
            startDate = $window.moment(dates[0], 'YYYY MM DD').valueOf();
            endDate = dates.length === 2 ? $window.moment(dates[1], 'YYYY MM DD').valueOf() : startDate;
            var parsedDate = $.datepicker.parseDate(DATE_FORMAT, dates[0]);
            $(element).datepicker('setDate', parsedDate);
          }
        }

        if (hasCounter) {
          updateButtonPane('data-counter', getCounterText());
        }

        updateButtonPane('data-title', scope.paneTitle);
        isStartDateSelected = false;
      }

      // Multi input fields support
      element.bind('focus', function(){
        // For some reason extend widget factory doesnt work for datepicker
        // so I'm overriding the method directly
        if(rangeSelection) {
          // Check if function was overrided already
          if($.datepicker._selectDateOverload === undefined) {
            $.datepicker._selectDateOverload = $.datepicker._selectDate;
          }
          // Overriding original function
          $.datepicker._selectDate = selectDateOverride;
        } else {
          if($.datepicker._selectDateOverload !== undefined) {
            $.datepicker._selectDate = $.datepicker._selectDateOverload;
          }
        }

        bindResizeListener();

        //NOTE: for languages to work, you must download the corresponding lang file from https://github.com/jquery/jquery-ui/tree/master/ui/i18n and include it in vendors/jquery-ui/datepicker-translations/ - then update the build.config.js accordingly
        element.datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: DATE_FORMAT,
          showButtonPanel: hasCounter,
          maxDate: maxDate,
          numberOfMonths: stateService.isMobile() ? 1 : Settings.UI.bookingWidget.datePickerNumberOfMonths,
          showOtherMonths: true,
          selectOtherMonths: true,
          minDate: 0,
          closeText: attrs.closeButtonText,
          showAnim: '',
          duration: 0,

          beforeShowDay: function ( date ) {
            var formattedDate = $window.moment(date).format('YYYY-MM-DD');
            var dayAvailability = _.find(scope.availabilityOverview, function(availability){
              return availability.date === formattedDate;
            });

            $rootScope.$broadcast('DATE_PICKER_BEFORE_SHOW_DAY', date);

            if(dayAvailability)
            {
              return [
                !isSelected(date),
                getDateClass(date, dayAvailability),
                $filter('i18nCurrency')(dayAvailability.priceFrom, $rootScope.currencyCode)
              ];
            }
            else {
              return [
                !isSelected(date),
                getDateClass(date)
              ];
            }
          },
          onChangeMonthYear:function(y, m, i){
            $timeout(function(){
              console.log('month changed');
              $rootScope.$broadcast('DATE_PICKER_MONTH_CHANGED', i);
            });
          },

          beforeShow: beforeShow,

          onClose: function(date) {
            if(!isValid()){
              // Do not update model
              return;
            }

            if(isNaN(startDate) && !isNaN(endDate)){
              startDate = endDate;
            }

            if(isNaN(startDate) && isNaN(endDate)){
              date = null;
            } else if(rangeSelection) {
              // In case when selecting the range days must be different
              if(startDate === endDate){
                endDate = $window.moment(endDate).add(1, 'day').valueOf();
              }
              date = {
                startDate: $.datepicker.formatDate( DATE_FORMAT, new Date(Math.min(startDate,endDate)), {}),
                endDate: $.datepicker.formatDate( DATE_FORMAT, new Date(Math.max(startDate,endDate)), {})
              };
            }

            // Update model
            scope.$apply(function() {
              if(date){
                ngModelCtrl.$setViewValue(date.startDate + DATES_SEPARATOR + date.endDate);
              }else{
                ngModelCtrl.$setViewValue('');
              }

              ngModelCtrl.$render();
            });

            if(resizeUnbindHandler){
              resizeUnbindHandler();
              resizeUnbindHandler = null;
            }
          },

          onSelect: function(date, inst) {
            if(!rangeSelection) {
              return;
            }

            var selectedDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();

            if(isStartDateSelected){
              // Selecting endDate;
              if(selectedDate > startDate){
                endDate = selectedDate;
                if(Settings.UI.bookingWidget.datePickerCloseOnDatesSelected && !stateService.isMobile()){
                  element.datepicker('hide');
                }
              }else{
                // Reversing the selection back
                endDate = startDate;
                startDate = selectedDate;
              }
            }else{
              // Selecting start/end date
              startDate = selectedDate;
              //If force end date is set to true in config, force an end date on the calendar
              endDate = forceEndDate ? $window.moment(startDate).add(1, 'day').valueOf() : startDate;
            }

            if(hasCounter){
              updateButtonPane('data-counter', getCounterText());
            }

            updateButtonPane('data-title', scope.paneTitle);

            isStartDateSelected = !isStartDateSelected;

          }
        })).datepicker('show');
      });

      function getDaysBetween(startDate, endDate) {
        if (!startDate || !endDate) {
          return 0;
        } else {
          return Math.abs($window.moment(startDate).diff(endDate, 'days'));
        }
      }

      function setInputText() {
        var diff = getDaysBetween(startDate, endDate);
        if(diff) {
          //scope.inputText = window.moment(startDate).format('Do of MMM') + ' (' + $filter('pluralization')(diff, counterPluralizationRules) + ')';
          scope.inputText = window.moment(startDate).format('MMM Do') + ' - ' + window.moment(endDate).format('MMM Do');
        } else {
          scope.inputText = '';
        }
      }

      function updateButtonPane(attribute, value){
        $window._.defer(function(){
          var buttonPane = $( element )
            .datepicker( 'widget' )
            .find( '.ui-datepicker-buttonpane' );

          buttonPane.attr( attribute, value );
        });
      }

      function getCounterText(){
        //days
        var diff = getDaysBetween(startDate, endDate);

        //dates
        if(counterHasDates && diff > 0 && !stateService.isMobile()){
          var dateStr = '';
          dateStr += counterDatesRules['0'].replace('{date}', window.moment(startDate).format('DD MMM YYYY'));
          dateStr += ' | ' + counterDatesRules['1'].replace('{date}', window.moment(endDate).format('DD MMM YYYY')) + ' | ';
          return dateStr + $filter('pluralization')(diff, counterPluralizationRules);
        }
        else{
          return $filter('pluralization')(diff, counterPluralizationRules);
        }
      }

      // Checking if date is already selected (start date only)
      // This applies only for start date selection
      function isSelected(date) {
        if(isStartDateSelected){
          return startDate && !$window.moment(date).diff(startDate);
        }else{
          return endDate && !$window.moment(date).diff(endDate);
        }
      }

      // Check if date selection is valid
      function isValid() {
        if(startDate!==undefined && startDate === '') {
          return false;
        }

        if(rangeSelection && endDate!==undefined && endDate === ''){
          return false;
        }

        return true;
      }

      function getDateClass(date, dayAvailability) {
        var dateTime = date.getTime();

        // Classes to be appended to an element which represents the date
        var highlightClasses = '';
        var availabilityClasses = '';

        if(dayAvailability) {
          if(!dayAvailability.available) {
            availabilityClasses = ' ' + CLASS_DATE_UNAVAILABLE;
          }
          else if(!dayAvailability.fullyAvailable) {
            availabilityClasses = ' ' + CLASS_DATE_PARTIALLY_AVAILABLE;
          }
        }

        if(scope.highlights){
          // Formating the date so we can find it in highlights object
          var formatedDate = $.datepicker.formatDate(DATE_FORMAT, date);
          if(scope.highlights[formatedDate]){
            highlightClasses = ' ' + scope.highlights[formatedDate];
          }
        }

        if(dateTime === startDate) {
          return CLASS_RANGE_START + highlightClasses + availabilityClasses;
        }else if(dateTime === endDate) {
          return CLASS_RANGE_END + highlightClasses + availabilityClasses + (editDateRangeInProgress ? ' ' + CLASS_EDIT_RANGE : '');
        }

        return ((dateTime > Math.min(startDate, endDate) &&
           dateTime < Math.max(startDate, endDate))?CLASS_DATE_SELECTED + highlightClasses + availabilityClasses: highlightClasses + availabilityClasses);
      }

      var unWatchHiglights = scope.$watch('highlights', function(){
        element.datepicker( 'refresh' );
      });

      var unWatchModelValue = scope.$watch(function(){
        return ngModelCtrl.$modelValue;
      }, function(){
        beforeShow();
        setInputText();
      });

      function bindResizeListener(){
        unbindResizeListener();

        resizeUnbindHandler = scope.$on(EVENT_VIEWPORT_RESIZE, function(){
          if(resizeUnbindHandler){
            var width = $window.innerWidth;
            if(originalWidth !== width)
            {
              element.datepicker('hide');
            }
          }
        });
      }

      function unbindResizeListener(){
        if(resizeUnbindHandler){
          resizeUnbindHandler();
          resizeUnbindHandler = null;
        }
      }

      scope.$on('$destroy', function(){
        unWatchHiglights();
        unWatchModelValue();
      });
    }
  };
});
