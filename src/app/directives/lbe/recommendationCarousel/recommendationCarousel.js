'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.recommendationCarousel', [])
    .directive('recommendationCarousel', ['Settings', '$log', RecommendationCarousel]);

  function RecommendationCarousel(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/recommendationCarousel/recommendationCarousel.html',
      link: function (scope) {
        var config = Settings.UI.recommendationCarousel;
        if (!config) {
          $log.warn('No config for the recommendationCarousel was provided!');
        }
        scope.recommendationCarousel = config;
        scope.recommendationCarouselInterval = Settings.UI.recommendationCarouselInterval || 0;
      }
    };
  }
}());

