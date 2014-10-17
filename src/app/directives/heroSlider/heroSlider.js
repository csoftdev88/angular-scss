'use strict';

angular.module('mobiusApp.directives.slider', [])

.directive('heroSlider', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/heroSlider/heroSlider.html',

    // Widget logic goes here
    link: function(){
      //scope, elem, attrs
    }
  };
});
