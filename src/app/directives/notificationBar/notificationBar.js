'use strict';
/*
 * This bar is used for extra message displayed above
* the breadcumbs
 */
var EVENT_NOTIFICATION_MESSAGE_UPDATED = 'notification-message-updated';
var EVENT_NOTIFICATION_CLOSED = 'notification-closed';

angular.module('mobiusApp.directives.notifications', [])

// TODO - Unify this with other notifications - future promo code will require
// multiple messages on the page
.directive('notificationBar', function($rootScope, $controller, notificationService){
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'directives/notificationBar/notificationBar.html',
    // Widget logic goes here
    link: function(scope, elem, attrs){
      var notificationCloseEvent;

      $controller('SanitizeCtrl', {$scope: scope});

      function init(){
        var message = notificationService.getMessage();
        if(attrs.currentlyEditing){
          message = message.replace('_you_are_currently_editing_', attrs.currentlyEditing);
        }
        scope.message = message;
        notificationCloseEvent = notificationService.getCloseEvent();
      }

      scope.$on(EVENT_NOTIFICATION_MESSAGE_UPDATED, function(){
        init();
      });

      scope.onClose = function(){
        if(notificationCloseEvent){
          $rootScope.$broadcast(notificationCloseEvent);
        }

        scope.message = null;
      };

      init();
    }
  };
})

.service('notificationService', function($rootScope){
  var _message;
  var _notificationCloseEvent;
  var _deleteOnStateChange;

  function broadcast(message, notificationCloseEvent){
    _message = message;
    if(message){
      _notificationCloseEvent = notificationCloseEvent || EVENT_NOTIFICATION_CLOSED;
    }
    $rootScope.$broadcast(EVENT_NOTIFICATION_MESSAGE_UPDATED);
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

  function getCloseEvent(){
    return _notificationCloseEvent;
  }

  return {
    hide: hide,
    show: show,
    getMessage: getMessage,
    getCloseEvent: getCloseEvent
  };
});
