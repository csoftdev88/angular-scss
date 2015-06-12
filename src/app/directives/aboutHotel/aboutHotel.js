'use strict';

angular.module('mobiusApp.directives.aboutHotel', [])

.directive('aboutHotel', function(Settings){
  return {
    restrict: 'E',
    templateUrl: 'directives/aboutHotel/aboutHotel.html',
    link: function(scope){
      scope.isCollapsed = true;
      scope.benefits = Settings.UI.aboutHotel.benefits;
    }
  };
});
