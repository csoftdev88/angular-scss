'use strict';

angular.module('mobiusApp.directives.room.aside', [])

.directive('roomAside', function(){
  console.log('roomAside');
  console.log('roomAside arguments', arguments);

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/roomAside/roomAside.html',

    // Widget logic goes here
    link: function(scope){
      scope.room = {};
      scope.room.charges = 89;
      scope.room.tax = 16.45;
      scope.room.total = 105.45;
      scope.ad = '//placehold.it/210x395';
      scope.currency = 'pound';
    }

  };
});
