'use strict';
/*
 * This module controlls visibility of reservation conf. number
 */
angular.module('mobius.controllers.reservation.confirmationNumber', [])

.controller('ConfirmationNumberCtrl', function($scope, $state, propertyCode,
  Settings){

  if(propertyCode && Settings.UI.reservations && Settings.UI.reservations.confirmationNumber){
    var settings = Settings.UI.reservations.confirmationNumber[propertyCode];
    if(!settings){
      return;
    }

    if($state.current.name === 'reservations'){
      $scope.displayConfirmationNumber = settings.displayOnListView;
    }else if($state.current.name === 'reservationDetail'){
      $scope.displayConfirmationNumber = settings.displayOnDetailsView;
    }
  }
});
