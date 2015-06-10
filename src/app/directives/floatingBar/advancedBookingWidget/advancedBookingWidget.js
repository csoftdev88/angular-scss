'use strict';

angular.module('mobiusApp.directives.floatingBar.advancedBookingWidget', [])

  .directive('advancedBookingWidget', function(){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/advancedBookingWidget/advancedBookingWidget.html',

      // Widget logic goes here
      link: function() {
      }
    };
  });
