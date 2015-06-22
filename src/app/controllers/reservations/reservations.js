'use strict';
/*
 * This module controlls a list of reservation page(My stays)
 */
angular.module('mobius.controllers.reservations', [])

.controller('ReservationsCtrl', function($scope, $controller,
  modalService, creditCardTypeService, reservationService,
  preloaderFactory){

  $controller('MainCtrl', {$scope: $scope});

  var reservationsPromise = reservationService.getAll().then(function(data){

    processReservationsData(data);
  });

  preloaderFactory(reservationsPromise);

  function processReservationsData(data){
    $scope.reservations = {
      nextStay: data[0],
      past: data,
      future: data
    };
  }

  // NOTE: Dummy data, will be replaced by data from API
  /*
  $scope.reservations = [
    {
      id: 'MOBTUN-123555',
      checkin: '21 Oct 14',
      checkout: '23 Oct 14',
      charges: 178,
      tax: 16.45,
      total: 194.45,
      hotel: {
        name: 'Hotel Mobius Tunis',
        country: 'Tunisia'
      },
      rooms: [{
        type: 'Deluxe Double Room',
        rate: 'Bed and Breakfast',
        price: 89.00,
        adults: 2,
        children: 0
      }]
    },
    {
      id: 'MOBBARC-132564',
      checkin: '13 Nov 14',
      checkout: '16 Nov 14',
      charges: 186,
      tax: 21.65,
      total: 207.65,
      hotel: {
        name: 'Hotel Mobius Barcelona',
        country: 'Spain'
      },
      rooms: [{
        type: 'Deluxe Double Room',
        rate: 'Bed and Breakfast',
        price: 99.00,
        adults: 1,
        children: 1
      }, {
        type: 'Deluxe Double Room',
        rate: 'All Inclusive',
        price: 119.00,
        adults: 2,
        children: 0
      }]
    }
  ];

  */


  $scope.reservationDetails = {};

  $scope.openPoliciesInfo = modalService.openPoliciesInfo;
  $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;
  $scope.openCancelReservationDialog = modalService.openCancelReservationDialog;

  $scope.getCreditCardType = creditCardTypeService.getType;
  $scope.creditCardTypes = {};
  // change names to icons
  $scope.creditCardTypes[creditCardTypeService.AMERICAN_EXPRESS] = 'American Express';
  $scope.creditCardTypes[creditCardTypeService.MAESTRO] = 'Maestro';
  $scope.creditCardTypes[creditCardTypeService.MASTER_CARD] = 'Master Card';
  $scope.creditCardTypes[creditCardTypeService.VISA] = 'Visa';
});
