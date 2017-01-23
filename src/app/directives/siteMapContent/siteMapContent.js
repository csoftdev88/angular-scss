'use strict';

angular.module('mobiusApp.directives.siteMap', [])

  .directive('siteMapContent', function($controller, funnelRetentionService){
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

        scope.retentionClick = function(){
          funnelRetentionService.retentionCheck();
        };

        $controller('ContentCtr', {$scope: scope});
      }
    };
  });
