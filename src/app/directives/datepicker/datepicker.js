'use strict';

/**
 * Directive built on the top of jquery datapicker widget
 * for range data selection.
 */

angular.module('mobiusApp.directives.datepicker', [])

.directive('rangeDatepicker', function($window, $filter, $rootScope, $timeout, stateService, Settings) {
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

        var today = new Date();
        console.log(today);
        var minDate = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').add(1, 'day').toDate();
        console.log(minDate);

        //NOTE: for languages to work, you must download the corresponding lang file from https://github.com/jquery/jquery-ui/tree/master/ui/i18n and include it in vendors/jquery-ui/datepicker-translations/ - then update the build.config.js accordingly
        element.datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
          dateFormat: DATE_FORMAT,
          showButtonPanel: hasCounter,
          maxDate: maxDate,
          numberOfMonths: stateService.isMobile() ? 1 : Settings.UI.bookingWidget.datePickerNumberOfMonths,
          showOtherMonths: true,
          selectOtherMonths: true,
          minDate: minDate,
          closeText: attrs.closeButtonText,
          showAnim: '',
          duration: 0,

          beforeShowDay: function ( date ) {

            $rootScope.$broadcast('DATE_PICKER_BEFORE_SHOW_DAY', date);

            return [
              !isSelected(date),
              getDateClass( date )
            ];
          },
          onChangeMonthYear:function(y, m, i){
            $timeout(function(){
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

      function getDateClass( date ) {
        var dateTime = date.getTime();

        // Classes to be appended to an element which represents the date
        var highlightClasses = '';

        if(scope.highlights){
          // Formating the date so we can find it in highlights object
          var formatedDate = $.datepicker.formatDate(DATE_FORMAT, date);
          if(scope.highlights[formatedDate]){
            highlightClasses = ' ' + scope.highlights[formatedDate];
          }
        }

        if(dateTime === startDate) {
          return CLASS_RANGE_START + highlightClasses;
        }else if(dateTime === endDate) {
          return CLASS_RANGE_END + highlightClasses + (editDateRangeInProgress ? ' ' + CLASS_EDIT_RANGE : '');
        }

        return ((dateTime > Math.min(startDate, endDate) &&
           dateTime < Math.max(startDate, endDate))?CLASS_DATE_SELECTED + highlightClasses: highlightClasses);
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
