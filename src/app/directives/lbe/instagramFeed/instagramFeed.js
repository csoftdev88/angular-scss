'use strict';

/**
 * Directive to encapsulate the instagram feed
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.instagramFeed', [])
    .directive('instagramFeed', ['Settings', '$log', InstagramFeed]);

  function InstagramFeed(Settings, $log) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/instagramFeed/instagramFeed.html',
      link: function (scope) {

        // Get the config for the instagram feed UI
        var config = Settings.UI.instagramFeed;
        if (!config) {
          $log.warn('No config for the questionnaire was provided!');
        }

        scope.images = config.images;
      }
    };
  }
}());

