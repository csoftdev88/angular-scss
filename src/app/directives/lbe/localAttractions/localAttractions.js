'use strict';

/**
 * Directive to encapsulate the local attractions
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.localAttractions', [])
    .directive('localAttractions', ['Settings', '$log', LocalAttractions]);

  function LocalAttractions(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/localAttractions/localAttractions.html',
      link: function (scope) {

        // Get the config for the instagram feed UI
        var config = Settings.UI.localAttractions;
        if (!config) {
          $log.warn('No config for the local attractions directive was provided!');
        }

        scope.dsfdf= '';

      }
    };
  }
}());

