'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings,
  reservationService, preloaderFactory, modalService, user){

  $scope.expirationMinDate = $window.moment().format('YYYY-MM-DD');

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
    $scope.invalidFormData = false;

    var reservationData = {
      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: $scope.hasReadRatePolicies || false,
      rooms: getRooms(),
      customer: user.getUser().id,
      paymentInfo: {
        paymentMethod: 'cc', // credit card,
        ccPayment: {
          holderName: $scope.billingDetails.card.holderName,
          number: $scope.billingDetails.card.number,
          expirationDate: $scope.billingDetails.card.expirationDate,
          securityCode: $scope.billingDetails.card.securityCode,
          typeCode: $scope.getCreditCardDetails($scope.billingDetails.card.number).code || 'VI'
        }
      },

      guestFirstName: $scope.userDetails.firstName,
      guestLastName: $scope.userDetails.lastName
    };

    if($scope.bookingDetails.promoCode){
      reservationData.promoCode = $scope.bookingDetails.promoCode;
    }

    var reservationPromise = reservationService.createReservation(reservationData)
      .then(function(data){
        $scope.confirmation = {
          reservationCode: data.reservationCode,
          email: user.getUser().email
        };
        $state.go('reservation.confirmation');

      }, function(){
      $scope.invalidFormData = true;
      $state.go('reservation.details');
    });

    preloaderFactory(reservationPromise);
  };

  // List of rooms for booking
  function getRooms(){
    var rooms = [];
    // NOTE: Currently we dont support advanced options
    // Booking only 1 room
    rooms.push({
      roomId: $scope.selectedProduct.productPropertyRoomTypeId,
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

  $scope.getCreditCardDetails = function(number){
    if(number){
      for(var type in Settings.UI.booking.cardTypes){
        var cardDetails = Settings.UI.booking.cardTypes[type];
        var regexObj = cardDetails.regex;
        if(regexObj.test(number)){
          return {
            icon: cardDetails.icon,
            code: cardDetails.code
          };
        }
      }
    }

    return null;
  };

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();
  $scope.openCancelReservationDialog = modalService.openCancelReservationDialog;

  // If not logged in user
  $scope.openLoginDialog = modalService.openLoginDialog;
  $scope.openRegisterDialog = modalService.openRegisterDialog;
});
