'use strict';

angular.module('mobiusApp.directives.resize.watcher', [])

.directive('resizeWatcher', function($window, $document, $rootScope, Settings) {
  return {
    restrict: 'A',

    link: function(scope, elem){
      var $$window = angular.element($window);

      function updateView() {
        // TODO: Use stateService for platform detection
        var MOBILE_CLASS = 'viewport-mobile',
            TABLET_CLASS = 'viewport-tablet',
            DESKTOP_CLASS = 'viewport-desktop',
            windowHeight = $window.innerHeight,
            windowWidth = $window.innerWidth,
            isMobile = windowWidth <= Settings.UI.screenTypes.mobile.maxWidth,
            isTablet = windowWidth <= Settings.UI.screenTypes.tablet.maxWidth && windowWidth > Settings.UI.screenTypes.mobile.maxWidth,
            isPortrait = windowWidth <= windowHeight;

        elem.toggleClass(MOBILE_CLASS, isMobile).toggleClass(DESKTOP_CLASS, !isMobile && !isTablet).toggleClass(TABLET_CLASS, isTablet);

        // Emit event and send vieport data as payload
        scope.$broadcast('viewport:resize', {
          isMobile: isMobile,
          isPortrait: isPortrait
        });

        angular.element('.swap-on-mobile').each(function(){
          var $this = angular.element(this);
          if(isMobile && !$this.hasClass('swapped')){
            $this.addClass('swapped');
            $this.insertBefore(angular.element('.swap-on-mobile-default'));
          }
          else if(!isMobile && $this.hasClass('swapped')){
            $this.removeClass('swapped');
            $this.insertAfter(angular.element('.swap-on-mobile-default'));
          }
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
