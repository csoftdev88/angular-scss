'use strict';
/*
 * This module controlls a list of reservation page(My stays)
 */
angular.module('mobius.controllers.reservations', [])

.controller('ReservationsCtrl', function($scope, $controller,
  modalService, creditCardTypeService, reservationService,
  preloaderFactory, propertyService, $window, _){

  $controller('MainCtrl', {$scope: $scope});

  var reservationsPromise = reservationService.getAll().then(function(data){

    processReservationsData(data);
  });

  preloaderFactory(reservationsPromise);

  function processReservationsData(data){
    // Sorting by arrivalDate
    // NOTE: Could be also sorted by time - format is not clear TBD
    data = _.sortBy(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf();
    });

    fetchProperties(data);

    var futureStays = getFutureStays(data);

    $scope.reservations = {
      nextStay: futureStays.shift(),
      pastStays: getPastStays(data),
      futureStays: futureStays
    };

    console.log($scope.reservations);
  }

  $scope.getPropertyDetails = function(code){
    return $scope.properties[code];
  };

  // Getting property details for each reservation
  function fetchProperties(reservations){
    // Cache
    $scope.properties = {};

    _.each(reservations, function(reservation){
      var propertyCode = reservation.property.code;

      if(!$scope.properties[propertyCode]){
        $scope.properties[propertyCode] = {};

        propertyService.getPropertyDetails(propertyCode).then(function(propertyDetails){
          $scope.properties[propertyCode] = propertyDetails;
        });
      }
    });
  }

  function getPastStays(data){
    var today = $window.moment().valueOf();
    return _.filter(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf() < today;
    });
  }

  function getFutureStays(data){
    var today = $window.moment().valueOf();
    return _.filter(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf() >= today;
    });
  }

  $scope.reservationDetails = {};

  $scope.openPoliciesInfo = modalService.openPoliciesInfo;
  $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;
  $scope.openCancelReservationDialog = modalService.openCancelReservationDialog;

  $scope.getCreditCardType = creditCardTypeService.getType;
  $scope.creditCardTypes = {};
  // change names to icons
  $scope.creditCardTypes[creditCardTypeService.AMERICAN_EXPRESS] = 'American Express';
  $scope.creditCardTypes[creditCardTypeService.MAESTRO] = 'Maestro';
  $scope.creditCardTypes[creditCardTypeService.MASTER_CARD] = 'Master Card';
  $scope.creditCardTypes[creditCardTypeService.VISA] = 'Visa';
});
