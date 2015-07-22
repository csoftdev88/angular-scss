'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService, user) {
  function createReservation(data) {
    return apiService.post(apiService.getFullURL('reservations.new'), data);
  }

  function modifyReservation(reservationCode, data, email) {
    return apiService.put(apiService.getFullURL('reservations.modify', {reservationCode: reservationCode}), data, email?{email:email}:null);
  }

  function cancelReservation(reservationCode) {
    return apiService.put(apiService.getFullURL('reservations.cancel', {reservationCode: reservationCode}));
  }

  function getReservation(reservationCode, params) {
    return apiService.get(apiService.getFullURL('reservations.detail', {reservationCode: reservationCode}), params);
  }

  function getReservationAddOns(reservationCode, email) {
    return apiService.get(apiService.getFullURL('reservations.addons',
      {reservationCode: reservationCode}), email?{email:email}:null);
  }

  function addAddon(reservationCode, addon, email) {
    return apiService.post(apiService.getFullURL('reservations.addons',
      {reservationCode: reservationCode}),
      addon,
      email?{email:email}:null
    );
  }

  function getAvailableAddons(params){
    if(user.isLoggedIn()){
      if(!params){
        params = {};
      }

      params.customerId = user.getCustomerId();
    }

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

  function find(reservationCode, email){
    return apiService.get(apiService.getFullURL('reservations.detail', {
      reservationCode: reservationCode
    }), {email: email});
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
    getAll: getAll,
    find: find
  };
});
