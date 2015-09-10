'use strict';

angular.module('mobiusApp.directives.siteMap', [])

  .directive('siteMapContent', function($controller){
    return {
      restrict: 'EA',
      scope: {
        limit: '='
      },
      templateUrl: 'directives/siteMapContent/siteMapContent.html',

      // Widget logic goes here
      link: function(scope, elem, attrs){
        scope.title = attrs.title;
        scope.item = attrs.siteMapContent;

        $controller('ContentCtr', {$scope: scope});
      }
    };
  });
