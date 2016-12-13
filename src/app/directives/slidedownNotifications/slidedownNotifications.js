'use strict';

angular.module('mobiusApp.directives.slidedownNotifications', [])
  .directive('slidedownNotifications', ['$rootScope','$location',
    function($rootScope, $location) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'directives/slidedownNotifications/slidedownNotifications.html',

        link: function(scope) {
          scope.goToCampaign = function() {
            $location.path($rootScope.campaign.uri);
          };
        }
      };
    }
  ]);
