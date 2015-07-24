'use strict';

angular.module('mobiusApp.directives.stickable', [])

  .directive('stickable', function ($window) {
    return {
      link: function (scope, elem, attr) {
        var STICKABLE_Z_INDEX = 995;
        var windowEl = angular.element($window);
        var elementOffset = elem.offset().top;
        var handler = function () {
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
