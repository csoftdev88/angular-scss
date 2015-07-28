'use strict';

angular.module('mobiusApp.directives.stickable', [])

  .directive('stickable', function ($window) {
    return {
      link: function (scope, elem, attr) {
        var STICKABLE_Z_INDEX = 995;
        var windowEl = angular.element($window);
        var elementOffset = elem.offset().top;
        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        var isMobile = false;
        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
          isMobile = viewport.isMobile;
        });
        var handler = function () {
          if(isMobile){
            return;
          }
          scope.scroll = windowEl.scrollTop();
          var elementToStick = $('#' + attr.stickable);
          var elementToStickHeight = elementToStick.height();
          if (elementToStickHeight && (elementOffset - scope.scroll < elementToStickHeight)) {
            elem.next().css('margin-top', elem.height() * 2);
            elem.css('position', 'fixed');
            elem.css('top', elementToStickHeight);
            elem.css('z-index', STICKABLE_Z_INDEX);
          } else {
            elem.css('position', '');
            elem.css('top', '');
            elem.next().css('margin-top','');
          }
        };
        windowEl.on('scroll', scope.$apply.bind(scope, handler));
        handler();
      }
    };
  });
