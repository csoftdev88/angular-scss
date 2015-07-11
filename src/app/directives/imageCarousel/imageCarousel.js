'use strict';

angular.module('mobiusApp.directives.imageCarousel', [])

  .directive('imageCarousel', function(Settings) {
    return {
      restrict: 'E',
      scope: {
        images: '='
      },
      templateUrl: 'directives/imageCarousel/imageCarousel.html',

      // Widget logic goes here
      link: function(scope) {
        scope.settings = Settings.UI.imageCarousel;
        scope.selected = 0;
        scope.index = 0;

        scope.setSelected = function(index) {
          scope.selected = (scope.index + index) % scope.images.length;
        };

        scope.moveLeft = function() {
          scope.index = ((scope.index < 1) ? scope.images.length : scope.index) - 1;
        };

        scope.moveRight = function() {
          scope.index = (scope.index >= scope.images.length - 1) ? 0 : scope.index + 1;
        };

        scope.getCarousel = function(images) {
          images = images || [];

          if (images.length <= scope.settings.minImages) {
            return images;
          } else {
            var toEnd = images.slice(scope.index, scope.index + scope.settings.minImages);
            var fromStart = images.slice(0, scope.settings.minImages - toEnd.length);
            return toEnd.concat(fromStart);
          }
        };
      }
    };
  });
