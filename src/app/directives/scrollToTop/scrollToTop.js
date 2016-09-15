'use strict';


/**
 * Directive scroll to top button
 */

angular.module('mobiusApp.directives.scrollToTop', [])

.directive('scrollToTop', function(){
  return {
    restrict: 'A',
    link: function(scope) {
      scope.scroll = 0;
    }
  };
});
