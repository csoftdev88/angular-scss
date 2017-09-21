'use strict';

angular.module('mobiusApp.directives.stickable', [])

  .directive('stickable', function ($window, stateService) {
    var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
    var EVENT_SCROLL = 'scroll';

    return {
      link: function (scope, elem, attr) {
        var STICKABLE_Z_INDEX = 995;
        var $$window = angular.element($window);
        var growlAlerts = $('growl-alerts');

        var previousScrollTop;
        var originalTop = null;
        var stickToHeight = null;
        var elementHeight = null;
        var nextMarginTop = null;
        var stuck = false;

        var isMobile = stateService.isMobile();

        scope.$on(EVENT_VIEWPORT_RESIZE, function(){
          isMobile = stateService.isMobile();
        });

        function onScroll() {
          if (isMobile) {
            return;
          }

          var scrollTop = $$window.scrollTop();
          if (scrollTop === previousScrollTop) {
            return;
          }

          previousScrollTop = scrollTop;

          if (stickToHeight === null) {
            var elementToStick = $('#' + attr.stickable);
            stickToHeight = elementToStick.outerHeight();
          }
          if (originalTop === null) {
            originalTop = elem.offset().top;
          }
          if (elementHeight === null) {
            elementHeight = elem.outerHeight();
          }
          var nextEl = elem.next();
          if (nextMarginTop === null) {
            nextMarginTop = nextEl.css('margin-top');
            if (nextMarginTop === 'auto') {
              nextMarginTop = 0;
            } else {
              nextMarginTop = parseInt(nextMarginTop, 10);
            }
          }

          if (!stuck) {
            if (scrollTop + stickToHeight > originalTop) {
              elem.css('position', 'fixed');
              elem.css('top', stickToHeight);
              elem.css('z-index', STICKABLE_Z_INDEX);
              elem.addClass('sticky');
              $('body').addClass('sticky-bread');

              // compensate for the element's removal from the layout
              nextEl.css('margin-top', (nextMarginTop + elementHeight) + 'px');
              if (growlAlerts.length) {
                growlAlerts.removeClass('hidden');
              }

              stuck = true;
            }
            return;
          }

          if (scrollTop + stickToHeight <= originalTop) {
            elem.next().css('margin-top', '');
            elem.css('position', '');
            elem.css('top', '');
            elem.css('z-index', '');
            elem.removeClass('sticky');
            $('body').removeClass('sticky-bread');
            if (growlAlerts.length) {
              growlAlerts.addClass('hidden');
            }
            stuck = false;
          }
        }

        $$window.bind(EVENT_SCROLL, onScroll);

        scope.$on('$destroy', function() {
          $$window.unbind(EVENT_SCROLL, onScroll);
        });
      }
    };
  });
