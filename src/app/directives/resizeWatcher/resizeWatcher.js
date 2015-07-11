'use strict';

angular.module('mobiusApp.directives.resize.watcher', [])

.directive('resizeWatcher', function($window, $document, $rootScope, Settings) {
  return {
    restrict: 'A',

    link: function(scope, elem){
      var $$window = angular.element($window);

      function updateView() {
        var MOBILE_CLASS = 'viewport-mobile',
            DESKTOP_CLASS = 'viewport-desktop',
            windowHeight = $window.innerHeight,
            windowWidth = $window.innerWidth,
            isMobile = windowWidth <= Settings.UI.screenTypes.mobile.maxWidth,
            isPortrait = windowWidth <= windowHeight;

        elem.toggleClass(MOBILE_CLASS, isMobile).toggleClass(DESKTOP_CLASS, !isMobile);

        // Emit event and send vieport data as payload
        scope.$broadcast('viewport:resize', {
          isMobile: isMobile,
          isPortrait: isPortrait
        });
      }

      // Listening on resize event to calculate new values
      $$window.bind('resize', updateView);

      $document.ready(updateView);

      // Cleanup listeners when destroyed
      scope.$on('$destroy', function(){
        $$window.unbind('resize');
      });
    }
  };
});
