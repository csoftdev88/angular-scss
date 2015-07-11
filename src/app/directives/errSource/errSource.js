'use strict';

/**
 * Directive for displaying placeholder image when ng-src fails
 * to fetch the data
 */

angular.module('mobiusApp.directives.errSource', [])

.directive('errSource', function(){
  return {
    restrict: 'A',
    link: function(scope, elem, attrs){
      var EVENT_ERROR = 'error';

      elem.bind(EVENT_ERROR, function() {
        if (attrs.src !== attrs.errSource) {
          attrs.$set('src', attrs.errSource);
        }
      });
    }
  };
});
