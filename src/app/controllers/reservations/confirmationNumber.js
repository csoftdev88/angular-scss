'use strict';
/*
 * This module controlls visibility of reservation conf. number
 */
angular.module('mobius.controllers.reservation.confirmationNumber', [])

.controller('ConfirmationNumberCtrl', function($scope, $state, propertyCode,
  Settings){

  if(propertyCode && Settings.UI.reservations && Settings.UI.reservations.confirmationNumber){
    var settings = Settings.UI.reservations.confirmationNumber[propertyCode];
    var displayAll = Settings.UI.reservations.displayConfirmationNumberOnAllHotels;
    if(!displayAll && !settings){
      return;
    }

    if(displayAll){
      $scope.displayConfirmationNumber = true;
    }else if($state.current.name === 'reservations' && !displayAll){
      $scope.displayConfirmationNumber = settings.displayOnListView;
    }else if($state.current.name === 'reservationDetail' && !displayAll){
      $scope.displayConfirmationNumber = settings.displayOnDetailsView;
    }
  }
});
