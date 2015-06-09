'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService,
  reservationService, preloaderFactory){

  // Redirecting to details page
  if($state.current.name === 'reservation'){
    $state.go('reservation.details');
  }

  $scope.userDetails = {
    title: 'Mr',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    stateProvince: '',
    country: '',
    zip: '',
    phone: ''
  };

  $scope.billingDetails = {
    card: {
      number: '',
      expires: '',
      cvv: '',
      ownersName: ''
    },
    useGuestAddress: true
  };

  // Inheriting the login from RoomDetails controller
  $controller('RoomDetailsCtrl', {$scope: $scope});

  // Getting room/products data
  var roomDataPromise = $scope.getRoomData(
    $stateParams.property, $stateParams.roomID).then(function(data){
    // Data[0] - ROOM DETAILS
    $scope.setRoomDetails(data[0]);

    // Data[1] - products
    setProductDetails(data[1].products);
  }, function(){
    $state.go('hotel');
  });

  // Showing loading mask
  preloaderFactory(roomDataPromise);

  function setProductDetails(products){
    // Finding the product which user about to book
    var product = $window._.findWhere(products,
      {
        code: $stateParams.productCode
      }
    );

    if(!product){
      // Product doesn't exist
      $scope.goBack();
      return;
    }

    $scope.selectProduct(product);
  }


  $scope.goBack = function(){
    switch($state.current.name){

    case 'reservation':
    case 'reservation.details':
      $state.go('room', {
        propertyCode: $scope.bookingDetails.property,
        roomID: $stateParams.roomID
      });
      return;

    case 'reservation.billing':
      $state.go('reservation.details');
      return;
    }
  };

  $scope.navigateToBilling = function() {
    $state.go('reservation.billing');
  };

  $scope.makeReservation = function(){
    console.log('API CALL');
    var reservationData = {
      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: $scope.hasReadRatePolicies || false,
      rooms: getRooms()
    };

    if($scope.bookingDetails.promoCode){
      reservationData.promoCode = $scope.bookingDetails.promoCode;
    }

    reservationService.createReservation();
  };

  // List of rooms for booking
  function getRooms(){
    var rooms = [];
    // NOTE: Currently we dont support advanced options
    // Booking only 1 room
    rooms.push({
      roomID: $stateParams.roomID,
      adults: $scope.bookingDetails.adults || 0,
      children: $scope.bookingDetails.children || 0
    });

    return rooms;
  }

  $scope.readPolicies = function(){
    $scope.hasReadRatePolicies = true;
    $scope.openPoliciesInfo();
  };

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();
});
