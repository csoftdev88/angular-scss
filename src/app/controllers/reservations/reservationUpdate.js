'use strict';
/*
 * This module controlls reservation update flow
 */
angular.module('mobius.controllers.reservationUpdate', [])
  .controller('ReservationUpdateCtrl', function($scope, $state,
    $location, $stateParams, notificationService, modalService, user){
    var EVENT_NOTIFICATION_CLOSED = 'notification-closed';

    var reservationUpdateMode = false;

    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
      // NOTE: ENTERING A RESERVATION UPDATE MODE
      if(toParams.reservation && toState.data && toState.data.supportsEditMode &&
        !fromParams.reservation){
        // NOTE: We can disable reservation edition when app starts
        // by checking fromState.name (if defined)
        if(!reservationUpdateMode){
          reservationUpdateMode = true;
          //You are currently editing:
          notificationService.show('<span>_you_are_currently_editing_ <strong>' + toParams.reservation + '</strong></span>');
        }

        return;
      }

      // NOTE: LEAVING RESERVATION UPDATE MODE
      if(reservationUpdateMode &&
        ((fromParams.reservation && (!toState.data || !toState.data.supportsEditMode)) ||
        (!fromParams.reservation && !toParams.reservation))) {
        // Leaving reservation edit mode
        e.preventDefault();
        e.noUpdate = true;

        // NOTE: on reservationDetail state we dont show the modal
        cancelReservationUpdate(null, fromParams.reservation, toState.name !== 'reservationDetail');
        // Removing reservation code and email from the URL
        toParams.reservation = null;
        if(toState.name !== 'reservationDetail'){
          toParams.email = null;
        }

        $state.go(toState.name, toParams);
        return;
      }
    });

    $scope.$on(EVENT_NOTIFICATION_CLOSED, function(){
      if(!reservationUpdateMode){
        return;
      }
      cancelReservationUpdate('reservations', null, true);
    });

    // Returns true when user is not logged-in and modifying the
    // reservation based on his email and reservation code
    $scope.isModifyingAsAnonymous = function(){
      return !user.isLoggedIn() && $stateParams.email && $stateParams.reservation;
    };

    function cancelReservationUpdate(redirectTo, reservationCode, showModal){
      reservationUpdateMode = false;

      notificationService.hide();

      if(showModal){
        modalService.openReservationModificationCanceledDialogue(reservationCode || $stateParams.reservation);
      }

      $location.search('reservation', null);
      if(redirectTo){
        $state.go(redirectTo, {reservation: null});
      }
    }
  }
);
