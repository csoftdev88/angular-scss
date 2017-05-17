'use strict';

angular.module('mobiusApp.services.userMessagesService', [])
  .service('userMessagesService', function($rootScope, $timeout, stateService) {
    var TYPE_INFO = 'info-message';
    var TYPE_RESERVATION_CONFIRMATION = 'info-reservation-confirmation';
    var messages = [];
    var isChangingRoute = false;

    function clearMessages() {
      messages.length = 0;
      if (!stateService.isMobile()) {
        document.body.style.paddingTop = 0;
      }
    }

    function addMessage(html, keepOldMessages, routeIsChanging) {

      isChangingRoute = routeIsChanging || false;

      if(!keepOldMessages && messages.length){
        clearMessages();
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_INFO,
          html: html
        });

        if (!stateService.isMobile()) {
          $timeout(function () {
            document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
          }, 500);
        }
      });
    }

    function addReservationConfirmationMessage(property, reservationCode, keepOldMessages, routeIsChanging) {

      isChangingRoute = routeIsChanging || false;

      if(!keepOldMessages && messages.length){
        clearMessages();
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_RESERVATION_CONFIRMATION,
          property: property,
          reservationCode: reservationCode
        });

        if (!stateService.isMobile()) {
          $timeout(function () {
            document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
          }, 500);
        }
      });
    }

    // State change listener
    $rootScope.$on('$stateChangeStart', function() {
      //Remove all messages on route change
      if(messages.length && !isChangingRoute){
        clearMessages();
      }
      isChangingRoute = false;
    });

    function getMessages(){
      return messages;
    }

    return {
      messages: messages,
      getMessages: getMessages,
      addMessage: addMessage,
      addReservationConfirmationMessage: addReservationConfirmationMessage
    };
  });
