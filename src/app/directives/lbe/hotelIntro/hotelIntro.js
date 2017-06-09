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
      link: function () {
        // Get the config for the hotel info
        var config = Settings.UI.hotelInfo;
        if (!config) {
          $log.warn('No config for the hotel-info directive was provided!');
        }
      }
    };
  }
}());

