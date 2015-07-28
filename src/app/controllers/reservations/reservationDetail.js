'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservationDetail', [])

  // TODO: needs some polishing - many could be read from reservation detail response...
  // Price breakdown and policies seems to have different format then expected

  .controller('ReservationDetailCtrl', function($scope, $state, $stateParams, $window,
    $controller, $q, reservationService, preloaderFactory, modalService,
    userMessagesService, propertyService, breadcrumbsService, user, $rootScope, $timeout){

    // Alias for lodash to get rid of ugly $window._ calls
    var _ = $window._;

    var SHORT_DESCRIPTION_LENGTH = 100;

    breadcrumbsService.addBreadCrumb('My Stays', 'reservations').addBreadCrumb($stateParams.reservationCode);

    $scope.reservationCode = $stateParams.reservationCode;

    $timeout(function(){
      $rootScope.$broadcast('floatingBarEvent', {
        isCollapsed: true
      });
    });

    function onAuthorized(isMobiusUser) {
      var params;

      if(!isMobiusUser){
        // Logged in as anonymous user - checking if there is an email flag in URL
        if(!$stateParams.email){
          // Email is not defined in the URL - redirecting back to home page
          $state.go('home');
          return;
        }

        params = {
          email: $stateParams.email
        };
      }

      // Getting reservation details
      var reservationPromise = reservationService.getReservation($stateParams.reservationCode, params).then(function(reservation) {
        $scope.reservation = reservation;
        $scope.reservation.isInThePast = isInThePast(reservation);
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

        // Getting property details
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

        // Getting available addons and reservation addons

        var availablePoints;

        if(user.isLoggedIn() && user.getUser().loyalties){
          availablePoints = user.getUser().loyalties.amount || 0;
        }else{
          availablePoints = 0;
        }

        var addonsPromise = $q.all([
          // Available addons
          reservationService.getAvailableAddons({propertyCode: reservation.property.code,roomTypeCode: room.roomTypeCode}),
          // Reservation addons
          reservationService.getReservationAddOns($stateParams.reservationCode, isMobiusUser?null:$stateParams.email)
        ]).then(function(addons){
          // addons[0] - available addons
          // Available addons should only contain those which not in reservationAddons
          //$scope.availableAddons = addons[0];

          $scope.availableAddons = [];
          _.each(addons[0], function(addon){
            var addedAddon = _.findWhere(addons[1], function(a){
              return a.code === addon.code;
            });

            if(!addedAddon){
              // Checking if user has enought points to buy the addon
              if(addon.pointsRequired && availablePoints < addon.pointsRequired){
                addon.pointsRequired = 0;
              }

              $scope.availableAddons.push(addon);
            }
          });

          // addons[1] - reservation addons
          $scope.reservationAddons = _.map(addons[1], function(addon) {
            addon.descriptionShort = addon.description.substr(0, SHORT_DESCRIPTION_LENGTH);
            addon.hasViewMore = addon.descriptionShort.length < addon.description.length;
            if (addon.hasViewMore) {
              addon.descriptionShort += '…';
            }
            return addon;
          });
        });

        preloaderFactory($q.all([propertyPromise, roomDataPromise, addonsPromise]));
      });

      preloaderFactory(reservationPromise);
    }

    // Choose either one of these two lines
    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    // TODO: Unify with modifyReservation
    $scope.modifyCurrentReservation = function(){
      var reservation = $scope.reservation;
      // Checking if reservation can be modifyed
      // NOTE: API not providing the flag yet
      if(reservation.canModify === false){
        modalService.openReservationModifyingDisabledDialogue();
        return;
      }

      // Redirecting to hotel detail page with corresponding booking settings
      // and switching to edit mode
      var bookingParams = {
        property: reservation.property.code,
        adults: getCount(reservation.rooms, 'adults'),
        children: getCount(reservation.rooms, 'children'),
        dates: reservation.arrivalDate + ' ' + reservation.departureDate,
        // NOTE: Check corp/group codes
        promoCode: reservation.promoCode,
        // NOTE: This will enable editing
        reservation: reservation.reservationCode,
        // Removing email param when user is logged in
        email: user.isLoggedIn()?null:$stateParams.email,
        // propertySlug is required
        propertySlug: $scope.property.meta && $scope.property.meta.slug?$scope.property.meta.slug:reservation.property.code
      };

      $state.go('hotel', bookingParams);
    };

    $scope.openCancelReservationDialog = function(){
      // NOTE: API not providing the flag yet
      if($scope.reservation.canCancel === false){
        modalService.openReservationCancelingDisabledDialogue();
        return;
      }

      modalService.openCancelReservationDialog($stateParams.reservationCode).then(function(){
        var reservationPromise = reservationService.cancelReservation($stateParams.reservationCode)
        .then(function(){
          $state.go('reservations');
        }, function(error){
          if (error && error.error && error.error.msg) {
            userMessagesService.addInfoMessage('<p>' + error.error.msg + '</p>');
          } else {
            userMessagesService.addInfoMessage('<p>Unknown error</p>');
          }
        });

        preloaderFactory(reservationPromise);
      });
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

    // TODO: Check if this needed?
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

    $scope.toggleAddonDescription = function(e, addon){
      addon._expanded = !addon._expanded;
      if(e){
        e.preventDefault();
        e.stopPropagation();
      }
    };

    $scope.addAddon = function(addon) {
      // Checking if same addone is already there
      if($scope.reservationAddons.indexOf(addon.code) === -1) {
        // Adding the addon to current reservation
        var addAddonPromise = reservationService.addAddon(
          $stateParams.reservationCode,
          addon,
          user.isLoggedIn()?null:$stateParams.email).then(function(){
          // Removing from available addons
          $scope.availableAddons.splice($scope.availableAddons.indexOf(addon.code), 1);
          // Adding to reservation addons
          // NOTE: When getting addons from the API points will be reflected in another
          // property as in original object `points` instead of `pointsRequired`
          addon.points = addon.pointsRequired;
          $scope.reservationAddons.push(addon);
          userMessagesService.addInfoMessage('<div>You have added ' + addon.name + ' to your reservation</div>');

          // Updating user loyalties once payment was done using the points
          if(addon.pointsRequired && user.isLoggedIn()){
            user.loadLoyalties();
          }
        });

        preloaderFactory(addAddonPromise);
      }
    };

    // Returns a total price of addons added to current reservation
    $scope.getAddonsTotalPrice = function() {
      return _.reduce($scope.reservationAddons, function(acc, addon) { return acc + addon.price; }, 0);
    };

    $scope.getAddonsTotalPoints = function() {
      return _.reduce($scope.reservationAddons, function(acc, addon) { return acc + addon.points; }, 0);
    };

    $scope.openAddonDetailDialog = function(e, addon, payWithPoints){
      if(e){
        e.preventDefault();
        e.stopPropagation();
      }

      modalService.openAddonDetailDialog($scope.addAddon, addon, payWithPoints);
    };

    function isInThePast(reservation){
      var today = $window.moment().valueOf();
      return $window.moment(reservation.departureDate).valueOf() < today;
    }
    $scope.sendToPassbook = function(){
      reservationService.sendToPassbook($stateParams.reservationCode).then(function(){
        userMessagesService.addInfoMessage('<div>You have successfully added your reservation <strong>' +
          $stateParams.reservationCode + '</strong> to passbook.</div>');
      }, function(){
        userMessagesService.addInfoMessage('<div>Sorry, we could not add reservation <strong>' +
          $stateParams.reservationCode + '</strong> to passbook, please try again.</div>');
      });
    };
  });
