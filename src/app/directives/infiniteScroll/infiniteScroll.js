'use strict';

angular.module('mobiusApp.directives.infiniteScroll', [])

.directive('infiniteScroll', function($window, _, scrollService){
  var EVENT_SCROLL = 'scroll';
  var DEFAULT_DEBOUNCE_DELAY = 100;

  return {
    restrict: 'A',
    scope: {
      infiniteScroll: '&',
      threshold: '='
    },

    link: function(scope, elem) {
      var container = angular.element($window);
      elem = angular.element(elem);
      scope.threshold = parseInt(scope.threshold, 10) || 0;

      var onScrollDebounced = _.debounce(function(){
        var scrollTop = scrollService.getScrollTop();

        // Checking if scrolled to the bottom of the element
        // within viewport
        var elemBottom = elem.offset().top + elem.height();

        if(scrollTop > elemBottom - container.height() - scope.threshold){
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
