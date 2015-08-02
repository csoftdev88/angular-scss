'use strict';
/*
 * This module controlls reservation update flow
 */
angular.module('mobius.controllers.reservationMultiRoom', [])
  .controller('ReservationMultiRoomCtrl', function($scope, $state,
    $location, $stateParams, notificationService){
    var isMultiRoomMode = false;

    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
      // NOTE: ENTERING MULTIROOM RESRVATION MODE
      if(toParams.room && toParams.rooms && toState.data && toState.data.supportsMultiRoom &&
        !fromParams.room){
        // NOTE: We can disable reservation edition when app starts
        // by checking fromState.name (if defined)
        if(!isMultiRoomMode){
          isMultiRoomMode = true;
          notificationService.show('<span>Multiroom Mode<strong>' + toParams.room + '</strong></span>');
        }

        return;
      }

      // NOTE: LEAVING RESERVATION UPDATE MODE
      if(isMultiRoomMode &&
        ((fromParams.room && fromParams.rooms && (!toState.data || !toState.data.supportsMultiRoom)) ||
        (!toParams.room && !toParams.rooms))) {
        // Leaving reservation edit mode
        e.preventDefault();
        e.noUpdate = true;

        // NOTE: on reservationDetail state we dont show the modal
        cancelMultriRoomMode();
        // Removing reservation code and email from the URL
        toParams.reservation = null;
        toParams.email = null;
        $state.go(toState.name, toParams);
        return;
      }
    });

    function cancelMultriRoomMode(redirectTo){
      isMultiRoomMode = false;

      notificationService.hide();

      $location.search('room', null);
      $location.search('rooms', null);
      if(redirectTo){
        $state.go(redirectTo, {rooms: null, room: null});
      }
    }
  }
);
