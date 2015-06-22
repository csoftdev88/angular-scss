'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService, user) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  function getReservations(reservationCode){
    var customerId = user.getCustomerId();

    if(!customerId){
      throw new Error('User must be logged in');
    }

    var params = {
      customerId: customerId,
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

  function getReservationDetails(reservationCode){
    if(!reservationCode){
      throw new Error('reservationCode must be provided');
    }

    return getReservations(reservationCode);
  }

  // Public methods
  return {
    createReservation: createReservation,
    getAll: getAll,
    getReservationDetails: getReservationDetails
  };
});
