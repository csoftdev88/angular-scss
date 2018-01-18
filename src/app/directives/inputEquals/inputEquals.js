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
        myValue = myValue === undefined ? '' : myValue;
        otherValue = otherValue === undefined ? '' : otherValue;
        if (myValue.toLowerCase() === otherValue.toLowerCase()) {
          ngModel.$setValidity('equals', true);
          return myValue;
        } else {
          ngModel.$setValidity('equals', false);
          return undefined;
        }
      }

      var unWatchEquals = scope.$watch('equals', function(otherModelValue) {
        validate(ngModel.$viewValue, otherModelValue);
      });
      scope.$on('$destroy', function(){
        unWatchEquals();
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
