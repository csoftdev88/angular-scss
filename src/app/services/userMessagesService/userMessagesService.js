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

    function addMessage(html, keepOldMessages, routeIsChanging, style) {

      isChangingRoute = routeIsChanging || false;

      if(!keepOldMessages && messages.length){
        clearMessages();
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_INFO,
          html: html
        });

        $timeout(function () {
          updateStyleClass(style);
        }, 0);

        if (!stateService.isMobile()) {
          $timeout(function () {
            document.body.style.paddingTop = angular.element('#user-messages').height() + 'px';
          }, 500);
        }
      });
    }

    function updateStyleClass(style) {
      var element = $('user-messages');
      element.removeClass();
      element.addClass('ng-scope');
      if (style) {
        element.addClass(style);
      }
    }

    function addReservationConfirmationMessage(property, reservationCode, keepOldMessages, routeIsChanging) {

      isChangingRoute = routeIsChanging || false;

      if(!keepOldMessages && messages.length) {
        clearMessages();
      }

      $rootScope.$evalAsync(function(){
        messages.push({
          type: TYPE_RESERVATION_CONFIRMATION,
          property: property,
          reservationCode: reservationCode
        });

        $timeout(function () {
          updateStyleClass('reservation-confirmation');
        }, 0);

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
