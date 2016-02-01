'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings, $log,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService, $q,
  creditCardTypeService, breadcrumbsService, _, scrollService, $timeout, dataLayerService, userObject, contentService, chainService, metaInformationService, $location, stateService){

  $scope.chain = {};
  $scope.chainName = Settings.UI.hotelDetails.chainPrefix;
  $scope.isMakingReservation = false;
  $scope.isMobile = stateService.isMobile();

  //get meta information
  chainService.getChain(Settings.API.chainCode).then(function(chain) {
    $scope.chain = chain;

    $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
    $scope.chain.meta.microdata.og['og:title'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:title'];
    $scope.chain.meta.microdata.og['og:description'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:description'];

    setMetaInformation();

  });

  function setMetaInformation(){
    if(!$scope.chain.meta){
      return;
    }
    metaInformationService.setPageTitle($scope.chain.meta.pagetitle);
    metaInformationService.setMetaDescription($scope.chain.meta.description);
    metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
    metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
  }

  $scope.userDetails = {};
  $scope.possibleArrivalMethods = Settings.UI.arrivalMethods;
  $scope.additionalInfo = {};

  $scope.defaultCountryCode = Settings.UI.defaultCountryCode;
  $scope.preferredCountryCodes = Settings.UI.preferredCountryCodes;
  $scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;

  $scope.isMultiRoomMode = bookingService.isMultiRoomBooking();

  $scope.invalidFormData = {
    error: false,
    msg: null,
    email: false,
    payment: false,
    cardName: false,
    paymentType: false,
    expiryDate: false,
    ccExpired: false,
    ccvInvalid: false,
    ccNumberInvalid: false,
    generic: false
  };

  var multiRoomData;
  var multiRoomDataLoaded = 0;
  var previousState = {
    state: $state.fromState,
    params: $state.fromParams
  };

  $scope.$on('USER_LOGIN_EVENT', function(){
    prefillUserDetails(user.isLoggedIn ? user.getUser() : {email:$stateParams.email}, true);
  });
  
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

    var titlesPromise = contentService.getTitles().then(function(data) {
      $scope.profileTitles = data;
    });

    // Showing loading mask
    preloaderFactory($q.all([$q.all(roomsPromises), propertyPromise, titlesPromise]).then(function(){
      $rootScope.showHomeBreadCrumb = false;
      setBreadCrumbs(lastBreadCrumbName);
    }, goToRoom));


    // Showing login/register dialog when user making reservation as not logged in
    // user. This doesn't apply for modifications or if loyalty program is disbaled
    if(!isMobiusUser && !$scope.isModifyingAsAnonymous() && Settings.authType === 'infiniti'){
      modalService.openLoginDialog();
    }

    //If modifying as logged in user
    if($stateParams.reservation && !$scope.isModifyingAsAnonymous()){

      reservationService.getReservation($stateParams.reservation, null).then(function(reservation) {

        $scope.userDetails.title = reservation.rooms[0].guestTitle;
        $scope.userDetails.firstName = reservation.rooms[0].firstName;
        $scope.userDetails.lastName = reservation.rooms[0].lastName;
        $scope.userDetails.email = reservation.rooms[0].guestEmail;
        $scope.userDetails.address = reservation.rooms[0].guestAddress;
        $scope.userDetails.city = reservation.rooms[0].guestCity;
        $scope.userDetails.zip = reservation.rooms[0].guestZip;
        $scope.userDetails.stateProvince = reservation.rooms[0].guestState;
        $scope.userDetails.country = reservation.rooms[0].guestCountry;
        $scope.userDetails.phone = reservation.rooms[0].guestPhone;

        $scope.additionalInfo.arrivalTime = reservation.arrivalTime;
        $scope.additionalInfo.arrivalMethod = reservation.arrivalMethod;
        $scope.additionalInfo.departureTime = reservation.departureTime;
        $scope.additionalInfo.comments = reservation.comments;
        $scope.additionalInfo.secondPhoneNumber = reservation.secondPhoneNumber;
        $scope.additionalInfo.optedIn = reservation.optedIn;

        $scope.billingDetails.useGuestAddress = reservation.rooms[0].billingAddress ? false : true;

        $scope.billingDetails.address = reservation.rooms[0].billingAddress;
        $scope.billingDetails.city = reservation.rooms[0].billingCity;
        $scope.billingDetails.zip = reservation.rooms[0].billingZip;
        $scope.billingDetails.stateProvince = reservation.rooms[0].billingState;
        $scope.billingDetails.phone = reservation.rooms[0].billingPhone;
        $scope.billingDetails.country = reservation.rooms[0].billingCountry;
        
      });

    }
    //If modifying as anonymous user
    else if($scope.isModifyingAsAnonymous()){
      var reservationParams = {
        email: $stateParams.email
      };

      reservationService.getReservation($stateParams.reservation, reservationParams).then(function(reservation) {

        $scope.additionalInfo.arrivalTime = reservation.arrivalTime;
        $scope.additionalInfo.arrivalMethod = reservation.arrivalMethod;
        $scope.additionalInfo.departureTime = reservation.departureTime;
        $scope.additionalInfo.comments = reservation.comments;
        $scope.additionalInfo.secondPhoneNumber = reservation.secondPhoneNumber;
        $scope.additionalInfo.optedIn = reservation.optedIn;

        $scope.billingDetails.useGuestAddress = reservation.rooms[0].billingAddress ? false : true;

        $scope.billingDetails.address = reservation.rooms[0].billingAddress;
        $scope.billingDetails.city = reservation.rooms[0].billingCity;
        $scope.billingDetails.zip = reservation.rooms[0].billingZip;
        $scope.billingDetails.stateProvince = reservation.rooms[0].billingState;
        $scope.billingDetails.phone = reservation.rooms[0].billingPhone;
        $scope.billingDetails.country = reservation.rooms[0].billingCountry;

        reservationService.getAnonUserProfile(reservation.customer.id, $stateParams.email).then(function(data) {

          $scope.userDetails.title = data.title;
          $scope.userDetails.firstName = data.firstName;
          $scope.userDetails.lastName = data.lastName;
          $scope.userDetails.email = data.email;
          $scope.userDetails.address = data.address1;
          $scope.userDetails.city = data.city;
          $scope.userDetails.zip = data.zip;
          $scope.userDetails.stateProvince = data.state;
          $scope.userDetails.country = data.country;
          $scope.userDetails.phone = data.tel1;
          $scope.additionalInfo.secondPhoneNumber = data.tel2;
          $scope.additionalInfo.optedIn = data.optedIn;
        });
      });
    }
    //If new reservation
    else{
      prefillUserDetails(isMobiusUser || userObject.token ? user.getUser() : {email : $stateParams.email});
    }
    
    scrollToDetails('reservationDetailsForm');

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
      if(product){
        roomData._selectedProduct = product;
        $scope.allRooms.push(roomData);

        //if multiroom, wait for all rooms data to be loaded before tracking products checkout
        if(!$scope.isMultiRoomMode){
          trackProductCheckout(1);
        } else {
          multiRoomDataLoaded++;
          if(multiRoomDataLoaded === multiRoomData.length){
            trackProductCheckout(1);
          }
        }
      }

    });
  }

  function prefillUserDetails(userData, isMobius){
    if(!userData){
      return;
    }

    if (!Object.keys($scope.userDetails).length || isMobius) {
      // No fields are touched yet, prefiling
      _.extend($scope.userDetails, {
        title: userData.title || null,
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

    if (!Object.keys($scope.additionalInfo).length || isMobius) {
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
    $state.go(previousState.state, previousState.params);
  }

  // Redirecting to details page
  if($state.current.name === 'reservation'){
    $state.go('reservation.details');
    setMetaInformation();
  }

  var GUEST_DETAILS = 'Guest details';
  var BILLING_DETAILS = 'Billing details';
  var CONFIRMATION = 'Confirmation';

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();
  var numNights = $window.moment($scope.bookingDetails.to).diff($scope.bookingDetails.from, 'days');

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
      if($scope.invalidFormData.error){
        //scrollToDetails('alert-warning');
      }
      else{
        scrollToDetails('reservationDetailsForm');
      }
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
    setMetaInformation();
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
    //disbale when making reservation
    if($state.is('reservation.confirmation') && $scope.isMakingReservation) {
      return true;
    }
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
        trackProductCheckout(2);
      }
      else{
        //scrollToDetails('form-errors');
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
        trackProductCheckout(3);
      }
      else{
        //scrollToDetails('form-errors');
      }
      break;
    case 'reservation.confirmation':
      if($scope.isValid()){
        $scope.isMakingReservation = true;
        $scope.makeReservation();
      }
      break;
    }
    setMetaInformation();
  };

  function trackProductCheckout(stepNum){

    if(!$scope.allRooms || !$scope.allRooms.length){
      return;
    }
    // Tracking checkout
    //TODO: need actionField so needs to be moved further into booking flow
    chainService.getChain(Settings.API.chainCode).then(function(chainData) {
      propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
        var products = [];

        _.each($scope.allRooms, function(room){
          var product = {
            name: room._selectedProduct.name,
            id: room._selectedProduct.code,
            price: (room._selectedProduct.price.totalBase/numNights).toFixed(2),
            quantity: numNights,
            dimension2: chainData.nameShort,
            brand: propertyData.nameLong,
            dimension1: propertyData.nameShort,
            list: 'Room',
            category: room.name
          };
          products.push(product);
        });

        dataLayerService.trackProductsCheckout(products, stepNum);
        
      });
    });
  }

  function createReservationData() {

    var reservationData = {
      guestTitle: $scope.userDetails.title,
      guestFirstName: $scope.userDetails.firstName,
      guestLastName: $scope.userDetails.lastName,
      guestEmail: $scope.userDetails.email,
      guestPhone: $scope.userDetails.phone,
      guestAddress: $scope.userDetails.address,
      guestCity: $scope.userDetails.city,
      guestZip: $scope.userDetails.zip,
      guestStateProvince: $scope.userDetails.stateProvince,
      guestCountry: $scope.userDetails.country,

      billingDetailsUseGuestAddress: $scope.billingDetails.useGuestAddress,
      optedIn: $scope.additionalInfo.optedIn,

      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: true,
      rooms: getRooms(),
      paymentInfo: {
        paymentMethod: $scope.billingDetails.paymentMethod
      }
      
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

    //Additional info
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

    if($scope.additionalInfo.secondPhoneNumber) {
      reservationData.secondPhoneNumber = $scope.additionalInfo.secondPhoneNumber;
    }

    

    //Payment details
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

    //Billing details if different than guest details
    if(!$scope.billingDetails.useGuestAddress){
      reservationData.billingAddress = $scope.billingDetails.address;
      reservationData.billingCity = $scope.billingDetails.city;
      reservationData.billingZip = $scope.billingDetails.zip;
      reservationData.billingStateProvince = $scope.billingDetails.stateProvince;
      reservationData.billingPhone = $scope.billingDetails.phone;
      reservationData.billingCountry = $scope.billingDetails.country;
    }

    // Product basePrice
    // NOTE - Pay with points requires price as well
    reservationData.price = $scope.getTotal('totalBase');

    if($scope.bookingDetails.promoCode){
      // NOTE: Originally implemented using getCodeParamName as
      // reservationData[bookingService.getCodeParamName($scope.bookingDetails.corpCode)] = $scope.bookingDetails.corpCode;
      // Keep this for the future
      reservationData[Settings.API.promoCodes.promoCode] = $scope.bookingDetails.promoCode;
    }else if($scope.bookingDetails.groupCode){
      reservationData.groupCode = $scope.bookingDetails.groupCode;
    }else if($scope.bookingDetails.corpCode){
      reservationData.corpCode = $scope.bookingDetails.corpCode;
    }

    return reservationData;
  }

  // TODO - move to common CTRL or service
  $scope.getTotal = function(prop){
    // Returning a total price of all products
    return _.reduce(
      _.map($scope.allRooms, function(room){
        if(prop ==='pointsEarned'){
          return room._selectedProduct.productAwardPoints ? room._selectedProduct.priceOriginal[prop] : 0;
        }
        else{
          return room._selectedProduct.priceOriginal[prop];
        }
        
      }), function(t, n){
        return t + n;
      });
  };

  $scope.getBreakdown = function(prop){
    // Returning a total price of all products
    return _.reduce(
      _.map($scope.allRooms, function(room){
        return room._selectedProduct.priceOriginal.breakdowns[0][prop];
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

  function addReservationConfirmationMessage(reservationNumber){
    userMessagesService.addMessage('' +
        '<div>Thank you for your reservation at ' + $scope.property.nameLong +'!</div>' +
        '<div class="small">Your web booking code is <strong>' + reservationNumber + '</strong>. You will receive an email shortly that contains your reservation reference number.</div>');
  }

  $scope.makeReservation = function(){
    if(!$scope.additionalInfo.agree) {
      $scope.isMakingReservation = false;
      return modalService.openTermsAgreeDialog();
    }

    //Reset errors
    $scope.invalidFormData = {
      error: false,
      msg: null,
      email: false,
      payment: false,
      cardName: false,
      paymentType: false,
      expiryDate: false,
      ccExpired: false,
      ccvInvalid: false,
      ccNumberInvalid: false,
      generic: false
    };

    var reservationData = createReservationData();
    

    var promises = [];
    if($stateParams.reservation){
      // Updating existing reservation
      promises.push(reservationService.modifyReservation($stateParams.reservation, reservationData,
        // Email parameter when user modifying as anonymous.
        $scope.isModifyingAsAnonymous() ? $stateParams.email : null));
    }else{
      // Creating a new reservation
      promises.push(reservationService.createReservation(reservationData));
    }


    var reservationPromise = $q.all(promises).then(function(data) {
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

      // Tracking purchase
      var products = $scope.allRooms.map(function(room){
        var p = room._selectedProduct;

        return {
          name: p.name,
          code: p.code,
          tax: p.price.totalAfterTax - p.price.totalBase,
          price: p.price.totalAfterTax
        };
      });

      dataLayerService.trackProductsPurchase(products, {
        // Transaction ID
        id: reservationDetailsParams.reservationCode,
        'affiliation': 'Hotel',
        'revenue': (products[0].price/numNights).toFixed(2),
        'quantity': numNights,
        'tax': products[0].tax,
        'coupon': $scope.bookingDetails.promoCode || $scope.bookingDetails.groupCode || $scope.bookingDetails.corpCode || null

      });

      //$state.go('reservationDetail', reservationDetailsParams);

      //creating anon user account
      if(!user.isLoggedIn()){
        
        var anonUserData = {
          title: $scope.userDetails.title,
          firstName: $scope.userDetails.firstName,
          lastName: $scope.userDetails.lastName,
          address1: $scope.userDetails.address,
          city: $scope.userDetails.city,
          zip: $scope.userDetails.zip,
          state: $scope.userDetails.stateProvince,
          country: $scope.userDetails.country,
          tel1: $scope.userDetails.phone,
          tel2: $scope.additionalInfo.secondPhoneNumber,
          optedIn: $scope.additionalInfo.optedIn
        };
        
        var params = {
          email: $scope.userDetails.email
        };

        reservationService.getReservation(reservationDetailsParams.reservationCode, params).then(function(reservation) {
          reservationService.updateAnonUserProfile(reservation.customer.id, params.email, anonUserData).then(function() {
            bookingService.clearParams();
            $state.go('reservationDetail', reservationDetailsParams);
            addReservationConfirmationMessage(data[0].reservationCode);
          });
        });
      }
      else{
        if (reservationData.paymentInfo.paymentMethod === 'point' && user.isLoggedIn) {
          userObject.loyalties.amount = $scope.pointsData.currentPoints - $scope.getTotal('pointsRequired');
        }
        bookingService.clearParams();
        $state.go('reservationDetail', reservationDetailsParams);
        addReservationConfirmationMessage(data[0].reservationCode);
      }
      
      
    }, function(data) {
      // TODO: Whaat request has failed
      //Apparently soap reason is not reliable so checking against msg
      $scope.isMakingReservation = false;
      $scope.invalidFormData.error = true;

      if(data.error && data.error.msg === 'User already registered'){
        $scope.invalidFormData.email = true;
        $state.go('reservation.details');
        modalService.openEmailRegisteredLoginDialog();
      }
      else if(data.error && (data.error.reason === 53 || data.error.reason === 54)){
        if(data.error.msg === 'Cardholder Name is invalid'){
          $scope.invalidFormData.cardName = true;
        }
        else if(data.error.msg === 'Payment Type is invalid'){
          $scope.invalidFormData.paymentType = true;
        }
        else if(data.error.msg === 'Expiry Date is invalid'){
          $scope.invalidFormData.expiryDate = true;
        }
        else if(data.error.msg === 'Credit card will be expired'){
          $scope.invalidFormData.ccExpired = true;
        }
        else if(data.error.msg === 'CCV is invalid'){
          $scope.invalidFormData.ccvInvalid = true;
        }
        else if(data.error.msg === 'Card Number is invalid'){
          $scope.invalidFormData.ccNumberInvalid = true;
        }
        $scope.invalidFormData.payment = true;
        $state.go('reservation.billing');
      }
      else{
        $scope.invalidFormData.generic = true;
        $state.go('reservation.details');
      }
      
    });

    preloaderFactory(reservationPromise);
  };

  $scope.openOtherRoomsDialog = function(){
    // Getting rooms settings
    var roomsSettings = bookingService.getMultiRoomData();

    var allRooms = $scope.allRooms.map(function(room){return room;});

    var rooms = [];
    for(var i=0; i < roomsSettings.length; i++){
      var roomSettings = roomsSettings[i];

      var roomData = _.findWhere(allRooms, {code: roomSettings.roomID});
      if(roomData){
        var room = roomData;
        allRooms.splice(allRooms.indexOf(room), 1);

        room._adults = roomSettings.adults;
        room._children = roomSettings.children;
        rooms.push(room);
      }
    }

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

  $scope.countryPhoneChanged = function(){
    var countryCode = $('#telephone').intlTelInput('getSelectedCountryData').iso2;
    $scope.defaultCountryCode = countryCode;
  };

  $scope.creditCardsIcons = _.pluck(Settings.UI.booking.cardTypes, 'icon');
  $scope.getCreditCardDetails = creditCardTypeService.getCreditCardDetails;
  $scope.getCreditCardPreviewNumber = creditCardTypeService.getCreditCardPreviewNumber;
  $controller('PriceCtr', {$scope: $scope});
  $controller('AutofillSyncCtrl', {$scope: $scope});
});
