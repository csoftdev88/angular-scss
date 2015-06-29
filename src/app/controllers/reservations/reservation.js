'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService, $q,
  creditCardTypeService, breadcrumbsService){

  // Alias for lodash to get rid of ugly $window._ calls
  var _ = $window._;

  function goToRoom() {
    $state.go('room', {
      propertyCode: $stateParams.property,
      roomID: $stateParams.roomID
    });
  }

  var GUEST_DETAILS = 'Guest details';
  var BILLING_DETAILS = 'Billing details';
  var CONFIRMATION = 'Confirmation';

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();

  var lastBreadCrumbName = '';
  var setBreadCrumbs = function(name) {
    lastBreadCrumbName = name;
  };

  function setContinueName(stateName) {
    switch (stateName) {
    case 'reservation.details':
      setBreadCrumbs(GUEST_DETAILS);
      $scope.continueName = 'Payment';
      break;
    case 'reservation.billing':
      setBreadCrumbs(BILLING_DETAILS);
      $scope.continueName = 'Confirmation';
      break;
    case 'reservation.confirmation':
      setBreadCrumbs(CONFIRMATION);
      $scope.continueName = 'Confirm';
      break;
    case 'reservation.after':
      breadcrumbsService.clear()
        .addBreadCrumb('My stays', 'reservations')
        .addBreadCrumb($scope.reservation.reservationCode);
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
    paymentMethod: null, // API: 'cc','paypal','bitcoint','point','bill'
    useGuestAddress: true
  };

  $scope.possibleArrivalMethods = Settings.UI.arrivalMethods;

  $scope.additionalInfo = {
    arrivalTime: '',
    arrivalMethod: '',
    departureTime: '',
    secondPhoneNumber: '',
    comments: '',
    agree: false,
    optedIn: false
  };

  // Inheriting the login from RoomDetails controller
  $controller('RoomDetailsCtrl', {$scope: $scope});
  $controller('SSOCtrl', {$scope: $scope});

  // Getting room/products data
  var roomDataPromise = $scope.getRoomData($stateParams.property, $stateParams.roomID).then(function(data){
    $scope.setRoomDetails(data.roomDetails);
    setProductDetails(data.roomProductDetails.products);
    return data;
  });

  var propertyPromise = propertyService.getPropertyDetails($stateParams.property).then(function(property) {
    $scope.property = property;
    return property;
  });

  // Showing loading mask
  preloaderFactory($q.all([roomDataPromise, propertyPromise]).then(function(data){
    setBreadCrumbs = function(name) {
      breadcrumbsService
        .addBreadCrumb(data[1].nameShort, 'hotel', {propertyCode: $stateParams.property})
        .addBreadCrumb('Rooms', 'hotel', {propertyCode: $stateParams.property}, 'jsRooms')
        .addBreadCrumb(data[0].roomDetails.name, 'hotel', {propertyCode: $stateParams.property, roomID: $stateParams.roomID})
        .addBreadCrumb(name)
        .addHref(GUEST_DETAILS)
        .addHref(BILLING_DETAILS)
        .addHref(CONFIRMATION)
        .setActiveHref(name)
      ;
    };
    setBreadCrumbs(lastBreadCrumbName);
  }, goToRoom));

  function setProductDetails(products){
    // Finding the product which user about to book
    var product = _.findWhere(products,
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
      return goToRoom();
    case 'reservation.billing':
      return $state.go('reservation.details');
    case 'reservation.confirmation':
      return $state.go('reservation.billing');
    }
  };

  $scope.selectPaymentMethod = function(paymentMethod) {
    switch (paymentMethod) {
    case 'cc':
      $scope.billingDetails.paymentMethod = 'cc';
      break;
    case 'point':
      $scope.billingDetails.paymentMethod = 'point';
      $scope.pointsData = {};
      $scope.pointsData.currentPoints = user.getUser().loyalties.amount;
      $scope.pointsData.pointsEarned = $scope.selectedProduct.price.pointsEarned;
      $scope.pointsData.pointsAfterBooking = $scope.pointsData.currentPoints +
        $scope.selectedProduct.price.pointsEarned - $scope.selectedProduct.price.pointsRequired;
      break;
    default:
      $scope.billingDetails.paymentMethod = 'cc';
    }
  };

  $scope.isValid = function() {
    switch($state.current.name){
    case 'reservation.details':
      return $scope.forms.details && !$scope.forms.details.$invalid;
    case 'reservation.billing':
      switch ($scope.billingDetails.paymentMethod) {
      case 'point':
        return user.getUser().loyalties.amount >= $scope.selectedProduct.price.pointsRequired;
      }
      return $scope.forms.billing && !$scope.forms.billing.$invalid;
    case 'reservation.confirmation':
      return $scope.additionalInfo.agree && $scope.forms.additionalInfo && !$scope.forms.additionalInfo.$invalid;
    }
    return false;
  };

  $scope.continue = function() {
    if ($scope.isValid()) {
      switch ($state.current.name) {
      case 'reservation.details':
        return $state.go('reservation.billing') && true;
      case 'reservation.billing':
        return $state.go('reservation.confirmation') && true;
      case 'reservation.confirmation':
        return $scope.makeReservation() && true;
      }
    }
  };

  function createReservationData() {
    var reservationData = {
      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: true,
      rooms: getRooms(),
      customer: user.getUser().id,
      paymentInfo: {
        paymentMethod: $scope.billingDetails.paymentMethod
      },

      guestFirstName: $scope.userDetails.firstName,
      guestLastName: $scope.userDetails.lastName
    };

    if($scope.additionalInfo.arrivalTime) {
      reservationData.arrivalTime = $scope.additionalInfo.arrivalTime;
    }

    if($scope.additionalInfo.arrivalMethod) {
      reservationData.arrivalMethod = $scope.additionalInfo.arrivalMethod;
    }

    if($scope.additionalInfo.departureTime) {
      reservationData.departureTime = $scope.additionalInfo.departureTime;
    }

    if($scope.additionalInfo.comments) {
      reservationData.comments = $scope.additionalInfo.comments;
    }

    if (reservationData.paymentInfo.paymentMethod === 'cc') {
      reservationData.paymentInfo.ccPayment = {
        holderName: $scope.billingDetails.card.holderName,
        number: $scope.billingDetails.card.number,
        // Last day of selected month
        expirationDate: $window.moment($scope.billingDetails.card.expirationDate).endOf('month').format('YYYY-MM-DD'),
        // TODO: Change input type
        securityCode: parseInt($scope.billingDetails.card.securityCode, 10),
        typeCode: $scope.getCreditCardDetails($scope.billingDetails.card.number).code
      };
    }

    if($scope.bookingDetails.promoCode){
      reservationData[bookingService.getCodeParamName($scope.bookingDetails.promoCode)] = $scope.bookingDetails.promoCode;
    }

    return reservationData;
  }

  $scope.makeReservation = function(){
    $scope.invalidFormData = false;

    var reservationData = createReservationData();
    var userData = {
      tel2: $scope.additionalInfo.secondPhoneNumber,
      optedIn: $scope.additionalInfo.optedIn
    };
    var reservationPromise = $q.all([
      reservationService.createReservation(reservationData),
      user.updateUser(userData)
    ]).then(function(data) {
      userMessagesService.addInfoMessage('' +
        '<div>Thank you for your reservation at The Sutton Place Hotel Vancouver!</div>' +
        '<div class="small">A confirmation emaill will be sent to: <strong>' + $scope.userDetails.email + '</strong></div>' +
        '');

      $state.go('reservationDetail', {reservationCode: data[0].reservationCode});
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
    $scope.openPoliciesInfo($scope.selectedProduct);
  };

  $scope.prefillUserData = function(){
    var userData = user.getUser();

    if(!Object.keys($scope.userDetails).length){
      // No fields are touched yet, prefiling
      _.extend($scope.userDetails, {
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

    $scope.additionalInfo.secondPhoneNumber = userData.tel2 || '';
    $scope.additionalInfo.optedIn = user.getUser().optedIn || false;
  };

  $scope.creditCardsIcons = _.pluck(Settings.UI.booking.cardTypes, 'icon');
  $scope.getCreditCardDetails = creditCardTypeService.getCreditCardDetails;
});
