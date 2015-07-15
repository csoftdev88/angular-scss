'use strict';
/*
 * This bar is used for extra message displayed above
* the breadcumbs
 */
var EVENT_NOTIFICATION_MESSAGE_UPDATED = 'notification-message-updated';
var EVENT_NOTIFICATION_CLOSED = 'notification-closed';

angular.module('mobiusApp.directives.notifications', [])

.directive('notificationBar', function($rootScope, notificationService){
  return {
    restrict: 'E',
    templateUrl: 'directives/notificationBar/notificationBar.html',
    // Widget logic goes here
    link: function(scope){
      var notificationCloseEvent;

      scope.message = notificationService.getMessage();

      scope.$on(EVENT_NOTIFICATION_MESSAGE_UPDATED, function($event, data){
        notificationCloseEvent = data.closeEvent;

        scope.message = notificationService.getMessage();
      });

      scope.onClose = function(){
        $rootScope.$broadcast(notificationCloseEvent);
        scope.message = null;
      };
    }
  };
})

.service('notificationService', function($rootScope){
  var _message;
  var _deleteOnStateChange;

  function broadcast(message, notificationCloseEvent){
    _message = message;

    // Custom close events
    var eventData = {
      closeEvent: notificationCloseEvent || EVENT_NOTIFICATION_CLOSED
    };

    $rootScope.$broadcast(EVENT_NOTIFICATION_MESSAGE_UPDATED, eventData);
  }

  $rootScope.$on('$stateChangeStart', function() {
    if(_deleteOnStateChange){
      hide();
    }
  });

  function hide(){
    broadcast(null);
  }

  // TODO: Make a list of messages with unique settings
  function show(message, notificationCloseEvent, deleteOnStateChange){
    broadcast(message, notificationCloseEvent);
    _deleteOnStateChange = deleteOnStateChange;
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