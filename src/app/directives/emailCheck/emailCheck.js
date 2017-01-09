'use strict';

/**
 * Directive that validates the credit card number
 */
angular.module('mobiusApp.directives.emailCheck', [])

  .directive('emailCheck', function(){
    return {
      require: 'ngModel',
      restrict: 'A',
      // Validation logic
      link: function(scope, elem, attrs, ctrl){
        var emailPattern = /^$|^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        ctrl.$validators.emailCheck = function(modelValue, viewValue) {
          if(modelValue === undefined || viewValue === undefined)
          {
            return true;
          }
          return emailPattern.test(viewValue);
        };
      }
    };
  });
