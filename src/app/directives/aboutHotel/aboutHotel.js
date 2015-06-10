'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
    }
  };
});
