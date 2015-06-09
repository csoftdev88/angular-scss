'use strict';

/**
 * Directive that validates the credit card number
 * http://en.wikipedia.org/wiki/Luhn_algorithm
 */

angular.module('mobiusApp.directives.luhnCheck', [])

.directive('luhnCheck', function(){
  return {
    require: 'ngModel',
    restrict: 'A',
    // Validation logic
    link: function(scope, elem, attrs, ctrl){

      ctrl.$validators.luhnCheck = function(modelValue, viewValue) {

        if (/[^0-9-\s]+/.test(viewValue)) {
          return false;
        }

        // The Luhn Algorithm.
        var nCheck = 0, nDigit = 0, bEven = false;
        viewValue = viewValue.replace(/\D/g, '');

        for (var n = viewValue.length - 1; n >= 0; n--) {
          var cDigit = viewValue.charAt(n);
          nDigit = parseInt(cDigit, 10);

          if (bEven) {
            if ((nDigit *= 2) > 9) {
              nDigit -= 9;
            }
          }

          nCheck += nDigit;
          bEven = !bEven;
        }

        return (nCheck % 10) === 0;
      };
    }
  };
});
