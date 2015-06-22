'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService){

  function setContinueName(stateName) {
    switch (stateName) {
    case 'reservation.details':
      $scope.continueName = 'Payment';
      break;
    case 'reservation.billing':
      $scope.continueName = 'Confirmation';
      break;
    case 'reservation.confirmation':
      $scope.continueName = 'Confirm';
      break;
    }
  }
  var $stateChangeStartUnWatch = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    setContinueName(toState.name);
  });
  setContinueName($state.current.name);

  $scope.$on('$destroy', function() {
    $stateChangeStartUnWatch();
  });

  $scope.expirationMinDate = $window.moment().format('YYYY-MM');

  // Redirecting to details page
  if($state.current.name === 'reservation'){
    $state.go('reservation.details');
  }

  $scope.state = $state;

  $scope.forms = {};

  $scope.userDetails = {};

  $scope.billingDetails = {
    card: {
      number: '',
      expirationDate: '',
      securityCode: '',
      holderName: ''
    },
    paymentMethod: null, // 'cc','paypal','bitcoint','point','bill'
    useGuestAddress: true
  };

  // Inheriting the login from RoomDetails controller
  $controller('RoomDetailsCtrl', {$scope: $scope});

  // Getting room/products data
  var roomDataPromise = $scope.getRoomData(
    $stateParams.property, $stateParams.roomID).then(function(data){
    $scope.setRoomDetails(data.roomDetails);
    setProductDetails(data.roomProductDetails.products);

    return propertyService.getPropertyDetails(data.roomDetails.propertytCode).then(function(property) {
      $scope.property = property;
    });
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

    $scope.selectedProduct = product;
  }

  $scope.goBack = function() {
    switch ($state.current.name) {
    case 'reservation.details':
      return $state.go('room', {
        propertyCode: $scope.bookingDetails.property,
        roomID: $stateParams.roomID
      });
    case 'reservation.billing':
      return $state.go('reservation.details');
    case 'reservation.confirmation':
      return $state.go('reservation.billing');
    }
  };

  $scope.isValid = function() {
    switch($state.current.name){
    case 'reservation.details':
      return $scope.forms.details && !$scope.forms.details.$invalid;
    case 'reservation.billing':
      return $scope.forms.billing && !$scope.forms.billing.$invalid;
    case 'reservation.confirmation':
      return true;
    }
    return false;
  };

  $scope.continue = function() {
    if ($scope.isValid()) {
      switch ($state.current.name) {
      case 'reservation.details':
        return $state.go('reservation.billing');
      case 'reservation.billing':
        return $state.go('reservation.confirmation');
      case 'reservation.confirmation':
        return $scope.makeReservation();
      }
    }
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
        paymentMethod: $scope.billingDetails.paymentMethod,
        ccPayment: {
          holderName: $scope.billingDetails.card.holderName,
          number: $scope.billingDetails.card.number,
          // Last day of selected month
          expirationDate:  $window.moment($scope.billingDetails.card.expirationDate).endOf('month').format('YYYY-MM-DD'),
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
        $scope.reservation = data;
        if(!$scope.reservation.bookDate) {
          $scope.reservation.bookDate = $window.moment();
        } else {
          $scope.reservation.bookDate = $window.moment($scope.reservation.bookDate);
        }
        $scope.reservation.bookDateFormatted = $scope.reservation.bookDate.format('D MMM YYYY');

        userMessagesService.addInfoMessage('' +
          '<div>Thank you for your reservation at The Sutton Place Hotel Vancouver!</div>' +
          '<div class="small">A confirmation emaill will be sent to: <strong>' + $scope.userDetails.email + '</strong></div>' +
          '');

        $state.go('reservation.after');

      }, function() {
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
    $scope.openPoliciesInfo($scope.selectedProduct);
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
});
