'use strict';

angular.module('mobiusApp.directives.stickable', [])

  .directive('stickable', function ($window, stateService) {
    var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
    var EVENT_SCROLL = 'scroll';

    return {
      link: function (scope, elem, attr) {
        // TODO: Same as in scrollTo, breadcrumbs directives
        // remove scope.scroll and dont use scope data binding
        // which is too slow on scroll events etc.
        var STICKABLE_Z_INDEX = 995;
        var $$window = angular.element($window);
        var elementOffset = elem.offset().top;

        var isMobile = stateService.isMobile();

        scope.$on(EVENT_VIEWPORT_RESIZE, function(){
          isMobile = stateService.isMobile();
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
          var elementToStickHeight = elementToStick.outerHeight();
          var growlAlerts = $('growl-alerts');

          if (elementToStickHeight && (elementOffset - scrollTop < elementToStickHeight)) {
            elem.next().css('margin-top', elem.height() * 2);
            elem.css('position', 'fixed');
            elem.css('top', elementToStickHeight);
            elem.css('z-index', STICKABLE_Z_INDEX);
            elem.addClass('sticky');
            $('body').addClass('sticky-bread');
            if(growlAlerts.length)
            {
              growlAlerts.removeClass('hidden');
            }
          } else {
            elem.css('position', '');
            elem.css('top', '');
            elem.next().css('margin-top','');
            elem.removeClass('sticky');
            $('body').removeClass('sticky-bread');
            if(growlAlerts.length)
            {
              growlAlerts.addClass('hidden');
            }
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
