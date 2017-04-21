'use strict';

angular.module('mobiusApp.directives.scrollPosition', [])
  .directive('scrollPosition', function($rootScope,$window, scrollService, _) {
    var EVENT_SCROLL = 'scroll';

    return {
      scope: {
        scroll: '=scrollPosition'
      },
      link: function(scope) {
        var $$window = angular.element($window);

        var onScrollDebounced = _.debounce(function(){
          var scrollTop = $$window.scrollTop();
          if(scrollTop !== scope.scroll){
            scope.$evalAsync(function(){
              scope.scroll = scrollTop;
              scrollService.scroll = scrollTop;
            });
          }
        }, 50);

        onScrollDebounced();

        $$window.bind(EVENT_SCROLL, onScrollDebounced);

        scope.$on('$destroy', function(){
          $$window.unbind(EVENT_SCROLL, onScrollDebounced);
        });
      }
    };
  })
;
