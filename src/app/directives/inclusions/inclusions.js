'use strict';

angular.module('mobiusApp.directives.inclusions', [])

.directive('inclusions', [function(){
  return {
    restrict: 'E',
    scope: {
      inclusions: '='
    },
    templateUrl: 'directives/inclusions/inclusions.html',
    replace: false,

    // Widget logic goes here
    link: function(scope){
      console.log(scope.inclusions);
    }
  };
}]);
