'use strict';

/**
 * Directive that validates the credit card number
 */
angular.module('mobiusApp.directives.creditCardCheck', [])

  .directive('creditCardCheck', function($browser, creditCardTypeService) {
    return {
      require: 'ngModel',
      restrict: 'A',
      // Validation logic
      link: function(scope, elem, attrs, ctrl) {
        ctrl.$formatters.push(function(modelValue) {
          return creditCardTypeService.formatCreditCardNumber(modelValue);
        });

        ctrl.$parsers.push(creditCardTypeService.normalizeCreditCardNumber);

        ctrl.$validators.creditCardCheck = function(modelValue, viewValue) {
          return !!creditCardTypeService.getCreditCardDetails(viewValue);
        };

        // View formating when changing input value
        function formatViewValue(){
          elem.val(creditCardTypeService.formatCreditCardNumber(ctrl.$viewValue));
        }

        elem.bind('change', function() {
          formatViewValue();
        });

        elem.bind('keydown', function(event) {
          var key = event.keyCode;
          // CTRL, SHIFT, ARROWS, META keys handling
          if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
            return;
          }
          $browser.defer(formatViewValue);
        });

        elem.bind('paste cut', function() {
          $browser.defer(formatViewValue);
        });
      }
    };
  });
