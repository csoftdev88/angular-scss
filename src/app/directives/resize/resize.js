'use strict';

angular.module('mobiusApp.directives.resize', [])

.directive('resize', function($window, $rootScope, Settings) {
  return {
    restrict: 'A',

    link: function($scope, $element){
      var windowWidth, windowHeight,
          mobile, desktop,
          landscape, portrait;

      $scope.updateViewport = function() {
        windowHeight = $window.innerHeight;
        windowWidth = $window.innerWidth;

        portrait = windowWidth > windowHeight ? false : true;
        landscape = !portrait;

        mobile = windowWidth > Settings.UI.breakpoints.mobile ? false : true;
        desktop = !mobile;

        if (mobile){
          $element.addClass('viewport-mobile')
            .removeClass('viewport-desktop');
        }

        if (desktop){
          $element.addClass('viewport-desktop')
            .removeClass('viewport-mobile');
        }

        // Emit event and send vieport data as payload
        $scope.$broadcast('viewport:resize', {
          mobile: mobile,
          desktop: desktop,
          landscape: landscape,
          portrait: portrait
        });
      };

      // Bind handler on window resize event
      angular.element($window).bind('resize', $scope.updateViewport);

      // Initialize viewport after document is loaded
      angular.element(document).ready($scope.updateViewport);
    }
  };
});
