'use strict';
/*
 * This module controlls a list of reservation page(My stays)
 */
angular.module('mobius.controllers.reservations', [])

.controller('ReservationsCtrl', function($scope, $controller, $q,
  $state, $timeout, modalService, creditCardTypeService, reservationService, scrollService,
  preloaderFactory, propertyService, $window, _, breadcrumbsService, userObject, chainService, metaInformationService, $location, Settings, $rootScope){

  breadcrumbsService.addBreadCrumb('My Stays');

  if (Settings.UI.currencies.default) {
    $scope.defaultCurrencyCode = Settings.UI.currencies.default;
  }
  $scope.viewSettings = Settings.UI.viewsSettings.reservationsOverview;

  //get meta information
  chainService.getChain(Settings.API.chainCode).then(function(chain) {
    $scope.chain = chain;

    $scope.chain.meta.microdata.og = {};
    $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
    $scope.chain.meta.microdata.og['og:title'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:title'];
    $scope.chain.meta.microdata.og['og:description'] = 'Reservations: ' + $scope.chain.meta.microdata.og['og:description'];

    metaInformationService.setPageTitle(chain.meta.pagetitle);
    metaInformationService.setMetaDescription(chain.meta.description);
    metaInformationService.setMetaKeywords(chain.meta.keywords);
    metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

    $timeout(function(){
      scrollService.scrollTo('jsReservations');
    });


  });

  function onAuthorized(isMobiusUser){

    if(isMobiusUser || userObject.token){
      var reservationsPromise = $q.all([
        reservationService.getAll(),
        reservationService.getCancelledReservations()
      ]).then(function(data){
        // data[0] - all active reservations
        // data[1] - cancelled reservations
        processReservationsData(data[0], data[1]);
      },
      function(){
        $state.go('error');
      });
      preloaderFactory(reservationsPromise);
    } else {
      // TODO: Check actions for anonymous user
      $state.go('home');
    }
  }

  $controller('MainCtrl', {$scope: $scope});
  $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

  function processReservationsData(activeReservations, cancelledReservations){
    var pastStays = sortByArrivalDate(
      _.union(getPastStays(activeReservations), cancelledReservations)
    );

    activeReservations = sortByArrivalDate(activeReservations);
    fetchProperties(activeReservations.concat(cancelledReservations));

    var futureStays = getFutureStays(activeReservations);

    $scope.reservations = {
      nextStay: futureStays.shift() || null,
      pastStays: pastStays,
      futureStays: futureStays
    };

    $timeout(function(){
      scrollService.scrollTo('jsReservations');
    }, 500);

  }

  // Sorting by arrivalDate
  // NOTE: Could be also sorted by time - format is not clear TBD
  function sortByArrivalDate(reservations){
    return _.sortBy(reservations, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf();
    });
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
    var todayUtc = new Date().toJSON().slice(0,10);
    var today = parseInt($window.moment(todayUtc).valueOf());
    return _.filter(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf() < today;
    });
  }

  // TODO: Check whats is a future stay(tomorrow/today?)
  function getFutureStays(data){
    var todayUtc = new Date().toJSON().slice(0,10);
    var today = parseInt($window.moment(todayUtc).valueOf());
    return _.filter(data, function(reservation){
      return $window.moment(reservation.arrivalDate).valueOf() >= today;
    });
  }

  $scope.selectDates = function(){
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
      openBookingTab: true,
      openDatePicker: true
    });
  };
});
