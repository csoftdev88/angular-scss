'use strict';

/**
 * Directive that validates the credit card number
 */
angular.module('mobiusApp.directives.creditCardCheck', [])

  .directive('creditCardCheck', function(creditCardTypeService) {
    return {
      require: 'ngModel',
      restrict: 'A',
      // Validation logic
      link: function(scope, elem, attrs, ctrl) {

        ctrl.$formatters.push(function(modelValue) {
          var viewValue = '';
          modelValue = creditCardTypeService.normalizeCreditCardNumber(modelValue);

          for (var i = 0; i < modelValue.length; i++) {
            if ((i > 0) && (i % 4 === 0)) {
              viewValue += '-';
            }
            viewValue += modelValue[i];
          }

          return viewValue;
        });

        ctrl.$parsers.push(creditCardTypeService.normalizeCreditCardNumber);

        ctrl.$validators.creditCardCheck = function(modelValue, viewValue) {
          return !!creditCardTypeService.getCreditCardDetails(viewValue);
        };
      }
    };
  });
