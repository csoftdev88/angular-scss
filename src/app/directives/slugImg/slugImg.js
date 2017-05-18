'use strict';

angular.module('mobiusApp.directives.slugImg', [])

// TODO: Start using ng-min
  .directive('slugImg', function(Settings) {
    return {
      restrict: 'E',
      scope: {
        slug: '=',
        chain: '=',
        width: '=',
        height: '=',
        type: '=',
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
          function(amenity) {
            if(amenity) {
              scope.src = Settings.UI.cloudinary['prefix-' + attrs.type].replace('{chainCode}', amenity.chainCode) + amenity.id + Settings.UI.cloudinary.suffix;
              // see http://cloudinary.com/documentation/image_transformations
              if (attrs.width) {
                var replaceString = 'w_' + attrs.width + ',c_limit';
                var inputParts = scope.src.split('/');
                // insert dimensions after /image/upload/q_auto,f_auto/
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
