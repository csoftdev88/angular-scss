'use strict';
/*
 * This module controlls reservation update flow
 */
angular.module('mobius.controllers.reservationUpdate', [])
  .controller('ReservationUpdateCtrl', function($scope, $state,
    $location, notificationService, modalService){
    $scope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams){
      // Checking if we are entering into reservation edit mode
      if(toParams.reservation && toState.data && toState.data.supportsEditMode &&
        !fromParams.reservation){
        // NOTE: We can disable reservation edition when app starts
        // by checking fromState.name (if defined)

        notificationService.show('You are currently editing: ' + toParams.reservation);
        // NOTE: Info dialogue
        modalService.openModifyingReservationDialogue(toParams.reservation);
        return;
      }

      if(fromParams.reservation && (!toState.data || !toState.data.supportsEditMode)){
        // Leaving reservation edit mode
        notificationService.hide();
        modalService.openReservationModificationCanceledDialogue(fromParams.reservation);

        e.preventDefault();
        // Removing reservation code from the URL
        delete toParams.reservation;
        $location.search('reservation', null);

        $state.go(toState.name, toParams);
        return;
      }

      if(fromState.name === '' && toParams.reservation){
        // APP just started but includes reservation code which should be modifyed
        // TODO: Uncoment;
        //e.preventDefault();
        //$state.go('home', {});
        return;
      }
    });
  }
);
