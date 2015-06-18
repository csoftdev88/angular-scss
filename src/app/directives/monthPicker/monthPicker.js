'use strict';

/**
 * Directive built on the top of jquery datapicker widget
 * for month selection.
 */

angular.module('mobiusApp.directives.monthPicker', [])

.directive('monthPicker', function($window) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      var SELECTOR_CONTAINER = '#ui-datepicker-div';
      var SELECTOR_YEAR = '.ui-datepicker-year :selected';
      var SELECTOR_MONTH = '.ui-datepicker-month :selected';

      var CLASS_MONTH_PICKER = 'month-picker';

      var DATE_FORMAT = 'YYYY-MM';

      ngModelCtrl = ngModelCtrl;
      // Multi input fields support
      element.bind('focus', function(){
        element.datepicker({
          changeMonth: true,
          changeYear: true,
          showButtonPanel: true,
          dateFormat: DATE_FORMAT,
          showAnim: '',

          beforeShow: function() {
            toggleClass(true);
          },

          onClose: function() {
            var year = $window.$(SELECTOR_CONTAINER + ' ' + SELECTOR_YEAR).val();
            var month = $window.$(SELECTOR_CONTAINER + ' ' + SELECTOR_MONTH).val();

            var date = new Date(year, month, 1);

            // Update model
            scope.$apply(function() {
              if(date){
                ngModelCtrl.$setViewValue($window.moment(date).format(DATE_FORMAT));
              }else{
                ngModelCtrl.$setViewValue('');
              }

              ngModelCtrl.$render();
            });

            toggleClass(false);
          },
        }).datepicker('show');
      });

      function toggleClass(state){
        $window.$(SELECTOR_CONTAINER).toggleClass(CLASS_MONTH_PICKER, state);
      }
    }
  };
});
