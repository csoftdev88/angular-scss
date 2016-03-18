'use strict';

angular.module('mobiusApp.directives.localInfo', [])

  .directive('localInfo', ['locationService', '$interval', '$window', 'Settings', '_', function(locationService, $interval, $window, Settings, _) {
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

        // Find weather type matching weather code
        function getWeatherType(id){
          return _.findKey(Settings.UI.weatherTypes, function(codes){
            return _.contains(codes, id);
          });
        }

        function disposeLocalTimeIntervalPromise() {
          if (angular.isDefined(localTimeIntervalPromise)) {
            $interval.cancel(localTimeIntervalPromise);
            localTimeIntervalPromise = undefined;
          }
        }

        function updateLocalTime(localTimeString) {
          if (localTimeString) {
            var localTime = $window.moment(localTimeString, 'YYYY-MM-DDTHH:mm:ss');
            scope.localTime = localTime.format(localTimeUpdates.format);

            disposeLocalTimeIntervalPromise();
            localTimeIntervalPromise = $interval(function() {
              scope.localTime = localTime.add(localTimeUpdates.interval / 1000, 'seconds').format(localTimeUpdates.format);
            }, localTimeUpdates.interval);
          }
        }

        // Set weatherType accordingly to provided code on scope to show icon
        function updateWeatherIcon(id){
          if (id) {
            scope.localInfo.weatherType = getWeatherType(id);
          }
        }

        var localTimeUnWatch = scope.$watch('localInfo.time.localTime', updateLocalTime);
        var localWeatherUnWatch = scope.$watch('localInfo.weatherId', updateWeatherIcon);

        scope.$on('$destroy', function() {
          localTimeUnWatch();
          localWeatherUnWatch();
          disposeLocalTimeIntervalPromise();
        });
      }
    };
  }]);
