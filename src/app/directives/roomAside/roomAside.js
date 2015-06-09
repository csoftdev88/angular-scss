'use strict';

angular.module('mobiusApp.directives.room.aside', [])

.directive('roomAside', function(){
  return {
    restrict: 'E',
    templateUrl: 'directives/roomAside/roomAside.html',

    // Widget logic goes here
    link: function(scope){
      scope.ad = '//placehold.it/210x395';
    }
  };
});
