'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.recommendation', [])
    .directive('recommendation', ['Settings', '$log', Recommendation]);

  function Recommendation(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/recommendation/recommendation.html',
      link: function (scope) {
        var config = Settings.UI.recommendation;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }
        scope.recommendation = {
          avatar: '/static/images/avatar.png',
          text: '20% off and a room upgrade, what more could I ask for!',
          name: 'Laura Sandoval',
          city: 'New York'
        };
      }
    };
  }
}());

