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

        var clickCount;

        element.datepicker({
          dateFormat: DATE_FORMAT,
          showButtonPanel: false,
          maxDate: maxDate,
          numberOfMonths: 1,
          showOtherMonths: true,
          //showAnim: 'slideDown',

          beforeShowDay: function ( date ) {
            return [
              true,
              getDayClassName( date )
            ];
          },

          beforeShow: function () {
            clickCount = 0;

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
              ngModelCtrl.$render();
            });

          },
          onSelect: function(date, inst) {
            if(!rangeSelection) {
              return;
            }

            startDate = endDate;
            endDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();

            clickCount++;
            if(rangeSelection && clickCount > 1){
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

      function getDayClassName( date ) {
        var dateTime = date.getTime();

        if(dateTime === startDate) {
          return 'date-range-start';
        }else if(dateTime === endDate) {
          return 'date-range-end';
        }

        return ((dateTime > Math.min(startDate, endDate) &&
           dateTime < Math.max(startDate, endDate))?'date-range-selected' : '');
      }
    }
  };
});
