'use strict';
/*
 * This module controlls a list of reservation page(My stays)
 */
angular.module('mobius.controllers.reservations', [])

.controller('ReservationsCtrl', function($scope, $controller, $q,
  $state, modalService, creditCardTypeService, reservationService,
  preloaderFactory, propertyService, $window, _, breadcrumbsService){

  breadcrumbsService.addBreadCrumb('My Stays');

  function onAuthorized(isMobiusUser){
    if(isMobiusUser){
      var reservationsPromise = $q.all([
        reservationService.getAll(),
        reservationService.getCancelledReservations()
      ]).then(function(data){
        // data[0] - all(future, past) reservations
        // data[1] - cancelled reservation
        processReservationsData(_.union(data[0], data[1]));
      });
      preloaderFactory(reservationsPromise);
    } else {
      // TODO: Check actions for anonymous user
      $state.go('home');
    }
  }

  $controller('MainCtrl', {$scope: $scope});
  $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

  function processReservationsData(reservations){
    // Sorting by arrivalDate
    // NOTE: Could be also sorted by time - format is not clear TBD
    reservations = _.sortBy(reservations, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf();
    });

    fetchProperties(reservations);

    var futureStays = getFutureStays(reservations);

    $scope.reservations = {
      nextStay: futureStays.shift() || null,
      pastStays: getPastStays(reservations),
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
