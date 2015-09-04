'use strict';

angular.module('mobiusApp.directives.hoverTrigger', [])

.directive('hoverTrigger', function(){
  var EVENT_MOUSEOVER = 'mouseover';
  var EVENT_MOUSEOUT = 'mouseout';

  return {
    scope: {
      hoverTrigger: '=',
      triggerDelay: '='
    },
    restrict: 'A',
    link: function(scope, elem) {
      function onMouseover(){
        console.log('mouseover');
      }

      function onMouseout(){
        console.log('mouseout');
      }

      elem.bind(EVENT_MOUSEOUT, onMouseout);
      elem.bind(EVENT_MOUSEOVER, onMouseover);

      function unbindListeners(){
        elem.unbind(EVENT_MOUSEOUT, onMouseout);
        elem.unbind(EVENT_MOUSEOVER, onMouseover);
      }

      scope.$on('$destroy', function(){
        unbindListeners();
      });
    }
  };
});