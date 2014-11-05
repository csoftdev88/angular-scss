'use strict';

angular.module('mobiusApp.directives.resize.watcher', [])

.directive('resizeWatcher', function($window, $document, $rootScope, Settings) {
  return {
    restrict: 'A',

    link: function(scope, elem){
      var $$window = angular.element($window);

      scope.updateViewport = function() {
        var MOBILE_CLASS = 'viewport-mobile',
            DESKTOP_CLASS = 'viewport-desktop',
            windowHeight = $window.innerHeight,
            windowWidth = $window.innerWidth,
            isMobile = windowWidth > Settings.UI.breakpoints.mobile ? false : true,
            isPortrait = windowWidth > windowHeight ? false : true;

        if (isMobile){
          elem.addClass(MOBILE_CLASS)
            .removeClass(DESKTOP_CLASS);
        }

        // Not using else statement because of possible need for
        // non-binary states in future
        if (!isMobile){
          elem.addClass(DESKTOP_CLASS)
            .removeClass(MOBILE_CLASS);
        }

        // Emit event and send vieport data as payload
        scope.$broadcast('viewport:resize', {
          mobile: isMobile,
          desktop: !isMobile,
          portrait: isPortrait,
          landscape: !isPortrait
        });
      };

      // Bind handler on window resize event
      $$window.bind('resize', scope.updateViewport);

      // Initialize viewport after document is loaded
      $document.ready(scope.updateViewport);

      // Cleanup listeners when destroyed
      scope.$on('$destroy', function(){
        $$window.unbind('resize');
      });
    }
  };
});
