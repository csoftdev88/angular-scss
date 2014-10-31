'use strict';

angular.module('mobiusApp.directives.resize', [])

.directive('resize', function($window) {
  return {
    restrict: 'A',

    link: function($scope, $element, $attrs){
      console.log($element, $attrs);
      $scope.breakpoint = parseInt($attrs.breakpoint, 10);

      $scope.initializeWindowSize = function() {
        $scope.windowHeight = $window.innerHeight;
        $scope.windowWidth = $window.innerWidth;

        $scope.mobile = $scope.windowWidth < $scope.breakpoint ? true : false;
        return $scope.mobile;
      };

      $scope.initializeWindowSize();

      return angular.element($window).bind('resize', function() {
        $scope.initializeWindowSize();
        return $scope.$apply();
      });
    }
  };
});
