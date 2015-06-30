'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function($controller, _, $state){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){

      scope.title = attrs.title;
      scope.item = attrs.menuContent;

      $controller('ContentCtr', {$scope: scope});

      scope.isActive = function() {
        return _.some(scope.settings.states, function(state) {
          return $state.includes(state);
        });
      };
    }
  };
});
