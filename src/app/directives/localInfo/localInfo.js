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

        var localTime = $window.moment(scope.localInfo.time.localTime);
        scope.localTime = localTime.format(localTimeUpdates.format);

        localTimeIntervalPromise = $interval(function() {
          scope.localTime = localTime.add(localTimeUpdates.interval / 1000, 'seconds').format(localTimeUpdates.format);
        }, localTimeUpdates.interval);

        scope.$on('$destroy', function() {
          $interval.cancel(localTimeIntervalPromise);
        });
      }
    };
  }]);
