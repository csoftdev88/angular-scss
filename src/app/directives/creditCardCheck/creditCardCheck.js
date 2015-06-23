'use strict';

/**
 * Directive that validates the credit card number
 */
angular.module('mobiusApp.directives.creditCardCheck', [])

  .directive('creditCardCheck', function(creditCardTypeService){
    return {
      require: 'ngModel',
      restrict: 'A',
      // Validation logic
      link: function(scope, elem, attrs, ctrl){

        ctrl.$validators.creditCardCheck = function(modelValue, viewValue) {
          return !!creditCardTypeService.getCreditCardDetails(viewValue);
        };
      }
    };
  });
