'use strict';

angular.module('mobiusApp.directives.room.products', [])

.directive('roomProducts', function(){
  return {
    restrict: 'E',
    templateUrl: 'directives/roomProducts/roomProducts.html',
    scope: {
      roomCode: '=',
      propertyCode: '='
    },
    link: function(scope){
      console.log(scope.roomCode);
    }
  };
});
