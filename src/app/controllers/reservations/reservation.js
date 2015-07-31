'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService, $q,
  creditCardTypeService, breadcrumbsService, _, scrollService, $timeout){

  $scope.userDetails = {};
  $scope.possibleArrivalMethods = Settings.UI.arrivalMethods;
  $scope.additionalInfo = {};

  $scope.defaultCountryCode = Settings.UI.defaultCountryCode;

  function onAuthorized(isMobiusUser){
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
    preloaderFactory($q.all([roomDataPromise, propertyPromise]).then(function(){
      $rootScope.showHomeBreadCrumb = false;
      setBreadCrumbs(lastBreadCrumbName);
    }, goToRoom));

    // Updating users data
    prefillUserDetails(isMobiusUser ? user.getUser():{email:$stateParams.email});

    // Showing login/register dialog when user making reservation as not logged in
    // user. This doesn't apply for modifications
    if(!isMobiusUser && !$scope.isModifyingAsAnonymous()){
      modalService.openLoginDialog();
    }
  }

  function prefillUserDetails(userData){
    if(!userData){
      return;
    }

    if (!Object.keys($scope.userDetails).length) {
      // No fields are touched yet, prefiling
      _.extend($scope.userDetails, {
        title: userData.title || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        address: userData.address1 || '',
        city: userData.city || '',
        stateProvince: userData.state,
        country: userData.country,
        zip: userData.zip || '',
        phone: userData.tel1 || ''
      });
      $scope.userDetails.emailFromApi = !!userData.email;
    }

    if (!Object.keys($scope.additionalInfo).length) {
      // No fields are touched yet, prefiling
      _.extend($scope.additionalInfo, {
        arrivalTime: '',
        arrivalMethod: '',
        departureTime: '',
        secondPhoneNumber: userData.tel2 || '',
        comments: '',
        agree: false,
        optedIn: userData.optedIn || false
      });
    }
  }

  // Inheriting the login from RoomDetails controller
  $controller('RoomDetailsCtrl', {$scope: $scope});
  $controller('SSOCtrl', {$scope: $scope});
  $controller('CardExpirationCtrl', {$scope: $scope});
  // NOTE: Waiting for infiniti SSO auth events
  $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

  function goToRoom() {
    $state.go('room', {
      propertyCode: $stateParams.property,
      roomID: $stateParams.roomID
    });
  }

  // Redirecting to details page
  if($state.current.name === 'reservation'){
    $state.go('reservation.details');
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

  function scrollToDetails(target) {
    $timeout(function(){
      scrollService.scrollTo(target, 20);
    }, 100);
  }

  function setContinueName(stateName) {
    switch (stateName) {
    case 'reservation.details':
      setBreadCrumbs(GUEST_DETAILS);
      $scope.continueName = 'Continue';
      scrollToDetails('reservationDetailsForm');
      $rootScope.showHomeBreadCrumb = false;
      break;
    case 'reservation.billing':
      setBreadCrumbs(BILLING_DETAILS);
      $scope.continueName = 'Continue';
      scrollToDetails('reservationBillingForm');
      $rootScope.showHomeBreadCrumb = false;
      break;
    case 'reservation.confirmation':
      setBreadCrumbs(CONFIRMATION);
      $scope.continueName = 'Confirm';
      scrollToDetails('reservationConfirmation');
      $rootScope.showHomeBreadCrumb = false;
      break;
    case 'reservation.after':
      breadcrumbsService.clear()
        .addBreadCrumb('My stays', 'reservations')
        .addBreadCrumb($scope.reservation.reservationCode);
      $rootScope.showHomeBreadCrumb = false;
      break;
    }
  }

  var $stateChangeStartUnWatch = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    setContinueName(toState.name);
    $rootScope.showHomeBreadCrumb = false;
  });

  setContinueName($state.current.name);

  $scope.$on('$destroy', function() {
    $stateChangeStartUnWatch();
  });

  $scope.state = $state;

  $scope.forms = {};

  $scope.billingDetails = {
    card: {
      number: '',
      securityCode: '',
      holderName: ''
    },
    paymentMethod: null, // API: 'cc','paypal','bitcoint','point','bill'
    useGuestAddress: true
  };

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
      // NOTE: Pay with points is only available for logged in users
      $scope.pointsData = {};

      if(user.isLoggedIn()){
        if(user.getUser().loyalties){
          $scope.pointsData.currentPoints = user.getUser().loyalties.amount || 0;
        }

        $scope.pointsData.pointsEarned = $scope.selectedProduct.price.pointsEarned;
        $scope.pointsData.pointsAfterBooking = $scope.pointsData.currentPoints +
          $scope.selectedProduct.price.pointsEarned - $scope.selectedProduct.price.pointsRequired;
      }

      break;
    default:
      $scope.billingDetails.paymentMethod = 'cc';
    }
  };

  $scope.isValid = function() {
    if(!$scope.selectedProduct){
      return;
    }

    switch($state.current.name){
    case 'reservation.details':
      return $scope.forms.details && !$scope.forms.details.$invalid;
    case 'reservation.billing':
      switch ($scope.billingDetails.paymentMethod) {
      case 'point':
        if(user.isLoggedIn() && $scope.selectedProduct.price.pointsRequired){
          return user.getUser().loyalties.amount >= $scope.selectedProduct.price.pointsRequired;
        }
        break;
      }
      return $scope.forms.billing && !$scope.forms.billing.$invalid;
    case 'reservation.confirmation':
      return $scope.forms.additionalInfo && !$scope.forms.additionalInfo.$invalid;
    }
    return false;
  };

  $scope.isContinueDisabled = function(){
    // TODO: Do this better - might work via ng-class instead of disabled
    if($state.is('reservation.billing') && $scope.billingDetails.paymentMethod === 'point') {
      return !$scope.isValid();
    }

    return !$scope.isValid() && !$state.is('reservation.details') && !$state.is('reservation.billing');
  };

  $scope.continue = function() {
    switch ($state.current.name) {
    case 'reservation.details':
      if($scope.forms.details && !$scope.forms.details.$submitted){
        $scope.forms.details.$submitted = true;
      }

      if($scope.isValid()){
        $state.go('reservation.billing');
      }

      break;
    case 'reservation.billing':
      // TODO: Fix submited logic when paying with points billing form is
      // not required
      // TODO: Billing details on confirmation page should be removed
      // when paid with points
      if($scope.forms.billing && !$scope.forms.billing.$submitted){
        $scope.forms.billing.$submitted = true;
      }

      if($scope.isValid()){
        $state.go('reservation.confirmation');
      }
      break;
    case 'reservation.confirmation':
      if($scope.isValid()){
        $scope.makeReservation();
      }
      break;
    }
  };

  function createReservationData() {
    var reservationData = {
      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: true,
      rooms: getRooms(),
      paymentInfo: {
        paymentMethod: $scope.billingDetails.paymentMethod
      },

      guestFirstName: $scope.userDetails.firstName,
      guestLastName: $scope.userDetails.lastName
    };

    // Adding customerID when logged in
    if(user.isLoggedIn()){
      reservationData.customer = user.getUser().id;
    }else{
      // TODO: Anonymous reservation working but fails on getting
      // the data about created reservation back (API auth issue)
      reservationData.customerFirstName = $scope.userDetails.firstName;
      reservationData.customerLastName = $scope.userDetails.lastName;
      reservationData.customerEmail = $scope.userDetails.email;
    }

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
        expirationDate: $scope.getCardExpirationDate(),
        // TODO: Change input type
        securityCode: parseInt($scope.billingDetails.card.securityCode, 10),
        typeCode: $scope.getCreditCardDetails($scope.billingDetails.card.number).code
      };
    }


    // Product basePrice
    // NOTE - Pay with points requires price as well
    reservationData.price = $scope.selectedProduct.price.totalBase;

    if($scope.bookingDetails.promoCode){
      reservationData[bookingService.getCodeParamName($scope.bookingDetails.promoCode)] = $scope.bookingDetails.promoCode;
    }

    return reservationData;
  }

  $scope.makeReservation = function(){
    if(!$scope.additionalInfo.agree) {
      return modalService.openTermsAgreeDialog();
    }

    $scope.invalidFormData = false;

    var reservationData = createReservationData();
    // TODO: Check if phone number has changed before saving
    var userData = {
      tel2: $scope.additionalInfo.secondPhoneNumber,
      optedIn: $scope.additionalInfo.optedIn
    };
    userData.firstName = user.getUser().firstName;
    userData.lastName = user.getUser().lastName;

    var promises = [];
    if($stateParams.reservation){
      // Updating existing reservation
      promises.push(reservationService.modifyReservation($stateParams.reservation, reservationData,
        // Email parameter when user modifying as anonymous.
        $scope.isModifyingAsAnonymous()?$stateParams.email:null));
    }else{
      // Creating a new reservation
      promises.push(reservationService.createReservation(reservationData));
    }
    if(reservationData.customer){
      // Updating user profile when
      promises.push(user.updateUser(userData));
    }

    var reservationPromise = $q.all(promises).then(function(data) {
      userMessagesService.addMessage('' +
        '<div>Thank you for your reservation at ' + $scope.property.nameLong +'!</div>' +
        '<div class="small">A confirmation email will be sent to: <strong>' + $scope.userDetails.email + '</strong></div>');

      var reservationDetailsParams = {
        reservationCode: data[0].reservationCode,
        // Removing reservation code when booking modification is complete
        reservation: null
      };

      // When booked as anonymous we are adding customer email to the next route
      // so booking data can be fetched from the API
      if(!user.isLoggedIn()){
        reservationDetailsParams.email = reservationData.customerEmail;
      }

      $state.go('reservationDetail', reservationDetailsParams);
    }, function() {
      // TODO: Whaat request has failed
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

  $controller('ISOCountriesCtrl', {$scope: $scope});

  $scope.creditCardsIcons = _.pluck(Settings.UI.booking.cardTypes, 'icon');
  $scope.getCreditCardDetails = creditCardTypeService.getCreditCardDetails;
  $scope.getCreditCardPreviewNumber = creditCardTypeService.getCreditCardPreviewNumber;
});
