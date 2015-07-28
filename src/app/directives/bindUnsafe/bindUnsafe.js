'use strict';

/**
 * Directive for embedding the forms thru the data
 */
angular.module('mobiusApp.directives.bindUnsafe', [])

  .directive('bindUnsafe', function($compile){
    return {
      restrict: 'A',
      scope: {
        bindUnsafe: '='
      },
      link: function(scope, elem){
        var removeWatcher = scope.$watch('bindUnsafe', function(){
          var content = scope.bindUnsafe || '';
          elem.append($compile(content)(scope.$new()));
        });

        scope.$on('$destroy', function(){
          removeWatcher();
        });
      }
    };
  });
