'use strict';

/**
 * Directive to encapsulate the hotel info
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.hotelIntro', [])
    .directive('hotelIntro', ['Settings', '$log', HotelIntro]);

  function HotelIntro(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/hotelIntro/hotelIntro.html',
      link: function (scope) {
        // Get the config for the hotel info
        var config = Settings.UI.hotelIntro;
        if (!config) {
          $log.warn('No config for the hotel-intro directive was provided!');
          return;
        }
        scope.title = config.title;
        scope.highlight = config.highlight;
        scope.description = config.description;
      }
    };
  }
}());

