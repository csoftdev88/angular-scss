'use strict';

/**
 * Directive built on the top of jquery datapicker widget
 * for range data selection.
 */

angular.module('mobiusApp.directives.datepicker', [])

.directive('rangeDatepicker', function($window, $filter) {
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
      var DATES_SEPARATOR = ' ';
      var CLASS_DATE_SELECTED = 'date-range-selected';
      var CLASS_RANGE_START = 'date-range-start';
      var CLASS_RANGE_END = 'date-range-end';

      var startDate, endDate;
      var rangeSelection = attrs.rangeSelection === '1';
      var maxDate = attrs.maxDate || null;
      var hasCounter = attrs.includeCounter === '1';

      var counterPluralizationRules;

      if(hasCounter){
        counterPluralizationRules = scope.$eval(attrs.counterPluralization) || {};
      }

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
        if(ngModelCtrl.$modelValue !== undefined) {
          // NOTE: using setHours(0) is safe for different timezones. By default
          // jquery date picker returns dates at 00 hour

          // TODO: use $parsers/$formates in case when dates should be presented not
          // as a string
          if(typeof(ngModelCtrl.$modelValue) === 'string'){
            var dates = ngModelCtrl.$modelValue.split(DATES_SEPARATOR);
            startDate = $window.moment(dates[0], 'YYYY MM DD').valueOf();
            endDate = dates.length === 2?$window.moment(dates[1], 'YYYY MM DD').valueOf():startDate;
          }
        }

        if(hasCounter){
          updateButtonPane('data-counter', getCounterText());
        }

        updateButtonPane('data-title', scope.paneTitle);
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
          showButtonPanel: hasCounter,
          maxDate: maxDate,
          numberOfMonths: 1,
          showOtherMonths: true,
          selectOtherMonths: true,
          minDate: 0,
          closeText: 'Continue',

          beforeShowDay: function ( date ) {
            return [
              !isSelected(date),
              getDateClass( date )
            ];
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
          },

          onSelect: function(date, inst) {
            if(!rangeSelection) {
              return;
            }

            startDate = endDate;
            endDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();

            if(hasCounter){
              updateButtonPane('data-counter', getCounterText());
            }

            updateButtonPane('data-title', scope.paneTitle);
          }
        }).datepicker('show');
      });

      function setInputText() {
        var diff;

        if(!startDate || !endDate){
          diff = 0;
        }else{
          diff = Math.abs($window.moment(startDate).diff(endDate, 'days'));
        }

        if(diff) {
          scope.inputText = window.moment(startDate).format('Do of MMM') + ' (' + $filter('pluralization')(diff, counterPluralizationRules) + ')';
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
        var diff;

        if(!startDate || !endDate){
          diff = 0;
        }else{
          diff = Math.abs($window.moment(startDate).diff(endDate, 'days'));
        }

        return $filter('pluralization')(diff, counterPluralizationRules);
      }

      // Checking if date is already selected as range starting/ending date
      function isSelected(date) {
        return startDate && !$window.moment(date).diff(startDate) || endDate && !$window.moment(date).diff(endDate);
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
          return CLASS_RANGE_END + highlightClasses;
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

      scope.$on('$destroy', function(){
        unWatchHiglights();
        unWatchModelValue();
      });
    }
  };
});
