'use strict';

/**
 * Directive built on the top of jquery datapicker widget
 * for range data selection.
 */

angular.module('mobiusApp.directives.datepicker', [])

.directive('rangeDatepicker', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      highlights: '='
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      var DATE_FORMAT = 'yy-mm-dd';
      var DATES_SEPARATOR = ' ';
      var CLASS_DATE_SELECTED = 'date-range-selected';
      var CLASS_RANGE_START = 'date-range-start';
      var CLASS_RANGE_END = 'date-range-end';

      var startDate, endDate;
      var rangeSelection = attrs.rangeSelection === '1';
      var maxDate = attrs.maxDate || null;

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

        var clicksCount;

        element.datepicker({
          dateFormat: DATE_FORMAT,
          showButtonPanel: false,
          maxDate: maxDate,
          numberOfMonths: 1,
          showOtherMonths: true,
          selectOtherMonths: true,
          minDate: 0,

          beforeShowDay: function ( date ) {
            return [
              true,
              getDateClass( date )
            ];
          },

          beforeShow: function () {
            clicksCount = 0;

            if(ngModelCtrl.$modelValue !== undefined) {
              // NOTE: using setHours(0) is safe for different timezones. By default
              // jquery date picker returns dates at 00 hour

              // TODO: use $parsers/$formates in case when dates should be presented not
              // as a string
              if(typeof(ngModelCtrl.$modelValue) === 'string'){
                var dates = ngModelCtrl.$modelValue.split(DATES_SEPARATOR);
                startDate = new Date(dates[0]).setHours(0);

                if(dates.length === 2){
                  endDate = new Date(dates[1]).setHours(0);
                }else{
                  endDate = startDate;
                }
              }
            }
          },

          onClose: function(date) {
            if(!isValid()){
              // Do not update model
              return;
            }

            if(isNaN(startDate) && !isNaN(endDate)){
              startDate = endDate;
            }

            if(isNaN(startDate) && isNaN(endDate)){
              date = {
                startDate: '',
                endDate: ''
              };
            } else if(rangeSelection) {
              date = {
                startDate: $.datepicker.formatDate( DATE_FORMAT, new Date(Math.min(startDate,endDate)), {}),
                endDate: $.datepicker.formatDate( DATE_FORMAT, new Date(Math.max(startDate,endDate)), {})
              };
            }

            // Update model
            scope.$apply(function() {
              ngModelCtrl.$setViewValue(date.startDate + DATES_SEPARATOR + date.endDate);
              ngModelCtrl.$render();
            });

          },
          onSelect: function(date, inst) {
            if(!rangeSelection) {
              return;
            }

            startDate = endDate;
            endDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();

            clicksCount++;
            if(rangeSelection && clicksCount > 1){
              element.datepicker('hide');
            }

          }
        }).datepicker('show');
      });

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
          return CLASS_RANGE_END + highlightClasses;
        }

        return ((dateTime > Math.min(startDate, endDate) &&
           dateTime < Math.max(startDate, endDate))?CLASS_DATE_SELECTED + highlightClasses: highlightClasses);
      }

      scope.$watch('highlights', function(){
        element.datepicker( 'refresh' );
      });
    }
  };
});
