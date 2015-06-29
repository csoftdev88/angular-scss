'use strict';

angular.module('mobiusApp.directives.slugImg', [])

// TODO: Start using ng-min
  .directive('slugImg', function(Settings) {
    return {
      restrict: 'E',
      scope: {
        slug: '=',
        width: '=',
        height: '=',
        alt: '='
      },
      replace: true,
      templateUrl: 'directives/slugImg/slugImg.html',

      // Widget logic goes here
      link: function(scope, element, attrs) {
        scope.src = '';
        var slugUnWatch = scope.$watch(
          function() {
            return scope.slug;
          },
          function(slug) {
            if(slug) {
              scope.src = Settings.UI.cloudinary.prefix + slug + Settings.UI.cloudinary.suffix;

              if (attrs.width && attrs.height) {
                var replaceString = 'w_' + attrs.width + ',h_' + attrs.height + ',c_fit';
                var inputParts = scope.src.split('/');
                inputParts.splice(6, 0, replaceString);
                scope.src = inputParts.join('/');
              }
            } else {
              scope.src = '';
            }
          }
        );
        scope.$on('$destroy', function(){
          slugUnWatch();
        });
      }
    };
  });
