'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservationDetail', [])

  // TODO: needs some polishing - many could be read from reservation detail response...
  // Price breakdown and policies seems to have different format then expected

  .controller('ReservationDetailCtrl', function($scope, $state, $stateParams, $window,
            reservationService, preloaderFactory, modalService, userMessagesService,
            propertyService, $q, breadcrumbsService /*, $controller*/){

    // Alias for lodash to get rid of ugly $window._ calls
    var _ = $window._;

    var SHORT_DESCRIPTION_LENGTH = 100;

    breadcrumbsService.addBreadCrumb('My Stays', 'reservations').addBreadCrumb($stateParams.reservationCode);

    $scope.reservationCode = $stateParams.reservationCode;

    function onAuthorized() {
      var reservationPromise = reservationService.getReservation($stateParams.reservationCode).then(function(reservation) {
        $scope.reservation = reservation;
        $scope.reservation.packages = $scope.reservation.packageItemCodes || []; // API workaround
        var room = $scope.reservation.rooms[0];

        if (modalService.openPoliciesInfo.bind) { // WTF - PhatomJS workaround
          var policies = {};
          $window._.forEach(room, function (value, key) {
            if(key.indexOf('policy') === 0) {
              policies[key.substr(6).toLowerCase()] = value;
            }
          });
          $scope.openPoliciesInfo = modalService.openPoliciesInfo.bind(modalService, {
            policies: policies
          });
        }

        var propertyPromise = propertyService.getPropertyDetails(reservation.property.code).then(function(property) {
          $scope.property = property;
        });

        // Getting room/products data
        var roomDataPromise = propertyService.getRoomDetails(reservation.property.code, room.roomTypeCode).then(function(data) {
          $scope.roomDetails = data;
          if (modalService.openPriceBreakdownInfo.bind) { // WTF - PhatomJS workaround
            $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo.bind(modalService, $scope.roomDetails, {
              name: room.productName,
              totalAfterTax: room.price,
              breakdowns: []
            });
          }
        });

        return $q.all([propertyPromise, roomDataPromise]);
      });

      var extrasPromise = reservationService.getReservationAddOns($stateParams.reservationCode).then(function(addons) {
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

      // Showing loading mask
      preloaderFactory(reservationPromise, extrasPromise);
    }

    // choose either one of these two lines
    //$controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});
    onAuthorized();

    // TODO: Unify with modifyReservation
    $scope.modifyCurrentReservation = function(){
      // Redirecting to hotel detail page with corresponding booking settings
      // and switching to edit mode
      var reservation = $scope.reservation;
      console.log($scope.reservation);
      var bookingParams = {
        property: reservation.property.code,
        adults: getCount(reservation.rooms, 'adults'),
        children: getCount(reservation.rooms, 'children'),
        dates: reservation.arrivalDate + ' ' + reservation.departureDate,
        // NOTE: Check corp/group codes
        promoCode: reservation.promoCode,
        // NOTE: This will enable editing
        reservation: reservation.reservationCode
      };

      // NOTE: Info dialogue
      modalService.openModifyingReservationDialogue(reservation.reservationCode);

      $state.go('hotel', bookingParams);
    };

    // NOTE: Same is in reservationDirective - unify
    function getCount(rooms, prop){
        return _.reduce(
          _.map(rooms, function(room){
            return room[prop];
          }), function(t, n){
            return t + n;
          });
      }

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
