'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(scope){
      scope.hotel = {};

      scope.hotels = [
        'Abbotsford',
        'Blue River',
        'Cache Creek',
        'Calgary Airport'
      ];
      //scope, elem, attrs
    }
  };
});
