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
    link: function(scope, element, attrs, ngModelCtrl) {
      var DATE_FORMAT = 'yy-mm-dd';
      var startDate, endDate;
      var rangeSelection = attrs.rangeSelection === '1';
      var maxDate = attrs.maxDate || null;
      var numberOfMonths = rangeSelection?[ 1, 2 ]:null;
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

        element.datepicker({
          dateFormat: DATE_FORMAT,
          showButtonPanel: rangeSelection,
          maxDate: maxDate,
          numberOfMonths: numberOfMonths,
          beforeShowDay: function ( date ) {
            return [
              true,
              ((date.getTime() >= Math.min(startDate, endDate) &&
               date.getTime() <= Math.max(startDate, endDate))?'date-range-selected' : '')
            ];
          },

          beforeShow: function () {
            if(ngModelCtrl.$modelValue !== undefined) {
              // NOTE: using setHours(0) is safe for different timezones. By default
              // jquery date picker returns dates at 00 hour

              if(typeof(ngModelCtrl.$modelValue) === 'string'){
                startDate = new Date(ngModelCtrl.$modelValue).setHours(0);
                endDate = startDate;
              }else{
                startDate = new Date(ngModelCtrl.$modelValue.startDate).setHours(0);
                endDate = new Date(ngModelCtrl.$modelValue.endDate).setHours(0);
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
              ngModelCtrl.$setViewValue(date);
            });

          },
          onSelect: function(date, inst) {
            if(!rangeSelection) {
              return;
            }

            startDate = endDate;
            endDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
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
    }
  };
});
