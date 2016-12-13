'use strict';

angular.module('mobiusApp.directives.slidedownNotifications', [])
  .directive('slidedownNotifications', [
    function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'directives/slidedownNotifications/slidedownNotifications.html'
      };
    }
  ]);
