'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  function getAll(includeNextStay) {
    console.error(includeNextStay, 11111);
    // TODO: Check the API updates
    return apiService.get(apiService.getFullURL('reservations.all'), {
      'reservationCode': 'ABB-EF-01435',
      'email': 'xxx@domain.com',
      'password': 'password',
      'next': includeNextStay
    });
  }

  // Public methods
  return {
    createReservation: createReservation,
    getAll: getAll
  };
});
