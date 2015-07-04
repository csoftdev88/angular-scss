'use strict';
/*
 * This bar is used for extra message displayed above
* the breadcumbs
 */
var EVENT_NOTIFICATION_MESSAGE_UPDATED = 'notification-message-updated';

angular.module('mobiusApp.directives.notifications', [])

.directive('notificationBar', function(notificationService){
  return {
    restrict: 'E',
    templateUrl: 'directives/notificationBar/notificationBar.html',
    // Widget logic goes here
    link: function(scope){
      scope.message = notificationService.getMessage();

      scope.$on(EVENT_NOTIFICATION_MESSAGE_UPDATED, function(){
        scope.message = notificationService.getMessage();
      });
    }
  };
})

.service('notificationService', function($rootScope){
  var _message;

  function broadcast(message){
    _message = message;
    $rootScope.$broadcast(EVENT_NOTIFICATION_MESSAGE_UPDATED);
  }

  function hide(){
    broadcast(null);
  }

  function show(message){
    broadcast(message);
  }

  function getMessage(){
    return _message;
  }

  return {
    hide: hide,
    show: show,
    getMessage: getMessage
  };
});