'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservationDetail', [])

  // TODO: needs some polishing - many could be read from reservation detail response...
  // Price breakdown and policies seems to have different format then expected

  .controller('ReservationDetailCtrl', function($scope, $stateParams, $window,
            reservationService, preloaderFactory, modalService, userMessagesService,
            propertyService, $q, breadcrumbsService/*, $controller*/){

    // Alias for lodash to get rid of ugly $window._ calls
    var _ = $window._;

    var SHORT_DESCRIPTION_LENGTH = 100;

    breadcrumbsService.addBreadCrumb('My Stays', 'reservations').addBreadCrumb($stateParams.reservationCode);

    $scope.reservationCode = $stateParams.reservationCode;

    function onAuthorized() {
      var reservationPromise = reservationService.getReservation($stateParams.reservationCode).then(function(reservation) {
        $scope.reservation = reservation;
        $scope.reservation.packages = $scope.reservation.packageItemCodes || []; // API workaround

        var propertyPromise = propertyService.getPropertyDetails(reservation.property.code).then(function(property) {
          $scope.property = property;
        });

        // Getting room/products data
        var roomDataPromise = propertyService.getRoomDetails(reservation.property.code, reservation.rooms[0].roomTypeCode).then(function(data) {
          $scope.roomDetails = data;
        });

        var roomProductsPromise = propertyService.getRoomProducts(reservation.property.code, reservation.rooms[0].roomTypeCode, {
          from: reservation.arrivalDate,
          to: reservation.departureDate,
          adults: reservation.rooms[0].adults,
          children: reservation.rooms[0].children
        }).then(function(data) {
          $scope.selectedProduct = _.findWhere(data.products, {code: reservation.rooms[0].productCode});
        });

        var extrasPromise = propertyService.getRoomProductAddOns(reservation.property.code, reservation.rooms[0].roomTypeCode, reservation.rooms[0].productCode, {
          from: reservation.arrivalDate,
          to: reservation.departureDate,
          customerId: reservation.customer.id
        }).then(function(addons) {
          $scope.addonsLength = addons.length;
          $scope.addons = _.map(addons, function(addon) {
            addon.descriptionShort = addon.description.substr(0, SHORT_DESCRIPTION_LENGTH);
            addon.hasViewMore = addon.descriptionShort.length < addon.description.length;
            if (addon.hasViewMore) {
              addon.descriptionShort += '…';
            }
            return addon;
          });
          $scope.addons = _.indexBy($scope.addons, 'code');
        });

        return $q.all([propertyPromise, roomDataPromise, roomProductsPromise, extrasPromise]).then(function() {
          if (modalService.openPoliciesInfo.bind) { // WTF - PhatomJS workaround
            $scope.openPoliciesInfo = modalService.openPoliciesInfo.bind(modalService, $scope.selectedProduct);
            $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo.bind(modalService, $scope.roomDetails, $scope.selectedProduct);
          }
        });
      });

      // Showing loading mask
      preloaderFactory(reservationPromise);
    }

    // choose either one of these two lines
    //$controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});
    onAuthorized();

    $scope.modifyReservation = function(onError) {
      var reservationPromise = reservationService.modifyReservation($stateParams.reservationCode, $scope.reservation).then(
        function() {
          // TODO ?
      },
        function(error) {
          if (error && error.error && error.error.msg) {
            userMessagesService.addInfoMessage('<p>' + error.error.msg + '</p>');
          } else {
            userMessagesService.addInfoMessage('<p>Unknown error</p>');
          }
          if (onError) {
            onError(error);
          }
        }
      );

      preloaderFactory(reservationPromise);
    };

    $scope.addAddon = function(addon) {
      if($scope.reservation.packages.indexOf(addon.code) === -1) {
        $scope.reservation.packages.push(addon.code);
        $scope.modifyReservation(function() {
          $scope.reservation.packages.splice($scope.reservation.packages.indexOf(addon.code), 1);
        });
      }
    };

    $scope.getPackagesPrice = function() {
      return _.reduce($scope.reservation.packages, function(acc, packageCode) { return acc + $scope.addons[packageCode].price; }, 0);
    };

    if (modalService.openAddonDetailDialog.bind) { // WTF - PhatomJS workaround
      $scope.openAddonDetailDialog = modalService.openAddonDetailDialog.bind(modalService, $scope.addAddon.bind($scope));
    }

    if (modalService.openCancelReservationDialog.bind) { // WTF - PhatomJS workaround
      $scope.openCancelReservationDialog = modalService.openCancelReservationDialog.bind(modalService, $stateParams.reservationCode);
    }
  });
