'use strict';

angular.module('mobiusApp.directives.hotelLocation', [])

// TODO: Start using ng-min
  .directive('hotelLocation', function() {
    return {
      restrict: 'E',
      scope: {
        hotelDetails: '='
      },
      templateUrl: 'directives/hotelLocation/hotelLocation.html',

      // Widget logic goes here
      link: function(scope) {
        var locationUnWatch = scope.$watch('hotelDetails', function(details) {
          if (angular.isDefined(details.lat) && angular.isDefined(details.long)) {
            scope.position = [details.lat, details.long];
          }
        });
        scope.$on('$destroy', function() {
          locationUnWatch();
        });
      }
    };
  });
