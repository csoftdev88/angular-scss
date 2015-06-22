'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  function modifyReservation(reservationCode, data) {
    return apiService.put(apiService.getFullURL('reservations.modify', {reservationCode: reservationCode}), data);
  }

  // Public methods
  return {
    createReservation: createReservation,
    modifyReservation: modifyReservation
  };
});
