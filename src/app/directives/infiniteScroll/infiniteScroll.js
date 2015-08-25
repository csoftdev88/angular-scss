'use strict';

angular.module('mobiusApp.directives.infiniteScroll', [])

.directive('infiniteScroll', function($window, _, scrollService){
  var EVENT_SCROLL = 'scroll';
  var DEFAULT_DEBOUNCE_DELAY = 250;

  return {
    restrict: 'A',
    scope: {
      infiniteScroll: '&'
    },

    link: function(scope, elem) {
      var container = angular.element($window);
      var lastScrollPosition = 0;

      elem = angular.element(elem);

      var onScrollDebounced = _.debounce(function(){
        var scrollTop = scrollService.getScrollTop();
        if(lastScrollPosition >= scrollTop){
          return;
        }

        // Checking if scrolled to the bottom of the element
        // within viewport
        var elemBottom = elem.offset().top + elem.height();

        if(scrollTop > elemBottom - container.height()){
          lastScrollPosition = scrollTop;

          scope.$evalAsync(scope.infiniteScroll());
        }
      }, DEFAULT_DEBOUNCE_DELAY);

      container.bind(EVENT_SCROLL, onScrollDebounced);

      scope.$on('$destroy', function(){
        container.unbind(EVENT_SCROLL, onScrollDebounced);
      });
    }
  };
});
