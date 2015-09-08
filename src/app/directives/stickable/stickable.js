'use strict';

angular.module('mobiusApp.directives.stickable', [])

  .directive('stickable', function ($window) {
    var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
    var EVENT_SCROLL = 'scroll';

    return {
      link: function (scope, elem, attr) {
        var STICKABLE_Z_INDEX = 995;
        var $$window = angular.element($window);
        var elementOffset = elem.offset().top;

        var isMobile = false;

        scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
          isMobile = viewport.isMobile;
        });

        function onScroll(){
          if(isMobile){
            return;
          }

          var scrollTop = $$window.scrollTop();
          if(scrollTop === scope.scroll){
            return;
          }

          var elementToStick = $('#' + attr.stickable);
          var elementToStickHeight = elementToStick.height();
          if (elementToStickHeight && (elementOffset - scrollTop < elementToStickHeight)) {
            elem.next().css('margin-top', elem.height() * 2);
            elem.css('position', 'fixed');
            elem.css('top', elementToStickHeight);
            elem.css('z-index', STICKABLE_Z_INDEX);
          } else {
            elem.css('position', '');
            elem.css('top', '');
            elem.next().css('margin-top','');
          }

          scope.$evalAsync(function(){
            scope.scroll = scrollTop;
          });
        }

        onScroll();

        $$window.bind(EVENT_SCROLL, onScroll);

        scope.$on('$destroy', function(){
          $$window.unbind(EVENT_SCROLL, onScroll);
        });
      }
    };
  });
