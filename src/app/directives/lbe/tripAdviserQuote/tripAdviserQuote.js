'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.tripAdviserQuote', [])
    .directive('tripAdviserQuote', ['Settings', '$log', TripAdviserQuote]);

  function TripAdviserQuote(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/tripAdviserQuote/tripAdviserQuote.html',
      link: function (scope) {
        var config = Settings.UI.hotelDetailsTestimonials;
        if (!config) {
          $log.warn('No config for the trip adviser quote directive was provided!');
        }
        scope.testimonial = config[0];
      }
    };
  }
}());

