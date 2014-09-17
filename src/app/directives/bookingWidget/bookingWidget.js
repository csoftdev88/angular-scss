'use strict';

angular.module('mobiusApp.directives.booking', [])

.directive('bookingWidget', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bookingWidget/bookingWidget.html',

    // Widget logic goes here
    link: function(){
      //scope, elem, attrs
    }
  };
});
