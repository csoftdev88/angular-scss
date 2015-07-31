'use strict';

angular.module('mobiusApp.services.userMessagesService', [])
  .service('userMessagesService', function($rootScope, $timeout) {
    var TYPE_INFO = 'info-message';
    var messages = [];

    function addMessage(html, keepOldMessages, removeOnStateChange) {
      if(!keepOldMessages && messages.length){
        messages.length = 0;
        document.body.style.paddingTop = 0;
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_INFO,
          html: html,
          removeOnStateChange: removeOnStateChange
        });

        $timeout(function () {
          document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
        }, 500);
      });
    }

    // State change listener
    $rootScope.$on('$stateChangeSuccess', function() {
      // Removing the notifications with removeOnStateChange flag
      if(!messages.length){
        return;
      }

      // NOTE: Cant use underscope _.without since it breaks
      // $watch on model
      var messageToRemove = [];
      for(var i=0; i<messages.length; i++){
        var message = messages[i];
        if(message.removeOnStateChange){
          messageToRemove.push(message);
        }

        for(i=0; i<messageToRemove.length; i++){
          messages.splice(messages.indexOf(messageToRemove[i]));
        }
      }
    });

    function getMessages(){
      return messages;
    }

    return {
      messages: messages,
      getMessages: getMessages,
      addMessage: addMessage
    };
  });
