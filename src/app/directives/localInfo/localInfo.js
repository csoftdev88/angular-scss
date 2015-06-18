'use strict';

angular.module('mobiusApp.directives.localInfo', [])

  .directive('localInfo', ['locationService', '$interval', '$window', 'Settings', function(locationService, $interval, $window, Settings) {
    return {
      restrict: 'E',
      scope: {
        localInfo: '='
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

        function updateLocalTime(localTimeString) {
          if (localTimeString) {
            var localTime = $window.moment(localTimeString);
            scope.localTime = localTime.format(localTimeUpdates.format);

            disposeLocalTimeIntervalPromise();
            localTimeIntervalPromise = $interval(function() {
              scope.localTime = localTime.add(localTimeUpdates.interval / 1000, 'seconds').format(localTimeUpdates.format);
            }, localTimeUpdates.interval);
          }
        }

        var localTimeUnWatch = scope.$watch('localInfo.time.localTime', updateLocalTime);

        scope.$on('$destroy', function() {
          localTimeUnWatch();
          disposeLocalTimeIntervalPromise();
        });
      }
    };
  }]);
