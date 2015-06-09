'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  // Public methods
  return {
    createReservation: createReservation
  };
});
