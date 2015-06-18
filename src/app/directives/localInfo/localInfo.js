'use strict';

angular.module('mobiusApp.directives.localInfo', [])

  .directive('localInfo', ['locationService', '$interval', '$window', 'Settings', function(locationService, $interval, $window, Settings) {
    return {
      restrict: 'E',
      scope: {
        locationCode: '='
      },
      templateUrl: 'directives/localInfo/localInfo.html',

      // Widget logic goes here
      link: function(scope) {

        var localTimeUpdates = Settings.UI.localTimeUpdates;
        var localTimeIntervalPromise;

        function disposeLocalTimeIntervalPromise() {
          if (angular.isDefined(localTimeIntervalPromise)) {
            $interval.cancel(localTimeIntervalPromise);
            localTimeIntervalPromise = undefined;
          }
        }

        function updateLocationInfo(locationCode) {
          if (locationCode) {
            locationService.getLocation(locationCode).then(function(location) {
              scope.localInfo = location.localInfo;
              var localTime = $window.moment(location.localInfo.time.localTime);
              scope.localTime = localTime.format(localTimeUpdates.format);

              disposeLocalTimeIntervalPromise();
              localTimeIntervalPromise = $interval(function() {
                scope.localTime = localTime.add(localTimeUpdates.interval / 1000, 'seconds').format(localTimeUpdates.format);
              }, localTimeUpdates.interval);
            });
          }
        }

        var locationCodeWatch = scope.$watch(
          function() {
            return scope.locationCode;
          },
          updateLocationInfo
        );

        scope.$on('$destroy', function() {
          locationCodeWatch();
          disposeLocalTimeIntervalPromise();
        });
      }
    };
  }]);
