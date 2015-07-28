'use strict';

/**
 * Directive for embedding the forms thru the data
 */
angular.module('mobiusApp.directives.bindUnsafe', [])

  .directive('bindUnsafe', function(){
    return {
      restrict: 'A',
      scope: {
        bindUnsafe: '='
      },
      // Validation logic
      link: function(scope, elem){
        scope.$watch('bindUnsafe', function(){
          elem.html = scope.bindUnsafe;
        });
      }
    };
  });
