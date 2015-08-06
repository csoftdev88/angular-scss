'use strict';

angular.module('mobiusApp.services.userMessagesService', [])
  .service('userMessagesService', function($rootScope, $timeout) {
    var TYPE_INFO = 'info-message';
    var messages = [];

    function clearMessages(){
      messages.length = 0;
      document.body.style.paddingTop = 0;
    }

    function addMessage(html, keepOldMessages) {
      if(!keepOldMessages && messages.length){
        clearMessages();
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_INFO,
          html: html
        });

        $timeout(function () {
          document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
        }, 500);
      });
    }

    // State change listener
    $rootScope.$on('$stateChangeSuccess', function() {
      //Remove all messages on route change
      if(messages.length){
        clearMessages();
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
