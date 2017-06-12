'use strict';

/**
 * Directive
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.subNav', [])
    .directive('subNav', ['Settings', '$log', SubNav]);

  function SubNav(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/subNav/subNav.html',
      link: function (scope, elem, attrs) {
        var config = Settings.UI.subNav;
        if (!config) {
          $log.warn('No config for the subNav was provided!');
        }
        if (attrs.links) {
          $log.warn('No links for the subNav was provided!');
        }
        scope.links = JSON.parse(attrs.links);
      }
    };
  }
}());


