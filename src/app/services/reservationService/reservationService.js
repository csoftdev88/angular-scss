'use strict';
/*
* Service for reservations
*/

angular.module('mobiusApp.services.reservation', [])
.service( 'reservationService',  function(apiService, user) {

  function createReservation(property, rooms, data) {
    return apiService.post(apiService.getFullURL('reservations.new', {property:property, rooms:rooms}), data);
  }

  function modifyReservation(reservationCode, data, email) {
    return apiService.put(apiService.getFullURL('reservations.modify', {reservationCode: reservationCode}), data, email?{email:email}:null);
  }

  function cancelReservation(reservationCode, email) {
    return email ? apiService.put(apiService.getFullURL('reservations.cancelAnon', {reservationCode: reservationCode, email: encodeURIComponent(email)})) : apiService.put(apiService.getFullURL('reservations.cancel', {reservationCode: reservationCode}));
  }

  function getReservation(reservationCode, params) {
    return apiService.get(apiService.getFullURL('reservations.detail', {reservationCode: reservationCode}), params);
  }

  function getReservationAddOns(reservationCode, email) {
    return apiService.get(apiService.getFullURL('reservations.addons',
      {reservationCode: reservationCode}), email?{email:email}:null, false);
  }

  function sendToPassbook(reservationCode){
    return apiService.get(apiService.getFullURL('reservations.action',
      {reservationCode: reservationCode, actionType: 'sendToPassbook'}));
  }

  function addAddon(reservationCode, addon, email, voucherCode) {
    var requestBody = null;
    if(addon){
      requestBody = addon;
    }
    else if(voucherCode){
      requestBody = {voucherCode:voucherCode};
    }
    return apiService.post(apiService.getFullURL('reservations.addons',
      {reservationCode: reservationCode}),
      requestBody?requestBody:null,
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
  function getAll(params) {
    var customerId = user.getCustomerId();

    if(!customerId){
      throw new Error('User must be logged in');
    }

    if(!params){
      params = {};
    }

    params.customerId = customerId;

    return apiService.get(apiService.getFullURL('reservations.all'), params);
  }

  function getCancelledReservations(){
    return getAll({
      filter: 'cancelled'
    });
  }

  function find(reservationCode, email){
    return apiService.get(apiService.getFullURL('reservations.detail', {
      reservationCode: reservationCode
    }), {email: email});
  }

  function updateAnonUserProfile(id, email, data) {
    return apiService.put(apiService.getFullURL('reservations.anonCustomerProfile', {customerId: id, customerEmail: email}), data);
  }

  function getAnonUserProfile(id, email) {
    return apiService.get(apiService.getFullURL('reservations.anonCustomerProfile', {customerId: id, customerEmail: encodeURIComponent(email)}));
  }

  function checkVoucher(params) {
    params.voucher = params.voucher ? params.voucher.toUpperCase() : null;
    return apiService.get(apiService.getFullURL('reservations.checkVoucher'), params);
  }

  // Public methods
  return {
    createReservation: createReservation,
    modifyReservation: modifyReservation,
    sendToPassbook: sendToPassbook,
    cancelReservation: cancelReservation,
    getReservation: getReservation,
    // Addons added to reservation
    getReservationAddOns: getReservationAddOns,
    // Adding the addon to servation
    addAddon: addAddon,
    getAvailableAddons: getAvailableAddons,
    getAll: getAll,
    getCancelledReservations: getCancelledReservations,
    find: find,
    updateAnonUserProfile: updateAnonUserProfile,
    getAnonUserProfile: getAnonUserProfile,
    checkVoucher: checkVoucher
  };
});
