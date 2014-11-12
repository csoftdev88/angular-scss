'use strict';

angular.module('mobiusApp.directives.equals', [])

.directive('equals', function(){
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      equals: '='
    },
    link: function(scope, elem, attrs, ngModel) {
      function validate(myValue, otherValue) {
        if (myValue === otherValue) {
          ngModel.$setValidity('equals', true);
          return myValue;
        } else {
          ngModel.$setValidity('equals', false);
          return undefined;
        }
      }

      scope.$watch('equals', function(otherModelValue) {
        validate(ngModel.$viewValue, otherModelValue);
      });

      ngModel.$parsers.unshift(function(viewValue) {
        return validate(viewValue, scope.equals);
      });

      ngModel.$formatters.unshift(function(modelValue) {
        return validate(modelValue, scope.equals);
      });
    }
  };
});
