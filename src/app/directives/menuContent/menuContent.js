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

      var states = {
        'hotels': ['hotel', 'hotels', 'room'],
        'news': ['news'],
        'offers': ['offers'],
        'about': ['aboutUs']
      };
      scope.isActive = function() {
        return _.some(states[attrs.menuContent], function(state) {
          return $state.includes(state);
        });
      };
    }
  };
});
