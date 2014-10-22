'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function(propertyService, Settings){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      // Widget settings
      scope.settings = Settings.UI.bookingWidget;

      propertyService.getAll().then(function(data){
        // NOTE: mock API has incorrectly formated JSON
        scope.propertyList = data;
      });

      scope.propertyList = [
        'Abbotsford',
        'Blue River',
        'Cache Creek',
        'Calgary Airport'
      ];
    }
  };
});
