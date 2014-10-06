'use strict';
angular.module('mobiusApp.directives.booking', []).directive('bookingWidget', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',
    link: function (scope) {
      scope.hotel = {};
      scope.number = {};
      scope.hotels = [
        'Abbotsford',
        'Blue River',
        'Cache Creek',
        'Calgary Airport'
      ];
      scope.numbers = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ];
    }
  };
});