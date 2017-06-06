'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.highlight', [])
    .directive('highlight', ['Settings', '$log', Highlight]);

  function Highlight(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/highlight/highlight.html',
      transclude: true,
      link: function (scope) {
        var config = Settings.UI.highlight;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }
        scope.imageUrl = config.imageUrl;
      }
    };
  }
}());

