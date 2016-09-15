'use strict';

angular.module('mobiusApp.directives.hoverTrigger', [])

.directive('hoverTrigger', function(){
  var EVENT_MOUSEOVER = 'mouseover';
  var EVENT_MOUSEOUT = 'mouseout';

  return {
    scope: {
      hoverTrigger: '&',
      triggerDelay: '='
    },
    restrict: 'A',
    link: function(scope, elem) {
      if(!scope.triggerDelay){
        return;
      }

      var timerId;

      function onMouseover(){
        cancelTimer();

        timerId = setTimeout(function(){
          scope.hoverTrigger();
        }, parseInt(scope.triggerDelay, 10) || 0);
      }

      function onMouseout(){
        cancelTimer();
      }

      function cancelTimer(){
        if(timerId){
          clearTimeout(timerId);
        }
      }

      elem.bind(EVENT_MOUSEOUT, onMouseout);
      elem.bind(EVENT_MOUSEOVER, onMouseover);

      function unbindListeners(){
        elem.unbind(EVENT_MOUSEOUT, onMouseout);
        elem.unbind(EVENT_MOUSEOVER, onMouseover);
      }

      scope.$on('$destroy', function(){
        unbindListeners();
        cancelTimer();
      });
    }
  };
});