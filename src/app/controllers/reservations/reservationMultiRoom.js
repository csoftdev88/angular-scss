'use strict';
/*
 * This module controlls reservation update flow
 */
angular.module('mobius.controllers.reservationMultiRoom', [])
  .controller('ReservationMultiRoomCtrl', function($scope, $state,
    $location, $stateParams, notificationService, validationService){
    var isMultiRoomMode = false;

    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
      // NOTE: ENTERING MULTIROOM RESRVATION MODE
      if(toParams.room && toParams.rooms && toState.data && toState.data.supportsMultiRoom){
        // NOTE: We can disable reservation edition when app starts
        // by checking fromState.name (if defined)
        if(!isMultiRoomMode){
          isMultiRoomMode = true;
        }

        showNotification();

        if(toState.name === 'reservation.details'){
          // User is heading to payment page
          // Checking if other rooms must be selected
          var rooms = validationService.convertValue(toParams.rooms, {type: 'object'}, true);
          var currentRoomIndex = parseInt(toParams.room, 10);
          currentRoomIndex--;


          if(currentRoomIndex < rooms.length){
            rooms[currentRoomIndex].roomID = toParams.roomID;
            rooms[currentRoomIndex].productCode = toParams.productCode;

            // Setting rooms details

            e.preventDefault();
            e.noUpdate = true;
            if(currentRoomIndex !== rooms.length-1){
              // There are still rooms - redirecting to another room selection
              toParams.roomID = null;
              toParams.productCode = null;
              toParams.rooms = validationService.convertValue(rooms, {type: 'object'});
              toParams.room = currentRoomIndex + 2;
              // Updating number of adults/children for next room
              toParams.adults = rooms[currentRoomIndex].adults;
              toParams.children = rooms[currentRoomIndex].children;
              toParams.propertySlug = fromParams.propertySlug;
              $state.go('hotel', toParams);
            }else if(currentRoomIndex === rooms.length-1){
              toParams.room = currentRoomIndex+2;
              toParams.rooms = validationService.convertValue(rooms, {type: 'object'});
              // Payment form
              $state.go(toState.name, toParams);
            }else{
              notificationService.hide();
            }
          }
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

    function showNotification(){
      notificationService.show('<div class="multiroom-notification"><div class="rooms"><p>Room</p><p>1 of 2</p></div>' +
        '<div class="details"><p>2 adults</p><p>0 children</p></div></div>');
      //notificationService.show('<span>Multiroom Mode<strong>' + toParams.room + ' - ' +
      //  toParams.adults + ':Adults ' + toParams.children + ':Children </strong></span>');
    }

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
