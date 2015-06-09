'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService,
  reservationService, preloaderFactory, modalService, user){

  // Redirecting to details page
  if($state.current.name === 'reservation'){
    $state.go('reservation.details');
  }

  $scope.state = $state;

  $scope.userDetails = {};

  $scope.billingDetails = {
    card: {
      number: '',
      expirationDate: '',
      securityCode: '',
      holderName: ''
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
    var reservationData = {
      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: $scope.hasReadRatePolicies || false,
      rooms: getRooms(),
      customer: user.getUser().id,
      paymentInfo: {
        paymentMethod: 'CC', // credit card,
        ccPayment: {
          holderName: $scope.billingDetails.card.holderName,
          number: $scope.billingDetails.card.number,
          expirationDate: $scope.billingDetails.card.expirationDate,
          securityCode: $scope.billingDetails.card.securityCode,
          typeCode: 'VI'
        }
      },

      guestFirstName: $scope.userDetails.firstName,
      guestLastName: $scope.userDetails.lastName
    };

    if($scope.bookingDetails.promoCode){
      reservationData.promoCode = $scope.bookingDetails.promoCode;
    }

    reservationData = {
      arrivalDate: '2015-07-07',
      departureDate: '2015-07-08',
      hasReadRatePolicies: true,
      customer: '6', // TODO: customerID
      paymentInfo: {
        paymentMethod: 'cc', // credit card,
        ccPayment: {
          holderName: 'Test User',
          number: '378282246310005',
          expirationDate: '2015-07-07',
          securityCode: 123,
          typeCode: 'VI'
        }
      },
      rooms: [{roomId: 'TWNN', adults: 1, children: 5}]
    };

    var reservationPromise = reservationService.createReservation(reservationData)
      .then(function(data){
        $scope.confirmation = {
          reservationCode: data.reservationCode,
          email: user.getUser().email
        };
        $state.go('reservation.confirmation');

      }, function(){

    });

    preloaderFactory(reservationPromise);
  };

  // List of rooms for booking
  function getRooms(){
    var rooms = [];
    // NOTE: Currently we dont support advanced options
    // Booking only 1 room
    rooms.push({
      roomId: $stateParams.roomID,
      adults: parseInt($scope.bookingDetails.adults, 10) || 0,
      children: parseInt($scope.bookingDetails.children, 10) || 0
    });

    return rooms;
  }

  $scope.readPolicies = function(){
    $scope.hasReadRatePolicies = true;
    $scope.openPoliciesInfo();
  };

  $scope.prefillUserData = function(){
    if(!Object.keys($scope.userDetails).length){
      var userData = user.getUser();

      // No fields are touched yet, prefiling
      $window._.extend($scope.userDetails, {
        title: userData.title || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName,
        address: userData.address1 || '',
        city: userData.city || '',
        stateProvince: '',
        country: '',
        zip: userData.zip,
        phone: userData.tel1 || ''
      });
    }
  };

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();
  $scope.openCancelReservationDialog = modalService.openCancelReservationDialog;

  // If not logged in user
  $scope.openLoginDialog = modalService.openLoginDialog;
  $scope.openRegisterDialog = modalService.openRegisterDialog;
});
