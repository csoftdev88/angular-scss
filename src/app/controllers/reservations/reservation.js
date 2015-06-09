'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservation', [])

.controller('ReservationCtrl', function($scope, $stateParams,
  $controller, $window, $state, bookingService, modalService,
  reservationService, preloaderFactory){
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

  $scope.goToBilling = function() {
    console.log($scope);
    //debugger;
  };

  $scope.cardDetails = {
    number: '',
    expires: '',
    cvv: '',
    ownersName: ''
  };

  $scope.onPayment = function() {
    console.log($scope);
    reservationService.createReservation();
  };

  /**
   * Luhn check is an algorithm that checks if credit card number is valid
   * http://en.wikipedia.org/wiki/Luhn_algorithm
   */
  $scope.luhnCheck = function(cardNumber) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(cardNumber)) {
      return false;
    }

    // The Luhn Algorithm.
    var nCheck = 0, nDigit = 0, bEven = false;
    cardNumber = cardNumber.replace(/\D/g, '');

    for (var n = cardNumber.length - 1; n >= 0; n--) {
      var cDigit = cardNumber.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) {
          nDigit -= 9;
        }
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) === 0;
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
    $state.go('room', {
      propertyCode: $scope.bookingDetails.property,
      roomID: $stateParams.roomID
    });
  };

  // This data is used in view
  $scope.bookingDetails = bookingService.getAPIParams();
});
