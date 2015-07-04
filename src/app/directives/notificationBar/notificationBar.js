'use strict';
/*
 * This bar is used for extra message displayed above
* the breadcumbs
 */

angular.module('mobiusApp.directives.notifications', [])

.directive('notificationBar', function(){
  return {
    restrict: 'E',
    templateUrl: 'directives/notificationBar/notificationBar.html',
    // Widget logic goes here
    link: function(scope){
      scope.message = 'You are modifying the reservation';
    }
  };
});
