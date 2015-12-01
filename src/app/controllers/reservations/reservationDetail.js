'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservationDetail', [])

  // TODO: needs some polishing - many could be read from reservation detail response...
  // Price breakdown and policies seems to have different format then expected

  .controller('ReservationDetailCtrl', function($scope, $state, $stateParams, $window,
    $controller, $q, reservationService, preloaderFactory, modalService,
    userMessagesService, propertyService, breadcrumbsService, user, $rootScope, $timeout, $location,
    metaInformationService, dataLayerService, Settings, userObject){

    // Alias for lodash to get rid of ugly $window._ calls
    var _ = $window._;

    var SHORT_DESCRIPTION_LENGTH = 100;

    breadcrumbsService.addBreadCrumb('My Stays', 'reservations').addBreadCrumb($stateParams.reservationCode);

    $scope.reservationCode = $stateParams.reservationCode;
    $scope.isEditable = $stateParams.view !== 'summary';
    $scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;

    $timeout(function(){
      $rootScope.$broadcast('floatingBarEvent', {
        isCollapsed: true
      });
    });

    function onAuthorized(isMobiusUser) {
      var params;

      if(!isMobiusUser && !userObject.token){
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
        var defaultRoom = $scope.reservation.rooms[0];

        $scope.openPoliciesInfo = function(){
          var products = $scope.reservation.rooms.map(function(room){
            var policies = {};

            $window._.forEach(room, function (value, key) {
              if(key.indexOf('policy') === 0) {
                policies[key.substr(6).toLowerCase()] = value;
              }
            });

            return {
              name: room.productName,
              policies: policies
            };
          });



          modalService.openPoliciesInfo(products);
        };


        $controller('ConfirmationNumberCtrl', {$scope: $scope, propertyCode: reservation.property.code});

        // Getting property details
        var propertyPromise = propertyService.getPropertyDetails(reservation.property.code).then(function(property) {
          $scope.property = property;
          //sharing
          $scope.shareURL = $location.protocol() + '://' + $location.host() + '/hotels/' + $scope.property.meta.slug;
          $scope.property.meta.microdata.og['og:url'] = $scope.shareURL;
          metaInformationService.setOgGraph($scope.property.meta.microdata.og);
          $scope.facebookShare = {
            url: $scope.shareURL,
            name: $scope.property.meta.microdata.og['og:description'],
            image: $scope.property.meta.microdata.og['og:image']
          };
        });

        // Getting room/products data
        var roomDataPromise = propertyService.getRoomDetails(reservation.property.code, defaultRoom.roomTypeCode).then(function(data) {
          $scope.roomDetails = data;

          $scope.openPriceBreakdownInfo = function(){
            var room = _.clone(data);
            // TODO: Check if this data is enough
            room._selectedProduct = {
              name: defaultRoom.productName,
              totalAfterTax: defaultRoom.price,
              breakdowns: []
            };

            modalService.openPriceBreakdownInfo([room]);
          };
        });

        $scope.otherRooms = [];
        // Getting the details for other rooms
        _.each($scope.reservation.rooms, function(room){
          if(room.roomTypeCode !== defaultRoom.roomTypeCode){
            // Other room - getting the details
            propertyService.getRoomDetails(reservation.property.code, room.roomTypeCode).then(function(data) {
              $scope.otherRooms.push(data);
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
          reservationService.getAvailableAddons({propertyCode: reservation.property.code,roomTypeCode: defaultRoom.roomTypeCode}),
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

      // Opening modification confirmation dialogue
      modalService.openModifyingReservationDialogue(reservation.reservationCode)
        .then(function(){
          // Reservation modification is confirmed
          startModification(reservation);
        });
    };

    function startModification(reservation){
      // Redirecting to hotel detail page with corresponding booking settings
      // and switching to edit mode
      // TODO: Support multiroom modification once API is ready for modification
      var bookingParams = {
        property: reservation.property.code,
        adults: $scope.getCount('adults'),
        children: $scope.getCount('children'),
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
    }

    $scope.openCancelReservationDialog = function(){
      // NOTE: API not providing the flag yet
      if($scope.reservation.canCancel === false){
        modalService.openReservationCancelingDisabledDialogue();
        return;
      }

      modalService.openCancelReservationDialog($stateParams.reservationCode).then(function(){
        var reservationPromise = reservationService.cancelReservation($stateParams.reservationCode, $stateParams.email)
        .then(function(){

          // Reservation is removed, notifying user
          userMessagesService.addMessage('<div>Your Reservation <strong>' +
          $stateParams.reservationCode + '</strong> was successfully canceled.</div>', false, true);

          // Tracking refund
          dataLayerService.trackReservationRefund($stateParams.reservationCode);

          if(!$stateParams.email){
            $state.go('reservations');
          }
          
        }, function(error){
          if (error && error.error && error.error.msg) {
            userMessagesService.addMessage('<p>' + error.error.msg + '</p>');
          } else {
            userMessagesService.addMessage('<p>Unknown error</p>');
          }
        });

        preloaderFactory(reservationPromise);
      });
    };

    // NOTE: Same is in reservationDirective - unify
    $scope.getCount = function(prop){
      if(!$scope.reservation || !$scope.reservation.rooms || !$scope.reservation.rooms.length){
        return null;
      }

      return _.reduce(
        _.map($scope.reservation.rooms, function(room){
          return room[prop];
        }), function(t, n){
          return t + n;
        });
    };

    // TODO: Check if this needed?
    $scope.modifyReservation = function(onError) {
      var reservationPromise = reservationService.modifyReservation($stateParams.reservationCode, $scope.reservation).then(
        function() {
          // TODO ?
      },
        function(error) {
          if (error && error.error && error.error.msg) {
            userMessagesService.addMessage('<p>' + error.error.msg + '</p>');
          } else {
            userMessagesService.addMessage('<p>Unknown error</p>');
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
          userMessagesService.addMessage('<div>You have added ' + addon.name + ' to your reservation</div>', true);

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
        userMessagesService.addMessage('<div>You have successfully added your reservation to passbook.</div>');
      }, function(){
        userMessagesService.addMessage('<div>Sorry, we could not add reservation to passbook, please try again.</div>');
      });
    };

    $scope.openOtherRoomsDialog = function(){
      if(!$scope.reservation){
        return;
      }

      // Getting rooms settings
      // TODO: Fix images
      var rooms = $scope.reservation.rooms.map(function(room){
        // Finding corresponding images
        var images;

        var otherRoom = _.findWhere($scope.otherRooms, {code: room.roomTypeCode});

        if(otherRoom){
          images = otherRoom.images;
        }else{
          // Picking up default images
          images = $scope.roomDetails.images;
        }

        return {
          _adults: room.adults,
          _children: room.children,
          name: room.roomTypeName,
          images: images,
          _selectedProduct: {
            name: room.productName,
            price: {
              totalBase: room.price
            }
          }
        };
      });

      modalService.openOtherRoomsDialog(rooms);
    };

    //print page
    $scope.printPage = function(){
      $window.print();
    };
  });
