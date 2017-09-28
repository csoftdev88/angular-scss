'use strict';

/**
 * Directive
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.tagline', [])
    .directive('tagline', ['Settings', '$log', Tagline]);

  function Tagline(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/tagline/tagline.html',
      link: function (scope, elem, attrs) {
        var config = Settings.UI.tagline;
        if (!config) {
          $log.warn('No config for the recommendation was provided!');
        }

        scope.showLogo = attrs.showLogo || config.showLogo;
        scope.text = attrs.text;
      }
    };
  }
}());


