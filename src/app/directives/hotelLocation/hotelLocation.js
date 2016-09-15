'use strict';

angular.module('mobiusApp.directives.hotelLocation', [])

// TODO: Start using ng-min
  .directive('hotelLocation', function(chainService, Settings) {
    return {
      restrict: 'E',
      scope: {
        hotelDetails: '='
      },
      templateUrl: 'directives/hotelLocation/hotelLocation.html',

      // Widget logic goes here
      link: function(scope) {
        scope.config = Settings.UI.viewsSettings.locationMap;
        chainService.getChain(Settings.API.chainCode).then(function(chain){
          scope.nameShort = chain.nameShort;
        });
        var locationUnWatch = scope.$watch('hotelDetails', function(details) {
          if (details && angular.isDefined(details.lat) && angular.isDefined(details.long)) {
            scope.position = [details.lat, details.long];
          }
        });
        scope.$on('$destroy', function() {
          locationUnWatch();
        });
      }
    };
  });
