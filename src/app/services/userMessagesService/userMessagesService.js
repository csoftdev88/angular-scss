'use strict';

angular.module('mobiusApp.services.userMessagesService', [])
  .service('userMessagesService', function() {

    var INFO = 'info-message';
    var ERROR = 'error-message';

    var messages = [];

    function addMessage(type, html) {
      messages.push({
        type: type,
        html: html
      });
    }

    return {
      messages: messages,
      addMessage: addMessage,
      addErrorMessage: addMessage.bind(null, ERROR),
      addInfoMessage: addMessage.bind(null, INFO)
    };
  });
