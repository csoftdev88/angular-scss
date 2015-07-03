'use strict';
/*
 * This module controlls a list of reservation page(My stays)
 */
angular.module('mobius.controllers.reservations', [])

.controller('ReservationsCtrl', function($scope, $controller,
  $state, modalService, creditCardTypeService, reservationService,
  preloaderFactory, propertyService, $window, _, breadcrumbsService){

  breadcrumbsService.addBreadCrumb('My Stays');

  function onAuthorized(isMobiusUser){
    if(isMobiusUser){
      var reservationsPromise = reservationService.getAll().then(function(data){
        processReservationsData(data);
      });
      preloaderFactory(reservationsPromise);
    } else {
      // TODO: Check actions for anonymous user
      $state.go('home');
    }
  }

  $controller('MainCtrl', {$scope: $scope});
  $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

  function processReservationsData(data){
    // Sorting by arrivalDate
    // NOTE: Could be also sorted by time - format is not clear TBD
    data = _.sortBy(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf();
    });

    fetchProperties(data);

    var futureStays = getFutureStays(data);

    $scope.reservations = {
      nextStay: futureStays.shift() || null,
      pastStays: getPastStays(data),
      futureStays: futureStays
    };
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

  // TODO: Check whats is a future stay(tomorrow/today?)
  function getFutureStays(data){
    var today = $window.moment().valueOf();
    return _.filter(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf() >= today;
    });
  }
});
