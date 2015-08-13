'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings, $log,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService, $q,
  creditCardTypeService, breadcrumbsService, _, scrollService, $timeout){

  $scope.userDetails = {};
  $scope.possibleArrivalMethods = Settings.UI.arrivalMethods;
  $scope.additionalInfo = {};

  $scope.defaultCountryCode = Settings.UI.defaultCountryCode;

  $scope.isMultiRoomMode = bookingService.isMultiRoomBooking();

  var multiRoomData;

  function onAuthorized(isMobiusUser){
    // Getting room/products data
    //
    var roomsPromises = [];
    var rooms;
    $scope.allRooms = [];

    if(!$scope.isMultiRoomMode){
      // Getting single room details
      // One room booking
      rooms = [];
      rooms.push({
        property: $stateParams.property,
        roomID: $stateParams.roomID,
        productCode: $stateParams.productCode
      });
    } else {
      multiRoomData = bookingService.getMultiRoomData();
      rooms = multiRoomData.map(function(room){
        return {
          property: $stateParams.property,
          roomID: room.roomID,
          productCode: room.productCode
        };
      });
    }

    // Loading all the rooms;
    roomsPromises = rooms.map(function(room){
      return getRoomPromise(room);
    });

    var propertyPromise = propertyService.getPropertyDetails($stateParams.property).then(function(property) {
      $scope.property = property;
      return property;
    });

    // Showing loading mask
    preloaderFactory($q.all([$q.all(roomsPromises), propertyPromise]).then(function(){
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

  function getRoomPromise(room){
    return $scope.getRoomData($stateParams.property, room.roomID).then(function(data){
      var roomData = data.roomDetails;
      var product = _.findWhere(data.roomProductDetails.products,
        {
          code: room.productCode
        }
      );

      // TODO if !product - redirect
      roomData._selectedProduct = product;

      $scope.allRooms.push(roomData);
    });
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
        country: userData.iso3,
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

    $scope.autofillSync(1000);
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

  if(!user.isLoggedIn()){
    $scope.billingDetails.paymentMethod = 'cc';
  }

  $scope.goBack = function() {
    switch ($state.current.name) {
    case 'reservation.details':
      goToRoom();
      $scope.autofillSync();
      break;
    case 'reservation.billing':
      $state.go('reservation.details');
      $scope.autofillSync();
      break;
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
      $scope.pointsData = {
        pointsRequired: $scope.getTotal('pointsRequired')
      };

      if(user.isLoggedIn()){
        if(user.getUser().loyalties){
          $scope.pointsData.currentPoints = user.getUser().loyalties.amount || 0;
        }

        $scope.pointsData.pointsEarned = $scope.getTotal('pointsEarned');
        $scope.pointsData.pointsAfterBooking = $scope.pointsData.currentPoints +
          $scope.getTotal('pointsEarned') - $scope.getTotal('pointsRequired');
      }

      break;
    default:
      $scope.billingDetails.paymentMethod = 'cc';
    }
  };

  $scope.isValid = function() {
    if($scope.allRooms && $scope.allRooms.length){
      switch($state.current.name){
      case 'reservation.details':
        return $scope.forms.details && !$scope.forms.details.$invalid;
      case 'reservation.billing':
        switch ($scope.billingDetails.paymentMethod) {
        case 'point':
          if(user.isLoggedIn() && $scope.getTotal('pointsRequired')){
            return user.getUser().loyalties.amount >= $scope.getTotal('pointsRequired');
          }
          break;
        }
        return $scope.forms.billing && !$scope.forms.billing.$invalid;
      case 'reservation.confirmation':
        return $scope.forms.additionalInfo && !$scope.forms.additionalInfo.$invalid;
      }
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
        $scope.autofillSync();
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
    reservationData.price = $scope.getTotal('totalBase');

    if($scope.bookingDetails.promoCode){
      reservationData[bookingService.getCodeParamName($scope.bookingDetails.promoCode)] = $scope.bookingDetails.promoCode;
    }else if($scope.bookingDetails.groupCode){
      reservationData[bookingService.getCodeParamName($scope.bookingDetails.groupCode)] = $scope.bookingDetails.groupCode;
    }else if($scope.bookingDetails.corpCode){
      reservationData[bookingService.getCodeParamName($scope.bookingDetails.corpCode)] = $scope.bookingDetails.corpCode;
    }

    return reservationData;
  }

  // TODO - move to common CTRL or service
  $scope.getTotal = function(prop){
    // Returning a total price of all products
    return _.reduce(
      _.map($scope.allRooms, function(room){
        return room._selectedProduct.price[prop];
      }), function(t, n){
        return t + n;
      });
  };

  $scope.getGuestsCount = function(type){
    if($scope.isMultiRoomMode){
      return _.reduce(
      _.map(multiRoomData, function(room){
        return room[type];
      }), function(t, n){
        return t + n;
      });
    }

    return $scope.bookingDetails[type];
  };

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

      // Removing reservation details from the URL
      reservationDetailsParams.room = null;
      reservationDetailsParams.rooms = null;

      // Newly created reservation
      reservationDetailsParams.view = 'summary';
      $state.go('reservationDetail', reservationDetailsParams);
    }, function() {
      // TODO: Whaat request has failed
      $scope.invalidFormData = true;
      $state.go('reservation.details');
    });

    preloaderFactory(reservationPromise);
  };

  $scope.openOtherRoomsDialog = function(){
    // Getting rooms settings
    var roomsSettings = bookingService.getMultiRoomData();

    var rooms = $scope.allRooms.map(function(room){
      // Adding guests details
      var roomSettings = _.findWhere(roomsSettings, {roomID: room.code});
      room._adults = roomSettings.adults;
      room._children = roomSettings.children;
      return room;
    });

    modalService.openOtherRoomsDialog(rooms);
  };

  // List of rooms for booking
  function getRooms(){
    var rooms;

    if($scope.isMultiRoomMode){
      var multiRoomData = bookingService.getMultiRoomData();

      rooms = multiRoomData.map(function(roomSettings){
        // Finding corresponding room and product
        var room = _.findWhere($scope.allRooms, {code: roomSettings.roomID});
        if(room){
          return {
            roomId: room._selectedProduct.productPropertyRoomTypeId,
            adults: roomSettings.adults,
            children: roomSettings.children
          };
        }else{
          $log.info('Cant find room with code:"'+ roomSettings.roomID + '"' );
        }
      });

    }else{
      // Single room booking
      rooms = [{
        roomId: $scope.allRooms[0]._selectedProduct.productPropertyRoomTypeId,
        adults: parseInt($scope.bookingDetails.adults, 10) || 0,
        children: parseInt($scope.bookingDetails.children, 10) || 0
      }];
    }

    return rooms;
  }

  $scope.readPolicies = function(){
    if($scope.allRooms && $scope.allRooms.length){
      var products = $scope.allRooms.map(function(room){
        return room._selectedProduct;
      });

      $scope.openPoliciesInfo(products);
    }
  };

  $controller('ISOCountriesCtrl', {$scope: $scope});

  $scope.openPriceBreakdownInfo = function(){
    if($scope.allRooms && $scope.allRooms.length){
      modalService.openPriceBreakdownInfo($scope.allRooms);
    }
  };

  $scope.creditCardsIcons = _.pluck(Settings.UI.booking.cardTypes, 'icon');
  $scope.getCreditCardDetails = creditCardTypeService.getCreditCardDetails;
  $scope.getCreditCardPreviewNumber = creditCardTypeService.getCreditCardPreviewNumber;
  $controller('PriceCtr', {$scope: $scope});
  $controller('AutofillSyncCtrl', {$scope: $scope});
});
