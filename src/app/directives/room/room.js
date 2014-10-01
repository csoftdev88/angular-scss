'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/room/room.html',

    // Widget logic goes here
    link: function(scope){
      scope.room = {};
      scope.room.description = 'am eu ipsum ac metus sagittis pellentesque id ut magna. Nunc in nibh nibh. Morbi nec turpis at est pretium fermentum. Praesent a condimentum leo. Aenean egestas leo ac enim consequat tincidunt jes. Ut et purus leo. Suspendisse potenti. Class aptent taciti sociosqu ad litora torquent.';
      scope.room.name = "Deluxe Double Room";

      scope.amenities = [
        {name: '', icon: ''},
        {name: '', icon: ''},
        {name: '', icon: ''},
        {name: '', icon: ''},
        {name: '', icon: ''}
      ];

      scope.prices = [
        79, 89, 119, 139
      ];
    }
  };
});
