'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService, user) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  function modifyReservation(reservationCode, data) {
    return apiService.put(apiService.getFullURL('reservations.modify', {reservationCode: reservationCode}), data);
  }

  function getReservation(reservationCode) {
    return apiService.get(apiService.getFullURL('reservations.detail', {reservationCode: reservationCode}));
  }

  function getReservations(reservationCode){
    var customerId = user.getCustomerId();

    if(!customerId){
      throw new Error('User must be logged in');
    }

    var params = {
      customerId: customerId
    };

    if(reservationCode){
      params.reservationCode = reservationCode;
    }

    return apiService.get(apiService.getFullURL('reservations.all'), params);
  }

  // Getting all customer reservations
  function getAll() {
    return getReservations();
  }

  // Public methods
  return {
    createReservation: createReservation,
    modifyReservation: modifyReservation,
    getReservation: getReservation,
    getAll: getAll
  };
});
