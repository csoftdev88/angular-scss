'use strict';
/*
 * This module controlls reservation update flow
 */
angular.module('mobius.controllers.reservationMultiRoom', [])
  .controller('ReservationMultiRoomCtrl', function($scope, $state, $filter, $location, $stateParams, Settings, $window,
                                                   notificationService, bookingService, validationService){
    var isMultiRoomMode = false;

    var EVENT_MULTIROOM_CANCELED = 'EVENT-MULTIROOM-CANCELED';

    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
      // NOTE: ENTERING MULTIROOM RESRVATION MODE
      if(toParams.rooms && toState.data && toState.data.supportsMultiRoom){
        // NOTE: We can disable reservation edition when app starts
        // by checking fromState.name (if defined)
        isMultiRoomMode = true;

        var rooms, currentRoomIndex;

        rooms = bookingService.getMultiRoomData(toParams.rooms);
        if(toParams.room && (rooms.length > 1)) {
          currentRoomIndex = parseInt(toParams.room, 10) - 1;
          showNotification(rooms, currentRoomIndex, toParams.dates);
        }else{
          notificationService.hide();
        }

        if(toState.name === 'reservation.details' && toParams.room){
          // User is heading to payment page
          // Checking if other rooms must be selected
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
              toParams.scrollTo = 'jsRooms';
              // Updating number of adults/children for next room
              toParams.adults = rooms[currentRoomIndex].adults;
              toParams.children = rooms[currentRoomIndex].children;
              toParams.propertySlug = fromParams.propertySlug;
              $state.go('hotel', toParams, {reload: true});
            }else if(currentRoomIndex === rooms.length-1){
              // Removing room index
              toParams.room = null;
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
        (!toParams.room && !toParams.rooms && toState.name !== 'reservationDetail'))) {
        // Leaving reservation edit mode
        e.preventDefault();
        e.noUpdate = true;

        // NOTE: on reservationDetail state we dont show the modal
        cancelMultriRoomMode();
        toParams.email = null;
        toParams.room = null;
        toParams.rooms = null;
        $state.go(toState.name, toParams);
        return;
      }
    });

    function showNotification(rooms, currentRoomIndex, dates){
      var currentRoom = rooms[currentRoomIndex];

      currentRoomIndex++;

      notificationService.show(
        '<div class="multiroom-notification">' +
          '<div class="rooms">' +
            '<p>Room</p>' +
            '<p>' + currentRoomIndex + ' of ' + rooms.length +'</p>' +
          '</div>' +
          '<div class="details">' +
            '<p>' + getAdultsCount(currentRoom) + '</p>' +
            '<p>' + getChildrenCount(currentRoom) +'</p>' +
          '</div>' +
          '<div class="dates">' +
            '<p>' + getStartDate(dates) + '</p>' +
            '<p>' + getEndDate(dates) + '</p>' +
          '</div>' +
        '</div>',

        EVENT_MULTIROOM_CANCELED
      );
    }

    function getStartDate(dates) {
      return $window.moment(dates.substring(0, dates.indexOf('_'))).format(Settings.UI.generics.longDateFormat);
    }

    function getEndDate(dates) {
      return $window.moment(dates.substring(dates.indexOf('_') + 1, dates.length)).format(Settings.UI.generics.longDateFormat);
    }

    function getAdultsCount(room){
      var rules = {
        '0': 'no adults',
        '1': '{} adult',
        'plural': '{} adults'
      };

      return $filter('pluralization')(room.adults, rules);
    }

    function getChildrenCount(room){
      var rules = {
        '0': 'no children',
        '1': '{} child',
        'plural': '{} children'
      };

      return $filter('pluralization')(room.children, rules);
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

    $scope.$on(EVENT_MULTIROOM_CANCELED, function(){
      cancelMultriRoomMode('hotels');
    });
  }
);
