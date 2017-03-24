'use strict';

angular.module('mobiusApp.directives.sectionImage', [])
  .directive('sectionImage', [
    function() { 
      return {
        restrict: 'E',
        scope: {
          from: '=',
          to: '=',
          when: '=',
          section: '='
        },
        templateUrl: 'directives/sectionImage/sectionImage.html',
        link: function(scope) {
          console.log(scope);
        }
      };
    }
  ]);
