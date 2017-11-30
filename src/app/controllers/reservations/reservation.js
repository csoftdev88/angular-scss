'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, Settings, $log,
  reservationService, preloaderFactory, modalService, user,
  $rootScope, userMessagesService, propertyService, $q, cookieFactory, sessionDataService,
  creditCardTypeService, breadcrumbsService, _, scrollService, $timeout, dataLayerService, contentService, apiService,
  userObject, chainService, previousSearchesService, metaInformationService, $location, stateService,
  mobiusTrackingService, infinitiEcommerceService, infinitiApeironService, routerService, channelService,
  campaignsService, locationService, roomUpgradesService, DynamicMessages, spinnerService) {

  $controller('RatesCtrl', {
    $scope: $scope
  });

  // Get dynamic translations :'(
  var appLang = stateService.getAppLanguageCode();
  var dynamicMessages = appLang && DynamicMessages && DynamicMessages[appLang];

  $scope.chain = {};
  $scope.chainName = Settings.UI.hotelDetails.chainPrefix;
  $scope.bookingConfig = Settings.UI.booking;
  $scope.isMakingReservation = false;
  $scope.isMobile = stateService.isMobile();
  $scope.canPayWithPoints = true;
  $scope.$stateParams = $stateParams;
  $scope.settings = Settings;

  // FIXME: this state parameter is lost on page refresh! We need to re-evaluate this from the product code instead!
  $scope.memberOnlyBooking = $stateParams.memberOnly;

  $scope.profile = {};
  $scope.profile.userPassword = '';
  $scope.profile.userPasswordConfirmation = '';

  // Flow type controls whether we show the login modal
  $scope.flowType = {
    showLogin: false
  };
  $scope.showLoginModal = function () {
    $scope.flowType.showLogin = true;
    window.dispatchEvent(new CustomEvent('parent.request.login'));
  };

  $scope.flowTypeChanged = function () {
    if ($scope.flowType.showLogin) {
      $scope.showLoginModal();
    }
  };
  function onKeystoneModalDismissed() {
    $scope.flowType.showLogin = false;
  }
  $window.addEventListener('keystone.modal.dismissed', onKeystoneModalDismissed);

  $scope.requiredFieldsMissingError = false;
  $scope.userPasswordIncorrect = false;
  $scope.useAlternateBookingFlow = Settings.authType === 'keystone' &&
    Settings.UI.alternateBookingFlow &&
    Settings.UI.alternateBookingFlow.enabled;

  var clickedSubmit = false;

  $scope.isValidKeystonePassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  $scope.showResetPassword = function () {
    window.dispatchEvent(new CustomEvent('parent.request.forgotten-password', {detail: {email: $scope.userDetails.email}}));
  };

  //If steps are at top of page we scroll to them, if they are in the widget we just scroll to top of page
  $scope.scrollReservationStepsPosition = $scope.bookingConfig.bookingStepsNav.showInReservationWidget ? 'top' : 'reservation-steps';

  //Load generic data
  contentService.getTitles().then(function(data) {
    $scope.profileTitles = data;
  });
  contentService.getCountries().then(function(data) {
    $scope.profileCountries = data;
  });

  //get meta information
  chainService.getChain(Settings.API.chainCode).then(function(chain) {
    $scope.chain = chain;

    $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
    $scope.chain.meta.microdata.og['og:title'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:title'];
    $scope.chain.meta.microdata.og['og:description'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:description'];

    setMetaInformation();

  });

  function setMetaInformation() {
    if (!$scope.chain.meta) {
      return;
    }
    metaInformationService.setPageTitle($scope.chain.meta.pagetitle);
    metaInformationService.setMetaDescription($scope.chain.meta.description);
    metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
    metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
  }

  $scope.userDetails = {};
  $scope.possibleArrivalMethods = Settings.UI.arrivalMethods;
  $scope.additionalInfo = {
    'optedIn': $scope.bookingConfig.newsLetterOptedIn
  };
  $scope.voucher = {};

  $scope.defaultCountryCode = Settings.UI.defaultCountryCode;
  $scope.preferredCountryCodes = Settings.UI.preferredCountryCodes;
  $scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;

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

  $scope.breakdown = {
    extended: false
  };

  $scope.pointsData = {};

  // TODO - move to common CTRL or service
  $scope.getTotal = function(prop) {
    // Returning a total price of all products
    return _.reduce(
      _.map($scope.allRooms, function(room) {
        if (prop === 'pointsEarned') {
          return room._selectedProduct.productAwardPoints ? room._selectedProduct.price[prop] : 0;
        } else {
          return room._selectedProduct.price[prop];
        }

      }),
      function(t, n) {
        return t + n;
      });
  };

  $scope.$on('USER_LOGIN_EVENT', function() {
    // Reset all errors
    $scope.forms.details.$submitted = false;
    $scope.userPasswordIncorrect = false;
    $scope.invalidFormData.email = null;
    prefillUserDetails($scope.auth && $scope.auth.isLoggedIn() ? user.getUser() : {
      email: $stateParams.email
    }, true);
  });

  function onAuthorized() {
    // Getting room/products data
    //
    var roomsPromises;
    var rooms;
    $scope.allRooms = [];

    if (!$scope.isMultiRoomMode) {
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
      rooms = multiRoomData.map(function(room) {
        return {
          property: $stateParams.property,
          roomID: room.roomID,
          productCode: room.productCode
        };
      });
    }

    // Loading all the rooms;
    roomsPromises = rooms.map(function(room) {
      return getRoomPromise(room);
    });

    var propertyPromise = propertyService.getPropertyDetails($stateParams.property).then(function(property) {
      $scope.property = property;
      return property;
    });

    // Disable continue button while fetching property/rooms data
    $scope.isLoadingData = true;

    // Showing loading indicator
    preloaderFactory($q.all([$q.all(roomsPromises), propertyPromise])
      .then(function () {
        $rootScope.showHomeBreadCrumb = false;
        setBreadCrumbs(lastBreadCrumbName);
      }, goToRoom)
      .then(function () {
        $scope.isLoadingData = false;
      }));


    // Showing login/register dialog when user making reservation as not logged in
    // user. This doesn't apply for modifications or if loyalty program is disbaled
    if (!$scope.auth.isLoggedIn() && !$scope.isModifyingAsAnonymous() && Settings.authType === 'infiniti') {
      modalService.openLoginDialog();
    }

    //If modifying as logged in user
    if ($stateParams.reservation && !$scope.isModifyingAsAnonymous()) {

      reservationService.getReservation($stateParams.reservation, null).then(function(reservation) {
        var userCountry = getUserCountry({localeCode: reservation.rooms[0].guestCountry});
        $scope.userDetails.title = reservation.rooms[0].guestTitleId || reservation.rooms[0].guestTitle;
        $scope.userDetails.firstName = reservation.rooms[0].firstName;
        $scope.userDetails.lastName = reservation.rooms[0].lastName;
        $scope.userDetails.email = reservation.rooms[0].guestEmail;
        $scope.userDetails.address = reservation.rooms[0].guestAddress;
        $scope.userDetails.city = reservation.rooms[0].guestCity;
        $scope.userDetails.zip = reservation.rooms[0].guestZip;
        $scope.userDetails.stateProvince = reservation.rooms[0].guestState;
        $scope.userDetails.country = userCountry.code;
        $scope.userDetails.localeCode = userCountry.code;
        $scope.userDetails.localeId = userCountry.id;
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
    else if ($scope.isModifyingAsAnonymous()) {
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

          var userCountry = getUserCountry(data);
          if (userCountry) {
            $scope.userDetails.localeCode = userCountry.code;
            $scope.userDetails.localeId = userCountry.id;
          }
        });
      });
    }
    //If new reservation
    else {
      prefillUserDetails($scope.auth.isLoggedIn() || userObject.token ? user.getUser() : {
        email: $stateParams.email
      });
    }

    if ($stateParams.roomUpgrade) {
      $scope.getRoomData($stateParams.property, $stateParams.roomUpgrade, null).then(function(data) {
        $scope.upgradedFromRoomName = data.roomDetails.name;
      });
    }

    //scrollToDetails('reservationDetailsForm');
    scrollToDetails($scope.bookingConfig.bookingStepsNav.display && !$scope.bookingConfig.detailsBeforeForm ? $scope.scrollReservationStepsPosition : 'reservationDetailsForm');
  }

  function getRoomPromise(room) {
    return $scope.getRoomData($stateParams.property, room.roomID, null, $scope.voucher.code).then(function(data) {

      var roomData = data.roomDetails;
      var product = _.findWhere(data.roomProductDetails.products, {
        code: room.productCode
      });

      // TODO if !product - redirect
      if (product) {
        roomData._selectedProduct = product;
        if (!product.allowPointsBooking) {
          $scope.canPayWithPoints = false;
        }

        $scope.formatting = roomData._selectedProduct.price.formatting;
        // Check if we should skip credit card step, and provide fake one
        $scope.skipCreditCardStep = (product.guarantees.cc === false) ? true : false;

        //If we have a stored upgrade with an increased price, and room and pricing are set
        if(storedUpgrade && storedUpgrade.increased && storedUpgrade.room && storedUpgrade.email){
          if(room.roomID === storedUpgrade.room.code) { //If the current room id matches the stored upgrade
            //Validate the current dates and calculate the stayLength
            if($stateParams.dates){
              var datesArray = $stateParams.dates.split('_');
              if(datesArray.length === 2){
                var checkInDate = $window.moment.tz(datesArray[0], Settings.UI.bookingWidget.timezone).startOf('day');
                var checkOutDate = $window.moment.tz(datesArray[1], Settings.UI.bookingWidget.timezone).startOf('day');
                var stayLength = parseInt(checkOutDate.diff(checkInDate, 'days'));

                console.log('update pricing with upgrade pricing');

                roomData._selectedProduct.price = {}; //Clear the existing price object

                //Setting all of our pricing based on the upgrade pricing
                roomData._selectedProduct.price.totalBaseAfterPricingRules = storedUpgrade.email.priceRoom * stayLength;
                roomData._selectedProduct.price.totalAfterTaxAfterPricingRules = storedUpgrade.email.totalAfterTax;
                roomData._selectedProduct.price.breakdowns = [];
                roomData._selectedProduct.price.breakdowns = storedUpgrade.email.priceDetail.priceOverview.priceBreakdowns;
                roomData._selectedProduct.price.taxDetails = {};
                roomData._selectedProduct.price.taxDetails.totalTax = storedUpgrade.email.totalTax;
                roomData._selectedProduct.price.taxDetails.policyTaxItemDetails = storedUpgrade.email.priceDetail.priceOverview.taxDetails.policyTaxItemDetails;
                roomData._selectedProduct.price.feeDetails = {};
                roomData._selectedProduct.price.feeDetails.totalTax = storedUpgrade.email.priceDetail.priceOverview.feeDetails.totalTax;
                roomData._selectedProduct.price.feeDetails.policyTaxItemDetails = storedUpgrade.email.priceDetail.priceOverview.feeDetails.policyTaxItemDetails;
              }
            }
          }
        }

        //Store the guarantee policy description for the reservation assurance badges
        if(product.policies){
          var guaranteePolicy = _.findWhere(product.policies, {type: 'guarantee'}); //find the guarantee policy
          $scope.guaranteePolicyDescription = guaranteePolicy ? guaranteePolicy.description : null;
        }

        $scope.allRooms.push(roomData);

        //if multiroom, wait for all rooms data to be loaded before tracking products checkout
        if (!$scope.isMultiRoomMode) {
          trackProductCheckout(1);
        } else {
          multiRoomDataLoaded++;
          if (multiRoomDataLoaded === multiRoomData.length) {
            trackProductCheckout(1);
          }
        }
      }

      //Used to decided if 'view price breakdown' should display (We should have no breakdown if we have more than 1 night, taxes are more than 0 and fees are more than 0)
      $scope.noBreakdown = $scope.allRooms[0]._selectedProduct.price.breakdowns.length === 1 && $scope.getBreakdownTotalTaxes(false) === 0 && $scope.getBreakdownTotalTaxes(true) === 0;

      if($stateParams.voucher){
        $scope.voucher.code = $stateParams.voucher;
        $scope.redeemVoucher();
      }
    });
  }

  function prefillUserDetails(userData, isMobius) {
    if (!userData) {
      return;
    }
    if (!Object.keys($scope.userDetails).length || isMobius) {
      // No fields are touched yet, prefiling
      // Not true, actually the fields might have been touched here if the user logs in after filling the form...
      //waiting for countries
      $scope.$watch('profileCountries', function() {
        //overriding country name from /locales data using user data iso3 as infiniti country name doesn't match /locales country names
        var userCountry = getUserCountry(userData);
        // Use defaults with undefined (nulls are not handled the same by _.defaults)
        // to ensure that any details manually input by the user are preserved
        // but any untouched fields are populated
        _.defaults($scope.userDetails, {
          title: userData.title || undefined,
          firstName: userData.firstName || undefined,
          lastName: userData.lastName || undefined,
          address: userData.address1 || undefined,
          city: userData.city || undefined,
          stateProvince: userData.state || undefined,
          localeCode: userCountry ? userCountry.code : undefined,
          localeId: userCountry ? userCountry.id : undefined,
          country: userCountry && userCountry.name || undefined,
          zip: userData.zip || undefined,
          phone: userData.tel1 || userData.tel2 || undefined
        });
        $scope.userDetails.email = userData.email;
        $scope.userDetails.emailFromApi = !!userData.email;
      });

    }

    _.extend($scope.additionalInfo, {
      optedIn: userData.optedIn || false
    });

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
  $controller('RoomDetailsCtrl', {
    $scope: $scope
  });
  $controller('CardExpirationCtrl', {
    $scope: $scope
  });
  // NOTE: Waiting for infiniti SSO auth events
  $controller('AuthCtrl', {
    $scope: $scope,
    config: {
      onAuthorized: onAuthorized
    }
  });


  function goToRoom() {
    if (previousState && previousState.state && previousState.params && previousState.state.parent !== 'reservation' && previousState.state.name && previousState.state.name !== '' && !previousState.state.abstract) {
      $state.go(previousState.state, previousState.params);
    } else {
      propertyService.getAll().then(function(properties) {
        var paramsData = {};
        paramsData.property = _.find(properties, function(prop) {
          return prop.code === $stateParams.property;
        });
        routerService.buildStateParams('hotel', paramsData).then(function(params) {
          params.scrollTo = 'jsRooms';
          $state.go('hotel', params, {
            reload: true
          });
        });
      });
    }
  }
  $scope.goToRoom = function() {
    goToRoom();
  };

  // Redirecting to details page
  if ($state.current.name === 'reservation') {
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
    if(!$scope.bookingConfig.checkoutNoScrollingDesktop || ($scope.bookingConfig.checkoutNoScrollingDesktop && $scope.isMobile)){
      $timeout(function(){
        scrollService.scrollTo(target, 30);
      }, 100);
    }
  }

  function setContinueName(stateName) {
    switch (stateName) {
      case 'reservation.details':
        setBreadCrumbs(GUEST_DETAILS);
        $scope.continueName = 'continue';
        if ($scope.invalidFormData.error) {
          //scrollToDetails('alert-warning');
        } else {
          scrollToDetails($scope.bookingConfig.bookingStepsNav.display && !$scope.bookingConfig.detailsBeforeForm ? $scope.scrollReservationStepsPosition : 'reservationDetailsForm');
        }
        $rootScope.showHomeBreadCrumb = false;
        break;
      case 'reservation.billing':
        setBreadCrumbs(BILLING_DETAILS);
        $scope.continueName = 'continue';
        //scrollToDetails('reservationBillingForm');
        scrollToDetails($scope.bookingConfig.bookingStepsNav.display && !$scope.bookingConfig.detailsBeforeForm ? $scope.scrollReservationStepsPosition : 'reservationBillingForm');
        $rootScope.showHomeBreadCrumb = false;
        break;
      case 'reservation.confirmation':
        setBreadCrumbs(CONFIRMATION);
        $scope.continueName = 'confirm';
        //scrollToDetails('reservationConfirmation');
        scrollToDetails($scope.bookingConfig.bookingStepsNav.display && !$scope.bookingConfig.detailsBeforeForm ? $scope.scrollReservationStepsPosition : 'reservationConfirmation');
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
    $window.removeEventListener('keystone.modal.dismissed', onKeystoneModalDismissed);
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

  if ($scope.auth && !$scope.auth.isLoggedIn()) {
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
        if ($scope.skipCreditCardStep) {
          return $state.go('reservation.details');
        } else {
          return $state.go('reservation.billing');
        }
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

        if ($scope.auth && $scope.auth.isLoggedIn()) {
          if (user.getUser().loyalties) {
            $scope.pointsData.currentPoints = user.getUser().loyalties.amount || 0;
          }

          $scope.pointsData.pointsEarned = $scope.getTotal('pointsEarned');
          //$scope.pointsData.pointsAfterBooking = $scope.pointsData.currentPoints +
          //$scope.getTotal('pointsEarned') - $scope.getTotal('pointsRequired');
          $scope.pointsData.pointsAfterBooking = $scope.pointsData.currentPoints - $scope.getTotal('pointsRequired');
        }

        break;
      default:
        $scope.billingDetails.paymentMethod = 'cc';
    }
  };

  $scope.isValid = function () {
    if (!$scope.allRooms || !$scope.allRooms.length) {
      return false;
    }
    switch ($state.current.name) {
      case 'reservation.details':
        return $scope.forms.details && !$scope.forms.details.$invalid;
      case 'reservation.billing':
        if ($scope.billingDetails.paymentMethod === 'point' && $scope.auth && $scope.auth.isLoggedIn() && $scope.getTotal('pointsRequired')) {
          return user.getUser().loyalties.amount >= $scope.getTotal('pointsRequired');
        }
        return $scope.forms.billing && !$scope.forms.billing.$invalid;
      case 'reservation.confirmation':
        return $scope.forms.additionalInfo && !$scope.forms.additionalInfo.$invalid;
      default:
        return false;
    }
  };

  $scope.isContinueDisabled = function() {
    // disable while fetching room/property data
    if ($scope.isLoadingData) {
      return true;
    }
    //disable when validating voucher
    if ($scope.voucher.verifying) {
      return true;
    }
    //disable when making reservation
    if ($state.is('reservation.confirmation') && $scope.isMakingReservation) {
      return true;
    }
    return !$scope.isValid() && !$state.is('reservation.details') && !$state.is('reservation.billing') && !$state.is('reservation.confirmation');
  };

  $scope.isContinueHidden = function() {
    // TODO: Do this better - might work via ng-class instead of disabled
    if ($state.is('reservation.billing') && $scope.billingDetails.paymentMethod === 'point') {
      return !$scope.isValid();
    }
  };

  function mapDataToKeystoneRegister() {
    var titleObj = _.findWhere($scope.profileTitles, {id: $scope.userDetails.title});
    return {
      Email: $scope.userDetails.email,
      ConfirmEmail: $scope.userDetails.email,
      Password: $scope.profile.userPassword,
      ConfirmPassword: $scope.profile.userPassword,
      tc: true,
      privacy: $scope.additionalInfo.optedIn,
      Profile: {
        Name: {
          Title: titleObj ? titleObj.code : null,
          FirstName: $scope.userDetails.firstName,
          LastName: $scope.userDetails.lastName
        },
        Phone: [{
          Number: $scope.userDetails.phone,
          IsDefault: false,
          IsEmergency: false
        }],
        Address: [{
          FirstLine: $scope.userDetails.address,
          City: $scope.userDetails.city,
          County: $scope.userDetails.stateProvince,
          Postcode: $scope.userDetails.zip,
          Country:  $scope.userDetails.countryObj ? $scope.userDetails.countryObj.code : null,
          IsCompany: false,
          IsDefault: true,
          IsDelivery: false,
          IsBilling: false
        }]
      }
    };
  }

  function mapEmail(existingProfile, updatePayload) {
    var defaultEmailFromProfile = existingProfile.Email && existingProfile.Email.filter(function (value) {
      return value.IsDefault;
    })[0];
    if ($scope.userDetails.email && defaultEmailFromProfile.Email !== $scope.userDetails.email) {
      var emailObj = {
        Email: $scope.userDetails.email,
        Source: 'keystone',
        IsDefault: true,
        IsEmergency: false
      };
      if (defaultEmailFromProfile) {
        emailObj.Id = defaultEmailFromProfile.Id;
      } else {
        $log.warn('Keystone profile did not contain a default email!');
      }
      updatePayload.Email = [emailObj];
    }
  }

  function mapPhone(existingProfile, updatePayload) {
    var defaultPhoneFromProfile = existingProfile.Phone && existingProfile.Phone.filter(function (value) {
      return value.IsDefault;
    })[0];
    if ($scope.userDetails.phone) {
      if (!defaultPhoneFromProfile || defaultPhoneFromProfile.Number !== $scope.userDetails.phone) {
        var phoneObject = {
          Number: $scope.userDetails.phone,
          IsDefault: false,
          IsEmergency: false
        };
        if (defaultPhoneFromProfile) {
          phoneObject.Id = defaultPhoneFromProfile.Id;
        }
        updatePayload.Phone = [phoneObject];
      }
    }
  }

  function mapAddress(existingProfile, updatePayload) {
    var defaultAddressFromProfile = existingProfile.Address && existingProfile.Address.filter(function (value) {
      return value.IsDefault;
    })[0];

    var addressObj = {
      FirstLine: $scope.userDetails.address || null,
      City: $scope.userDetails.city || null,
      County: $scope.userDetails.stateProvince || null,
      Postcode: $scope.userDetails.zip || null,
      Country: $scope.userDetails.countryObj ? $scope.userDetails.countryObj.code : null
    };
    if (defaultAddressFromProfile) {
      addressObj.Id = defaultAddressFromProfile.Id;
    }
    updatePayload.Address = [addressObj];
  }

  function mapDataToUpdateKeystone() {
    var existingProfile = window.KS.$me.get();
    var updatePayload = {};

    var titleObj = _.findWhere($scope.profileTitles, {id: $scope.userDetails.title});
    updatePayload.Name = {
      Title: titleObj ? titleObj.code : null,
      FirstName: $scope.userDetails.firstName,
      LastName: $scope.userDetails.lastName
    };

    mapEmail(existingProfile, updatePayload);
    mapPhone(existingProfile, updatePayload);
    mapAddress(existingProfile, updatePayload);

    return updatePayload;
  }

  /**
   * Whether to show a hint on password requirements before submitting the form
   * */
  $scope.userPasswordInvalidHint = function () {
    if (!$scope.forms || !$scope.forms.details) {
      return false;
    }
    if ($scope.forms.details.$submitted || $scope.profile.userPassword === '') {
      return false;
    }
    return !$scope.isValidKeystonePassword.test($scope.profile.userPassword);
  };

  function formSubmitted() {
    if (!$scope.forms || !$scope.forms.details) {
      return false;
    }
    return $scope.forms.details.$submitted;
  }

  function memberOnlyAndSubmitted() {
    if (!formSubmitted()) {
      return false;
    }
    return $scope.forms.details.$submitted && $scope.memberOnlyBooking;
  }

  $scope.userPasswordRequired = function () {
    if (!memberOnlyAndSubmitted()) {
      return false;
    }
    return $scope.profile.userPassword === '';
  };

  $scope.userPasswordInvalid = function () {
    if (!formSubmitted()) {
      return false;
    }
    return $scope.profile.userPassword !== '' && !$scope.isValidKeystonePassword.test($scope.profile.userPassword);
  };

  $scope.userPasswordConfirmationRequired = function () {
    if (!formSubmitted()) {
      return false;
    }
    if ($scope.profile.userPassword === '') {
      return false;
    }
    return $scope.profile.userPasswordConfirmation === '';
  };

  $scope.userPasswordMismatch = function () {
    if (!formSubmitted()) {
      return false;
    }
    if ($scope.profile.userPassword === '') {
      return false;
    }
    return $scope.profile.userPassword !== $scope.profile.userPasswordConfirmation;
  };

  $scope.getPasswordPlaceholder = function () {
    if (!dynamicMessages) {
      return '';
    }
    if ($scope.memberOnlyBooking) {
      return dynamicMessages.password;
    }
    return dynamicMessages.password + ' (' + dynamicMessages.optional + ')';
  };

  $scope.getPasswordConfirmationPlaceholder = function () {
    if (!dynamicMessages) {
      return '';
    }
    if ($scope.memberOnlyBooking) {
      return dynamicMessages.confirm_password;
    }
    return dynamicMessages.confirm_password + ' (' + dynamicMessages.optional + ')';
  };

  $scope.continue = function() {
    switch ($state.current.name) {
      case 'reservation.details':
        if ($scope.forms.details && !$scope.forms.details.$submitted) {
          $scope.forms.details.$submitted = true;
        }

        // Ensure that the user has filled in a password and that it is valid for member only bookings
        // If it is a usual booking, then ensure that if a password has optionally been given, it is valid
        if (!$scope.auth.isLoggedIn()) {
          if ($scope.userPasswordRequired() ||
            $scope.userPasswordInvalid() ||
            $scope.userPasswordConfirmationRequired() ||
            $scope.userPasswordMismatch()) {
            return;
          } else {
            if ($scope.userPasswordInvalid() || $scope.userPasswordMismatch()) {
              return;
            }
          }
        }

        // Clear email error message if any
        if ($scope.invalidFormData.email) {
          $scope.invalidFormData.email = null;
        }

        $scope.requiredFieldsMissingError = $scope.forms.details.$error &&
                                            $scope.forms.details.$error.required &&
                                            $scope.forms.details.$error.required.length > 0;

        if ($scope.isValid()) {

          var proceed = function () {
            if (!$scope.skipCreditCardStep) {
              $state.go('reservation.billing');
              $scope.autofillSync();
              trackProductCheckout(2);
            } else {
              $scope.billingDetails.card.number = '9999999999999999';
              $scope.billingDetails.card.securityCode = '999';
              $scope.billingDetails.card.holderName = 'Mobius';
              $scope.cardExpiration.selectedYear = '2099';
              $scope.cardExpiration.selectedMonth = { name: 'January', id: 0 };
              $state.go('reservation.confirmation');
              trackProductCheckout(3);
            }
          };

          if (!$scope.useAlternateBookingFlow) {
            proceed();
            break;
          }

          var mappedUser = mapDataToKeystoneRegister();
          if ($scope.auth.isLoggedIn()) {
            // Update Keystone profile in the background
            var updatePayload = mapDataToUpdateKeystone();
            window.KS.$me.update(updatePayload).then(function (updatedProfile) {
              $log.info('Successfully updated Keystone profile', updatedProfile);
            }, function (error) {
              $log.error('Updating keystone profile failed!', error);
            });
            proceed();
          } else {
            // Check if we should create an account
            if ($scope.profile.userPassword) {

              var loginDetails = {
                Email: mappedUser.Email,
                Password: mappedUser.Password
              };

              // Attempt both login and register in case the email is already registered and the password matches
              // We do this in parallel to accelerate the UX in the more common register case
              $scope.userPasswordIncorrect = false;

              var message = dynamicMessages ? dynamicMessages.registering : 'Creating your account';
              spinnerService.startSpinner(message);

              var loginP = window.KS.$me.login(loginDetails)
                .then(function () {
                  // User logged-in successfully
                  $scope.$apply(function () {
                    var message = dynamicMessages ? dynamicMessages.updating_account : 'Updating your account';
                    spinnerService.startSpinner(message);
                  });
                  var updatePayload = mapDataToUpdateKeystone();
                  return window.KS.$me.update(updatePayload).then(function () {
                    $log.info('Successfully updated Keystone profile');
                    return true;
                  }, function (error) {
                    $log.warn('Updating keystone profile failed!', error);
                    return true;
                  }).finally(function () {
                    // Profile updates are optional, proceed in all cases
                    $scope.$apply(function () {
                      spinnerService.stopSpinner();
                      proceed();
                    });
                  });
                }, function () {
                  // login failed
                  return false;
                });

              var registerP = window.KS.$me.register(mappedUser)
                .then(function () {
                  // User registered successfully
                  spinnerService.stopSpinner();
                  proceed();
                  return true;
                }, function () {
                  // register failed
                  return false;
                });

              // Note that both promises have an error handler that resolves so no .catch() is needed here
              return $q.all({
                login: loginP,
                register: registerP
              }).then(function (results) {
                if (results.login || results.register) {
                  // already handled
                  return;
                }
                // Both failed, meaning the account exists and the password is wrong
                spinnerService.stopSpinner();
                $scope.userPasswordIncorrect = true;
              });
            }
            proceed();
          }
        } else {
          scrollToDetails('reservationDetailsForm');
        }

        break;
      case 'reservation.billing':
        // TODO: Fix submited logic when paying with points billing form is
        // not required
        // TODO: Billing details on confirmation page should be removed
        // when paid with points
        if ($scope.forms.billing && !$scope.forms.billing.$submitted) {
          $scope.forms.billing.$submitted = true;
        }

        //Clear payment error message if any
        if ($scope.invalidFormData.payment) {
          $scope.invalidFormData.payment = null;
        }

        if ($scope.voucher.code) {
          $scope.redeemVoucher()
            .then(function () {
              if ($scope.isValid()) {
                $state.go('reservation.confirmation');
                trackProductCheckout(3);
              } else {
                scrollToDetails('reservationBillingForm');
              }
            })
            .catch($log.info);
        } else {
          if ($scope.isValid()) {
            $state.go('reservation.confirmation');
            trackProductCheckout(3);
          } else {
            scrollToDetails('reservationBillingForm');
          }
        }
        break;
      case 'reservation.confirmation':
        if ($scope.forms.additionalInfo && !$scope.forms.additionalInfo.$submitted) {
          $scope.forms.additionalInfo.$submitted = true;
        }
        if ($scope.isValid()) {
          $scope.isMakingReservation = true;
          $scope.makeReservation();
        }
        break;
    }
    setMetaInformation();
  };

  function trackProductCheckout(stepNum) {

    if (!$scope.allRooms || !$scope.allRooms.length) {
      return;
    }
    // Tracking checkout
    //TODO: need actionField so needs to be moved further into booking flow
    chainService.getChain(Settings.API.chainCode).then(function(chainData) {
      propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData) {
        var products = [];
        var variant = '';
        if($stateParams.adults && $stateParams.children)
        {
          variant = $stateParams.adults + ' Adult ' + $stateParams.children + ' Children';
        }

        var stayLength = null;
        var bookingWindow = null;

        if ($stateParams.dates) {
          var checkInDate = $window.moment.tz($stateParams.dates.split('_')[0], Settings.UI.bookingWidget.timezone).startOf('day');
          var checkOutDate = $window.moment.tz($stateParams.dates.split('_')[1], Settings.UI.bookingWidget.timezone).startOf('day');
          var today = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day');
          stayLength = checkOutDate.diff(checkInDate, 'days');
          bookingWindow = checkInDate.diff(today, 'days');
        }

        _.each($scope.allRooms, function(room){
          var product = {
            name: room._selectedProduct.name,
            id: room._selectedProduct.code,
            price: (room._selectedProduct.price.totalBaseAfterPricingRules / numNights).toFixed(2),
            quantity: numNights,
            dimension2: chainData.nameShort,
            brand: propertyData.nameLong,
            dimension1: propertyData.nameShort,
            list: dataLayerService.listType,
            category: dataLayerService.getCategoryName(propertyData,room)
          };
          products.push(product);
        });

        var actionField = {
          'step': stepNum
        };

        if(stepNum === 3)
        {
          var paymentInfo = $scope.billingDetails.paymentMethod;
          if(paymentInfo) {
            if(paymentInfo === 'cc')
            {
              var typeCode = $scope.getCreditCardDetails($scope.billingDetails.card.number, $scope.skipCreditCardStep).name;
              if(typeCode){
                actionField.option = typeCode;
              }
              else {
                actionField.option = 'cc';
              }
            }
            else {
              actionField.option = paymentInfo.paymentMethod;
            }
          }
        }
        dataLayerService.trackProductsCheckout(products, actionField, stayLength, bookingWindow);

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
      guestCountry: getUserCountry().code,


      billingDetailsUseGuestAddress: $scope.billingDetails.useGuestAddress,
      optedIn: $scope.additionalInfo.optedIn,

      arrivalDate: $scope.bookingDetails.from,
      departureDate: $scope.bookingDetails.to,
      hasReadRatePolicies: true,
      rooms: getRooms(),
      paymentInfo: {
        paymentMethod: $scope.billingDetails.paymentMethod
      },
      meta: $stateParams.meta ? $stateParams.meta : undefined
    };

    $scope.moreRoomData = reservationData.rooms;

    if ($scope.voucher.valid && $scope.bookingConfig.vouchers.enable && !$stateParams.reservation) {
      reservationData.voucher = $scope.voucher.code.toUpperCase();
    }

    // Adding customerID when logged in
    if ($scope.auth && $scope.auth.isLoggedIn()) {
      reservationData.customer = user.getUser().id;
    } else {
      // TODO: Anonymous reservation working but fails on getting
      // the data about created reservation back (API auth issue)
      reservationData.customerFirstName = $scope.userDetails.firstName;
      reservationData.customerLastName = $scope.userDetails.lastName;
      reservationData.customerEmail = $scope.userDetails.email;
    }

    //Additional info
    if ($scope.additionalInfo.arrivalTime) {
      reservationData.arrivalTime = $scope.additionalInfo.arrivalTime;
    }

    if ($scope.additionalInfo.arrivalMethod) {
      reservationData.arrivalMethod = $scope.additionalInfo.arrivalMethod;
    }

    if ($scope.additionalInfo.departureTime) {
      reservationData.departureTime = $scope.additionalInfo.departureTime;
    }

    if ($scope.additionalInfo.comments) {
      reservationData.comments = $scope.additionalInfo.comments;
    }

    if ($scope.additionalInfo.secondPhoneNumber) {
      reservationData.secondPhoneNumber = $scope.additionalInfo.secondPhoneNumber;
    }

    if($scope.additionalInfo.secondEmail){
      reservationData.additionalConfirmationEmails = $scope.additionalInfo.secondEmail;
    }

    if($scope.additionalInfo.thirdEmail){
      if(reservationData.additionalConfirmationEmails) {
        reservationData.additionalConfirmationEmails += ';' + $scope.additionalInfo.thirdEmail;
      }
      else {
        reservationData.additionalConfirmationEmails = $scope.additionalInfo.thirdEmail;
      }
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
        typeCode: $scope.getCreditCardDetails($scope.billingDetails.card.number, $scope.skipCreditCardStep).code
      };
    }

    //Billing details if different than guest details
    if (!$scope.billingDetails.useGuestAddress) {
      var billingCountry = contentService.getCountryByID($scope.billingDetails.country, $scope.profileCountries);
      if (!billingCountry) {
        $log.warn('Failed to find country by ID', $scope.billingDetails.country);
        billingCountry = {code: '-'};
      }
      reservationData.billingAddress = $scope.billingDetails.address;
      reservationData.billingCity = $scope.billingDetails.city;
      reservationData.billingZip = $scope.billingDetails.zip;
      reservationData.billingPhone = $scope.billingDetails.phone;
      reservationData.billingCountry = billingCountry.code;
    }

    // Product basePrice
    // NOTE - Pay with points requires price as well
    reservationData.price = $scope.getTotal('totalBaseAfterPricingRules');

    if ($scope.bookingDetails.promoCode) {
      // NOTE: Originally implemented using getCodeParamName as
      // reservationData[bookingService.getCodeParamName($scope.bookingDetails.corpCode)] = $scope.bookingDetails.corpCode;
      // Keep this for the future
      reservationData[Settings.API.promoCodes.promoCode] = $scope.bookingDetails.promoCode;
    } else if ($scope.bookingDetails.groupCode) {
      reservationData.groupCode = $scope.bookingDetails.groupCode;
    } else if ($scope.bookingDetails.corpCode) {
      reservationData.corpCode = $scope.bookingDetails.corpCode;
    }

    return reservationData;
  }

  $scope.getBreakdown = function(prop) {
    // Returning a total price of all products
    return _.reduce(
      _.map($scope.allRooms, function(room) {
        return room._selectedProduct.price.breakdowns[0][prop];
      }),
      function(t, n) {
        return t + n;
      });
  };


  $scope.getGuestsCount = function(type) {
    if ($scope.isMultiRoomMode) {
      return _.reduce(
        _.map(multiRoomData, function(room) {
          return room[type];
        }),
        function(t, n) {
          return t + n;
        });
    }

    return $scope.bookingDetails[type];
  };

  $scope.getBreakdownTotalTax = function(code) {
    // Returning a total price of all taxes per id
    var total = 0;
    _.map($scope.allRooms, function(room) {
      _.each(room._selectedProduct.price.taxDetails.policyTaxItemDetails, function(taxItem) {
        if (taxItem.policyTaxItem.policyTaxItemCode === code) {
          total += taxItem.taxAmount;
        }
      });
    });
    return total;
  };

  $scope.getBreakdownTotalFee = function(code) {
    // Returning a total price of all fees per id
    var total = 0;
    _.map($scope.allRooms, function(room) {
      _.each(room._selectedProduct.price.feeDetails.policyTaxItemDetails, function(feeItem) {
        if (feeItem.policyTaxItem.policyTaxItemCode === code) {
          total += feeItem.taxAmount;
        }
      });
    });
    return total;
  };

  $scope.getBreakdownTotalDate = function(date) {
    // Returning a total price per date
    var total = 0;
    _.map($scope.allRooms, function(room) {
      _.each(room._selectedProduct.price.breakdowns, function(breakdown) {
        if (breakdown.date === date) {
          total += breakdown.totalBaseAfterPricingRules;
        }
      });
    });
    return total;
  };

  $scope.getBreakdownTotalBaseAfterPricingRules = function() {
    // Returning a total base price
    var totalBaseAfterPricingRules = 0;
    _.map($scope.allRooms, function(room) {
      totalBaseAfterPricingRules += room._selectedProduct.price.totalBaseAfterPricingRules;
    });
    return totalBaseAfterPricingRules;
  };

  $scope.getBreakdownTotalTaxes = function(isFee) {
    // Returning a total for all taxes or fees
    var total = 0;
    _.map($scope.allRooms, function(room) {
      total += isFee ? room._selectedProduct.price.feeDetails.totalTax : room._selectedProduct.price.taxDetails.totalTax;
    });
    return total;
  };

  function addReservationConfirmationMessage(reservationNumber) {
    userMessagesService.addReservationConfirmationMessage($scope.property.nameLong, reservationNumber);
  }

  $scope.makeReservation = function() {

    if (clickedSubmit) {
      return;
    }

    clickedSubmit = true;

    if (!$scope.additionalInfo.agree) {
      $scope.isMakingReservation = false;
      clickedSubmit = false;
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
    if ($stateParams.reservation) {
      // Updating existing reservation
      promises.push(reservationService.modifyReservation($stateParams.reservation, reservationData,
        // Email parameter when user modifying as anonymous.
        $scope.isModifyingAsAnonymous() ? $stateParams.email : null));
    } else {
      // Creating a new reservation
      var roomCodes = [];
      _.each($scope.allRooms, function(room) {
        roomCodes.push(room.code);
      });
      roomCodes.join();
      promises.push(reservationService.createReservation($stateParams.property ? $stateParams.property : null, roomCodes, reservationData));
    }

    if (userObject !== null) {
      var userData = _.omit($scope.userDetails, _.isNull);
      if (userData.countryObj) {
        userData.country = userData.countryObj.code;
      }
      userData = _.omit(userData, ['id', 'token', 'email', 'languageCode', 'countryObj']);

      if (userData && userObject.id) {
        apiService.put(apiService.getFullURL('customers.customer', {
          customerId: userObject.id
        }), userData).then(function() {}, function() {
          $scope.error = true;
          $scope.genericError = true;
        });
      }
    }


    var reservationPromise = $q.all(promises).then(function(data) {
      if (data[0] instanceof Array) {
        // multiroom booking flow
        var getParams = {'totalBookings': data[0].length};
        for (var i = 0; i < data[0].length; i++) {
          var booking = data[0][i];
          getParams['booking' + i] = booking.reservationCode;
        }
        if ($scope.auth && !$scope.auth.isLoggedIn()) {
          // anonymous multiroom booking
          if (Settings.API.propertySlug) {
            $state.go('hotel', {
              propertySlug: Settings.API.propertySlug,
              locationSlug: null,
              customMessages: getParams
            });
          } else {
            $state.go('home', { customMessages: getParams});
          }
        } else {
          //registered multiroom booking
          $state.go('reservations', { customMessages: getParams});
        }
        // FIXME: surely this return bypasses all the tracking code below?
        // TODO: loop over each reservation and post the tracking data as before
        console.warn('FIXME: implement purchase tracking...');
        return;
      }

      // Single reservation Object
      var reservationCode = data[0].reservationCode;
      var reservationDetailsParams = {
        reservationCode: reservationCode,
        hideActionButtons: false,
        // Removing reservation code when booking modification is complete
        reservation: null,
        //Retain codes in confirmation for thirdparty bookings
        corpCode:$stateParams.corpCode?$stateParams.corpCode:null,
        promoCode:$stateParams.promoCode?$stateParams.promoCode:null,
        groupCode:$stateParams.groupCode?$stateParams.groupCode:null
      };

      // When booked as anonymous we are adding customer email to the next route
      // so booking data can be fetched from the API
      if ($scope.auth && !$scope.auth.isLoggedIn()) {
        reservationDetailsParams.email = reservationData.customerEmail;
      }

      // Removing reservation details from the URL
      reservationDetailsParams.room = null;
      reservationDetailsParams.rooms = null;

      // Newly created reservation
      reservationDetailsParams.view = 'summary';

      //Google Tag Manager Tracking purchase
      chainService.getChain(Settings.API.chainCode).then(function(chainData) {
        propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData) {

          //Remove any search results that were created in this session
          previousSearchesService.removeSessionSearches();

          //GTM ecommerce tracking
          var products = [];

          _.each($scope.allRooms, function(room){
            var p = room._selectedProduct;
            var product = {
              name: p.name,
              code: p.code,
              tax: ((p.price.totalAfterTaxAfterPricingRules - p.price.totalBaseAfterPricingRules) / numNights).toFixed(2),
              price: ($scope.getTotal('totalBaseAfterPricingRules') / numNights).toFixed(2),
              id: room._selectedProduct.code,
              quantity: numNights,
              dimension2: chainData.nameShort,
              brand: propertyData.nameLong,
              dimension1: propertyData.nameShort,
              list: dataLayerService.listType,
              category: dataLayerService.getCategoryName(propertyData,room),
              room: {
                'code':room.code,
                'name':room.name
              },
              policies:p.policies,
              priceDetail: {
                totalBaseAfterPricingRules: p.price.totalBaseAfterPricingRules,
                totalTax: p.price.taxDetails.totalTax
              }
            };
            products.push(product);
          });

          var actionField = {
            // Transaction ID
            id: reservationDetailsParams.reservationCode,
            'affiliation': 'Hotel',
            'revenue': $scope.getTotal('totalBaseAfterPricingRules'),
            'quantity': numNights,
            'tax': ($scope.getTotal('totalAfterTaxAfterPricingRules') - $scope.getTotal('totalBaseAfterPricingRules')).toFixed(2),
            'coupon': $scope.bookingDetails.promoCode || $scope.bookingDetails.groupCode || $scope.bookingDetails.corpCode || null
          };

          var stayLength = null;
          var bookingWindow = null;

          if ($stateParams.dates) {
            var checkInDate = $window.moment.tz($stateParams.dates.split('_')[0], Settings.UI.bookingWidget.timezone).startOf('day');
            var checkOutDate = $window.moment.tz($stateParams.dates.split('_')[1], Settings.UI.bookingWidget.timezone).startOf('day');
            var today = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day');
            stayLength = checkOutDate.diff(checkInDate, 'days');
            bookingWindow = checkInDate.diff(today, 'days');
          }
          var derbysoftInfo = null;

          if (channelService.getChannel().name === 'meta' && Settings.derbysoftTracking && Settings.derbysoftTracking.enable) {
            var metaParam = $location.search().meta;
            var metaDevice = null;
            var metaChannelCode = null;

            if (metaParam) {
              var metaData = metaParam.split('|');

              metaDevice = _.find(metaData, function(metaItem) {
                return metaItem.indexOf('device') !== -1;
              });
              metaChannelCode = _.find(metaData, function(metaItem) {
                return metaItem.indexOf('source') !== -1;
              });

              metaDevice = metaDevice.split(':')[1];
              metaChannelCode = metaChannelCode.split(':')[1];
            }

            derbysoftInfo = {
              accountCode: Settings.derbysoftTracking.accountCode,
              bookingNo: reservationCode,
              channelCode: metaChannelCode ? metaChannelCode : null,
              hotelCode: propertyData.code,
              roomTypeName: $scope.allRooms[0].name,
              roomTypeCode: $scope.allRooms[0].code,
              ratePlanName: $scope.allRooms[0]._selectedProduct.name,
              discount: $scope.getTotal('totalDiscount'),
              ratePlanCode: $scope.allRooms[0]._selectedProduct.code,
              checkInDate: $stateParams.dates.split('_')[0],
              checkOutDate: $stateParams.dates.split('_')[1],
              guests: parseInt($scope.getGuestsCount('adults'), 10) + parseInt($scope.getGuestsCount('children'), 10),
              rooms: $scope.allRooms.length,
              pureAmount: $scope.getTotal('totalBaseAfterPricingRules'),
              totalAmount: $scope.getTotal('totalAfterTaxAfterPricingRules'),
              currency: $rootScope.currencyCode,
              device: metaDevice ? metaDevice : null
            };
          }

          dataLayerService.trackProductsPurchase(products, actionField, derbysoftInfo ? derbysoftInfo : null, stayLength ? stayLength : null, bookingWindow ? bookingWindow : null);

          //mobius ecommerce tracking
          var priceData = {
            'beforeTax': $scope.getTotal('totalBaseAfterPricingRules'),
            'afterTax': $scope.getTotal('totalAfterTaxAfterPricingRules'),
            'totalDiscount': $scope.getTotal('totalDiscount'),
            'totalAfterTaxAfterPricingRules': $scope.getTotal('totalAfterTaxAfterPricingRules'),
            'totalTax':$scope.getBreakdownTotalTaxes(false) + $scope.getTotal('totalAdditionalFees'),
            'breakdownTotalBaseAfterPricingRules':$scope.getBreakdownTotalBaseAfterPricingRules()
          };

          var trackingData = angular.copy(reservationData);
          trackingData.guestCountry = getUserCountry();

          var scopeData = {
            'allRooms': angular.copy($scope.allRooms),
            'moreRoomData': angular.copy($scope.moreRoomData),
            'profileTitles': angular.copy($scope.profileTitles),
            'profileCountries': angular.copy($scope.profileCountries),
            'userDetails': angular.copy($scope.userDetails)
          };
          mobiusTrackingService.trackPurchase($scope.bookingDetails, $scope.chain, $scope.property, products, $scope.allRooms, trackingData, $scope.rates.selectedRate);

          //Infiniti Tracking purchase
          var infinitiTrackingProducts = [];
          _.each($scope.allRooms, function(room) {
            var p = room._selectedProduct;
            var product = {
              'id': p.code,
              'variant': 'Nights:' + numNights + '|Type:' + room.name,
              'quantity': numNights,
              'amount': (p.price.totalBaseAfterPricingRules / numNights).toFixed(2),
              'category': 'Room',
              'currency': $rootScope.currencyCode,
              'title': propertyData.nameShort + ' - ' + room.name,
              'desc': room.description
            };
            infinitiTrackingProducts.push(product);
          });

          var infinitiTrackingData = {
            'reservationNumber': reservationCode,
            'products': infinitiTrackingProducts
          };

          if ($scope.auth && !$scope.auth.isLoggedIn()) {
            infinitiTrackingData.customer = {
              'title': getUserTitle().name,
              'fName': $scope.userDetails.firstName,
              'lName': $scope.userDetails.lastName,
              'address': $scope.userDetails.address,
              'city': $scope.userDetails.city,
              'zip': $scope.userDetails.zip,
              'country': getUserCountry().code,
              'email': $scope.userDetails.email,
              'phone': $scope.userDetails.phone,
              'secondPhoneNumber': $scope.additionalInfo.secondPhoneNumber
            };
          }
          infinitiEcommerceService.trackPurchase($scope.auth && $scope.auth.isLoggedIn(), infinitiTrackingData);

          var env = document.querySelector('meta[name=environment]').getAttribute('content');
          if (Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] && Settings.infinitiApeironTracking[env].enable) {
            if($rootScope.campaign)
            {
              locationService.getLocations().then(function(locations){
                if(locations && campaignsService.criteriaCheck($rootScope.campaign, $scope.auth && $scope.auth.isLoggedIn(), $stateParams.dates, $stateParams.locationSlug, $stateParams.property, locations)){
                  infinitiApeironService.trackCampaignPurchase($rootScope.campaign.code);
                  console.log('campaign purchase fulfilled');
                }
                else {
                  console.log('campaign purchase not fulfilled');
                }
              });
            }
            infinitiApeironService.trackPurchase(data, chainData, propertyData, trackingData, priceData, scopeData, $stateParams, $scope.rates.selectedRate);

            infinitiApeironService.trackBuy(trackingData, priceData, scopeData, $stateParams);

            //Sending alerts to https://webservice.mobiuswebservices.com/alerting/alert
            apiService.sendApeironAlert('reporting', env, $stateParams, data, priceData);
          }

          if (Settings.eTracker) {
            var userLoggedIn = ($scope.auth && $scope.auth.isLoggedIn()) ? 1 : 0;
            dataLayerService.trackBookingPurchase($scope.getTotal('totalBaseAfterPricingRules'), reservationDetailsParams.reservationCode, userLoggedIn);
          }
        });
      });



      //creating anon user account
      if ($scope.auth && !$scope.auth.isLoggedIn()) {

        var anonUserData = {
          title: $scope.userDetails.title,
          firstName: $scope.userDetails.firstName,
          lastName: $scope.userDetails.lastName,
          address1: $scope.userDetails.address,
          city: $scope.userDetails.city,
          zip: $scope.userDetails.zip,
          state: $scope.userDetails.stateProvince,
          country: $scope.userDetails.localeCode,
          localeCode: $scope.userDetails.localeCode,
          tel1: $scope.userDetails.phone,
          tel2: $scope.additionalInfo.secondPhoneNumber,
          optedIn: $scope.additionalInfo.optedIn
        };

        var params = {
          email: $scope.userDetails.email
        };

        reservationService.getReservation(reservationDetailsParams.reservationCode, params).then(function(reservation) {
          reservationService.updateAnonUserProfile(reservation.customer.id, encodeURIComponent(params.email), anonUserData).then(function() {
            bookingService.clearParams($rootScope.thirdparty ? true : false);
            $state.go('reservationDetail', reservationDetailsParams);
            addReservationConfirmationMessage(reservationCode);
          });
        });
      } else {
        if (reservationData.paymentInfo.paymentMethod === 'point' && $scope.auth.isLoggedIn) {
          userObject.loyalties.amount = $scope.pointsData.currentPoints - $scope.getTotal('pointsRequired');
        }
        bookingService.clearParams($rootScope.thirdparty ? true : false);
        $state.go('reservationDetail', reservationDetailsParams);
        addReservationConfirmationMessage(reservationCode);
      }


    }, function(data) {
      // TODO: Whaat request has failed
      //Apparently soap reason is not reliable so checking against msg
      $scope.isMakingReservation = false;
      $scope.invalidFormData.error = true;

      if (data.error && data.error.msg === 'User already registered') {
        $scope.invalidFormData.email = true;
        $state.go('reservation.details');
        if (Settings.authType === 'infiniti') {
          modalService.openEmailRegisteredLoginDialog();
        }
      } else if (data.error && (data.error.reason === 53 || data.error.reason === 54)) {
        if (data.error.msg === 'Cardholder Name is invalid') {
          $scope.invalidFormData.cardName = true;
        } else if (data.error.msg === 'Payment Type is invalid') {
          $scope.invalidFormData.paymentType = true;
        } else if (data.error.msg === 'Expiry Date is invalid') {
          $scope.invalidFormData.expiryDate = true;
        } else if (data.error.msg === 'Credit card will be expired') {
          $scope.invalidFormData.ccExpired = true;
        } else if (data.error.msg === 'CCV is invalid') {
          $scope.invalidFormData.ccvInvalid = true;
        } else if (data.error.msg === 'Card Number is invalid') {
          $scope.invalidFormData.ccNumberInvalid = true;
        }
        $scope.invalidFormData.payment = true;
        $state.go('reservation.billing');
      } else {
        $scope.invalidFormData.generic = true;
        $state.go('reservation.details');
      }
      clickedSubmit = false;

    });

    preloaderFactory(reservationPromise);
  };

  $scope.openOtherRoomsDialog = function() {
    // Getting rooms settings
    var roomsSettings = bookingService.getMultiRoomData();

    var allRooms = $scope.allRooms.map(function(room) {
      return room;
    });

    var rooms = [];
    for (var i = 0; i < roomsSettings.length; i++) {
      var roomSettings = roomsSettings[i];

      var roomData = _.findWhere(allRooms, {
        code: roomSettings.roomID
      });
      if (roomData) {
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
  function getRooms() {
    var rooms;

    if ($scope.isMultiRoomMode) {
      var multiRoomData = bookingService.getMultiRoomData();

      rooms = multiRoomData.map(function(roomSettings) {
        // Finding corresponding room and product
        var room = _.findWhere($scope.allRooms, {
          code: roomSettings.roomID
        });
        if (room) {
          return {
            roomId: room._selectedProduct.productPropertyRoomTypeId,
            adults: roomSettings.adults,
            children: roomSettings.children
          };
        } else {
          $log.info('Cant find room with code:"' + roomSettings.roomID + '"');
        }
      });

    } else {
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
    if(!$scope.bookingConfig.termsAndConditionsLink && $scope.allRooms && $scope.allRooms.length){
      var products = $scope.allRooms.map(function(room){
        return room._selectedProduct;
      });

      $scope.openPoliciesInfo(products);
    }
  };

  $scope.openPriceBreakdownInfo = function() {
    if ($scope.allRooms && $scope.allRooms.length) {
      modalService.openPriceBreakdownInfo($scope.allRooms);
    }
  };

  $scope.countryPhoneChanged = function() {
    var countryCode = $('#telephone').intlTelInput('getSelectedCountryData').iso2;
    $scope.defaultCountryCode = countryCode;
  };


  //Reservation steps navigation
  $scope.isCurrentBookingStep = function(value) {
    return value === $state.current.name;
  };

  $scope.isBookingStepDisabled = function(value) {
    switch (value) {
      case 'reservation.billing':
        return $state.current.name === 'reservation.details';
      case 'reservation.confirmation':
        return $state.current.name === 'reservation.details' || $state.current.name === 'reservation.billing';
    }
  };

  $scope.goToBookingStep = function(event, state) {
    if ($state.current.name === state || $scope.isBookingStepDisabled(state)) {
      return;
    }

    switch (state) {
      case 'reservation.details':
        $state.go('reservation.details');
        $scope.autofillSync();
        trackProductCheckout(1);
        break;
      case 'reservation.billing':
        $state.go('reservation.billing');
        trackProductCheckout(2);
        break;
      case 'reservation.confirmation':
        $state.go('reservation.confirmation');
        trackProductCheckout(3);
        break;
    }
  };

  //format dates
  $scope.formatDate = function(date, format) {
    return $window.moment(date).format(format);
  };

  $scope.$watch('billingDetails.country', function() {
    if ($scope.billingDetails.country && $scope.profileCountries) {
      $scope.billingDetails.countryObj = contentService.getCountryByID($scope.billingDetails.country, $scope.profileCountries);
    }
  });

  $scope.$watch('userDetails.localeId', function() {
    if ($scope.userDetails.localeId && $scope.profileCountries) {
      var countryObj = getUserCountry($scope.userDetails);
      if (countryObj) {
        $scope.userDetails.countryObj = countryObj;
        // Make sure we have the localeCode for annon user
        $scope.userDetails.localeCode = countryObj.code;
      }
    }
  });

  $scope.redeemVoucher = function() {
    if ($scope.voucher.code && $scope.bookingConfig.vouchers.enable && !$stateParams.reservation) {
      $scope.voucher.verifying = true;

      var params = getCheckVoucherParams();

      return reservationService.checkVoucher(params).then(function(voucherData) {
        if (voucherData.valid) {
          //If successful display success message and price details with voucher param
          $scope.voucher.verifying = false;
          $scope.voucher.valid = true;
          $scope.voucher.submitted = true;

          var roomsPromises = [];
          var rooms;
          $scope.allRooms = [];

          if (!$scope.isMultiRoomMode) {
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
            rooms = multiRoomData.map(function(room) {
              return {
                property: $stateParams.property,
                roomID: room.roomID,
                productCode: room.productCode
              };
            });
          }

          // Loading all the rooms;
          roomsPromises = rooms.map(function(room) {
            return getRoomPromise(room);
          });

          //When new room pricing is there update views
          preloaderFactory($q.all(roomsPromises).then(function() {
            $scope.voucher.verifying = false;
            $scope.voucher.valid = true;
            $scope.voucher.submitted = true;
          }, goToRoom));
        } else {
          invalidVoucher();
          throw new Error();
        }
      }, function() {
        invalidVoucher();
        throw new Error();
      });
    }
  };

  function invalidVoucher() {
    $scope.voucher.verifying = false;
    $scope.voucher.valid = false;
    $stateParams.voucher = null;
    $scope.voucher.submitted = true;
  }


  function getUserTitle(){
    var userTitle = _.find($scope.profileTitles, function(title) {
      return title.id === $scope.userDetails.title;
    });
    return userTitle;
  }

  function getUserCountry(userData) {
    var userDetails = userData || $scope.userDetails;
    var code = userDetails.iso3 || userDetails.localeCode;
    var id = userDetails.localeId;
    var userCountry;

    if (code) {
      userCountry = contentService.getCountryByCode(code, $scope.profileCountries);
    }

    if (id) {
      userCountry = contentService.getCountryByID(id, $scope.profileCountries);
    }

    if (!userCountry) {
      $log.warn('WARNING: Unexpected behaviour, the user country has not been found');
      return null;
    }

    return userCountry;
  }

  function getCheckVoucherParams() {
    var params = {};
    var date = $stateParams.dates.split('_');

    if (date.length) {
      var fromDate = date[0];
      var toDate = date[1];

      params.voucher = $scope.voucher.code ? $scope.voucher.code : $stateParams.voucher;
      params.from = fromDate;
      params.to = toDate;
      params.adults = $stateParams.adults;
      params.children = $stateParams.children;

      if ($scope.allRooms[0]._selectedProduct.productPropertyRoomTypeId) {
        params.productPropertyRoomType = $scope.allRooms[0]._selectedProduct.productPropertyRoomTypeId;
      }
      if ($stateParams.promoCode !== null) {
        params.promoCode = $stateParams.promoCode;
      }
      if ($stateParams.corpCode !== null) {
        params.corpCode = $stateParams.corpCode;
      }
      if ($stateParams.groupCode !== null) {
        params.groupCode = $stateParams.groupCode;
      }
      if (userObject) {
        params.customerId = userObject.id;
      }
    }
    return params;
  }

  //Retrieve stored upgrade
  var storedUpgradeData = roomUpgradesService.getStoredUpgrade();
  var storedUpgrade = storedUpgradeData.upgrade;
  if(storedUpgrade){
    if(storedUpgrade.increased){ //price has increased
      roomUpgradesService.notifyUpgrade($scope,'increase');
      $scope.continue();
    }
    else if(storedUpgrade.decreased){ //price has decreased
      roomUpgradesService.notifyUpgrade($scope,'decrease');
      $scope.continue();
    }
    else { //No pricing has changed, continue as normal
       roomUpgradesService.notifyUpgrade($scope,'success');
       $scope.continue();
    }
  }

  $scope.creditCardsIcons = _.pluck(Settings.UI.booking.cardTypes, 'icon');
  $scope.getCreditCardDetails = creditCardTypeService.getCreditCardDetails;
  $scope.getCreditCardPreviewNumber = creditCardTypeService.getCreditCardPreviewNumber;
  //Set initial payment method as cc
  $scope.selectPaymentMethod('cc');
  $controller('PriceCtr', {
    $scope: $scope
  });
  $controller('AutofillSyncCtrl', {
    $scope: $scope
  });
});
