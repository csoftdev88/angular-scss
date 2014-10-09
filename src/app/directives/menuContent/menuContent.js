'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function(){
  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(){
      //scope, elem, attrs
    }
  };
});
