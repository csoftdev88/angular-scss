'use strict';

angular.module('mobiusApp.directives.password', [])

.directive('passwordPattern', function(){
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      function validate(password) {
        if(!password) {
          return password;
        }
        var hasNumbers = /\d/.test(password);
        var hasSpecialSymbol = /\W/.test(password);
        if (password.length >= 8 && hasNumbers > 0 && hasSpecialSymbol > 0) {
          ngModel.$setValidity('complexity', true);
          return password;
        } else {
          ngModel.$setValidity('complexity', false);
          return undefined;
        }
      }

      ngModel.$parsers.unshift(function(viewValue) {
        return validate(viewValue);
      });

      ngModel.$formatters.unshift(function(modelValue) {
        return validate(modelValue);
      });
    }
  };
});
