'use strict';

/**
 * International tel number input
 */

angular.module('mobiusApp.directives.internationalTel', [])

.directive('internationalTel', function() {
  return {
    restrict: 'A',
    require: 'ngModel',

    link: function(scope, element) {
      element.intlTelInput();
    }
  };
});
