'use strict';

angular.module('mobiusApp.services.userMessagesService', [])
  .service('userMessagesService', function($rootScope, $timeout) {

    var INFO = 'info-message';
    var ERROR = 'error-message';

    var messages = [];

    function addMessage(type, html, keepOldMessages) {
      if(!keepOldMessages && messages.length){
        messages.length = 0;
        document.body.style.paddingTop = 0;
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: type,
          html: html
        });
        
        $timeout(function () {
          document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
        }, 500);
        
      });
    }

    return {
      messages: messages,
      addMessage: addMessage,
      addErrorMessage: addMessage.bind(null, ERROR),
      addInfoMessage: addMessage.bind(null, INFO)
    };
  });
