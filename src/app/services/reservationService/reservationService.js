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

  function cancelReservation(reservationCode) {
    return apiService.put(apiService.getFullURL('reservations.cancel', {reservationCode: reservationCode}));
  }

  function getReservation(reservationCode) {
    return apiService.get(apiService.getFullURL('reservations.detail', {reservationCode: reservationCode}));
  }

  function getReservationAddOns(reservationCode) {
    return apiService.get(apiService.getFullURL('reservations.addons', {reservationCode: reservationCode}));
  }

  function addAddon(reservationCode, addon) {
    return apiService.post(apiService.getFullURL('reservations.addons', {reservationCode: reservationCode}),
      addon
    );
  }

  function getAvailableAddons(params){
    return apiService.get(apiService.getFullURL('reservations.availableAddons'), params);
  }

  // Getting all customer reservations
  function getAll() {
    var customerId = user.getCustomerId();

    if(!customerId){
      throw new Error('User must be logged in');
    }

    return apiService.get(apiService.getFullURL('reservations.all'), {
      customerId: customerId
    });
  }

  // Public methods
  return {
    createReservation: createReservation,
    modifyReservation: modifyReservation,
    cancelReservation: cancelReservation,
    getReservation: getReservation,
    // Addons added to reservation
    getReservationAddOns: getReservationAddOns,
    // Adding the addon to servation
    addAddon: addAddon,
    getAvailableAddons: getAvailableAddons,
    getAll: getAll
  };
});
