'use strict';
/*
 * This module controlls book a room page
 */
angular.module('mobius.controllers.reservationDetail', [])

// TODO: needs some polishing - many could be read from reservation detail response...
// Price breakdown and policies seems to have different format then expected

.controller('ReservationDetailCtrl', function($scope, $state, $stateParams, $window,
  $controller, $q, reservationService, preloaderFactory, modalService, scrollService,
  userMessagesService, propertyService, breadcrumbsService, user, $rootScope, $timeout, $location,
  metaInformationService, dataLayerService, Settings, userObject, chainService, infinitiEcommerceService, contentService, routerService,
  apiService, queryService) {

  $controller('SSOCtrl', {
    $scope: $scope
  });

  $scope.previousCurrency = $rootScope.currencyCode;
  $scope.voucher = {};

  if (Settings.UI.currencies.default) {
    $scope.defaultCurrencyCode = Settings.UI.currencies.default;
    $scope.currentCurrency = $scope.defaultCurrencyCode;
    queryService.setValue(Settings.currencyParamName, $scope.defaultCurrencyCode);
    user.storeUserCurrency($scope.defaultCurrencyCode);
    var currencyObj = {};
    currencyObj['mobius-currencycode'] = $scope.defaultCurrencyCode;
    apiService.setHeaders(currencyObj);
    $rootScope.currencyCode = $scope.defaultCurrencyCode;
  }

  // Alias for lodash to get rid of ugly $window._ calls
  var _ = $window._;
  var DATES_SEPARATOR = '_';
  $scope.config = Settings.UI.reservations;
  $scope.inclusionsAsAddons = Settings.API.reservations.inclusionsAsAddons;

  //get meta information
  chainService.getChain(Settings.API.chainCode).then(function(chain) {
    $scope.chain = chain;
    metaInformationService.setPageTitle(chain.meta.pagetitle);
    metaInformationService.setMetaDescription(chain.meta.description);
    metaInformationService.setMetaKeywords(chain.meta.keywords);
    metaInformationService.setOgGraph(chain.meta.microdata.og);

    $timeout(function() {
      scrollService.scrollTo('top');
    }, 0);
  });


  var SHORT_DESCRIPTION_LENGTH = 100;

  breadcrumbsService.addBreadCrumb('My Stays', 'reservations').addBreadCrumb($stateParams.reservationCode);

  $scope.reservationCode = $stateParams.reservationCode;
  $scope.isEditable = $stateParams.view !== 'summary';
  $scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;
  $scope.shareConfig = Settings.UI.shareLinks;

  $timeout(function() {
    $rootScope.$broadcast('floatingBarEvent', {
      isCollapsed: true
    });
  });

  function onAuthorized() {
    var params;

    $scope.user = user.getUser();

    if (!user.getUser().id && !userObject.token) {
      // Logged in as anonymous user - checking if there is an email flag in URL
      if (!$stateParams.email) {
        // Email is not defined in the URL - redirecting back to home page
        $state.go('home');
        return;
      }

      params = {
        email: $stateParams.email
      };
    }

    function invalidVoucher() {
      $scope.voucher.verifying = false;
      $scope.voucher.valid = false;
      $scope.voucher.submitted = true;
    }

    // Getting reservation details
    var reservationPromise = reservationService.getReservation($stateParams.reservationCode, params).then(function(reservation) {
      $scope.reservation = reservation;
      $scope.reservation.isInThePast = isInThePast(reservation);
      $scope.reservation.packages = $scope.reservation.packageItemCodes || []; // API workaround
      var defaultRoom = $scope.reservation.rooms[0];

      $scope.openPoliciesInfo = function() {
        var products = $scope.reservation.rooms.map(function(room) {
          var policies = {};

          $window._.forEach(room, function(value, key) {
            if (key.indexOf('policy') === 0) {
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

      $scope.redeemVoucher = function() {
        $scope.voucher.verifying = true;
        if($scope.voucher.code){
          //Validate voucher which returns an addon
          reservationService.addAddon($stateParams.reservationCode, null, user.isLoggedIn() ? null : $scope.reservation.email, $scope.voucher.code).then(function() {
            $q.all([
              // Available addons
              reservationService.getAvailableAddons({
                propertyCode: reservation.property.code,
                roomTypeCode: defaultRoom.roomTypeCode,
                productCode: reservation.rooms[0].productCode,
                reservationID: reservation.id
              }),
              // Reservation addons
              reservationService.getReservationAddOns($stateParams.reservationCode, user.getUser().id ? null : reservation.email)
            ]).then(function(addons) {
              // addons[0] - available addons
              // Available addons should only contain those which not in reservationAddons
              //$scope.availableAddons = addons[0];

              $scope.availableAddons = [];
              $scope.reservationAddons = [];
              _.each(addons[0], function(addon) {

                var addedAddon = _.find(addons[1], function(a) {
                  return a.code === addon.code;
                });

                if (!addedAddon) {
                  // Checking if user has enought points to buy the addon
                  if (addon.pointsRequired && availablePoints < addon.pointsRequired) {
                    addon.pointsRequired = 0;
                  }
                  $scope.availableAddons.push(addon);
                }
              });

              // addons[1] - reservation addons
              $scope.reservationAddons = _.map(addons[1], function(addon) {
                addon.descriptionShort = addon.description ? addon.description.substr(0, SHORT_DESCRIPTION_LENGTH) : null;
                addon.hasViewMore = addon.descriptionShort.length < addon.description.length;
                if (addon.hasViewMore) {
                  addon.descriptionShort += '…';
                }
                return addon;
              });
              $scope.voucher.submitted = true;
              $scope.voucher.verifying = false;
              $scope.voucher.valid = true;
            });
          }, function() {
            console.log('invalid voucher');
            invalidVoucher();
          });
        }
      };

      $controller('ConfirmationNumberCtrl', {
        $scope: $scope,
        propertyCode: reservation.property.code
      });

      // Getting property details
      var propertyPromise = propertyService.getPropertyDetails(reservation.property.code).then(function(property) {
        $scope.property = property;

        //if applyChainClassToBody, get property details and add its chain as body class for styling
        if (Settings.UI.generics.applyChainClassToBody) {
          propertyService.applyPropertyChainClass(property.chainCode);
        }

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

        $scope.openPriceBreakdownInfo = function() {
          var room = _.clone(data);
          // TODO: Check if this data is enough
          room._selectedProduct = {
            name: defaultRoom.productName,
            totalAfterTaxAfterPricingRules: defaultRoom.price,
            breakdowns: []
          };

          modalService.openPriceBreakdownInfo([room]);
        };
      });

      $scope.otherRooms = [];
      // Getting the details for other rooms
      _.each($scope.reservation.rooms, function(room) {
        if (room.roomTypeCode !== defaultRoom.roomTypeCode) {
          // Other room - getting the details
          propertyService.getRoomDetails(reservation.property.code, room.roomTypeCode).then(function(data) {
            $scope.otherRooms.push(data);
          });
        }
      });

      // Getting available addons and reservation addons
      var availablePoints;

      if (user.isLoggedIn() && user.getUser().loyalties) {
        availablePoints = user.getUser().loyalties.amount || 0;
      } else {
        availablePoints = 0;
      }

      var reservationDataPromise = [propertyPromise, roomDataPromise];

      if(!$scope.config.disableAddons){
        var addonsPromise = $q.all([
          // Available addons
          reservationService.getAvailableAddons({
            propertyCode: reservation.property.code,
            roomTypeCode: defaultRoom.roomTypeCode,
            productCode: reservation.rooms[0].productCode,
            reservationID: reservation.id
          }),
          // Reservation addons
          reservationService.getReservationAddOns($stateParams.reservationCode, user.getUser().id ? null : reservation.email)
        ]).then(function(addons) {
          // addons[0] - available addons
          // Available addons should only contain those which not in reservationAddons
          //$scope.availableAddons = addons[0];

          $scope.availableAddons = [];
          _.each(addons[0], function(addon) {

            var addedAddon = _.find(addons[1], function(a) {
              return a.code === addon.code;
            });

            if (!addedAddon) {
              // Checking if user has enought points to buy the addon
              if (addon.pointsRequired && availablePoints < addon.pointsRequired) {
                addon.pointsRequired = 0;
              }
              $scope.availableAddons.push(addon);
            }
          });

          // addons[1] - reservation addons
          $scope.reservationAddons = _.map(addons[1], function(addon) {
            addon.descriptionShort = addon.description ? addon.description.substr(0, SHORT_DESCRIPTION_LENGTH) : null;
            addon.hasViewMore = addon.descriptionShort.length < addon.description.length;
            if (addon.hasViewMore) {
              addon.descriptionShort += '…';
            }
            return addon;
          });

          $rootScope.currencyCode = $scope.previousCurrency;
          $scope.currentCurrency = $rootScope.currencyCode;
          queryService.setValue(Settings.currencyParamName, $rootScope.currencyCode);
          user.storeUserCurrency($rootScope.currencyCode);
          var currencyObj = {};
          currencyObj['mobius-currencycode'] = $rootScope.currencyCode;
          apiService.setHeaders(currencyObj);
        });
        reservationDataPromise.push(addonsPromise);
      }
      preloaderFactory($q.all(reservationDataPromise));
    });

    preloaderFactory(reservationPromise);
  }

  // Choose either one of these two lines
  $controller('AuthCtrl', {
    $scope: $scope,
    config: {
      onAuthorized: onAuthorized
    }
  });

  $scope.modifyCancelPointsReservation = function() {
    var reservation = $scope.reservation;
    var phoneNumber = $scope.property.tel1;

    // Opening modification confirmation dialogue
    modalService.openModifyingCancelingPointsReservationDialogue(reservation.reservationCode, phoneNumber);
  };

  // TODO: Unify with modifyReservation
  $scope.modifyCurrentReservation = function() {
    var reservation = $scope.reservation;
    // Checking if reservation can be modifyed
    // NOTE: API not providing the flag yet
    if (reservation.canModify && reservation.canModify === false) {
      modalService.openReservationModifyingDisabledDialogue();
      return;
    }

    // Opening modification confirmation dialogue
    modalService.openModifyingReservationDialogue(reservation.reservationCode)
      .then(function() {
        // Reservation modification is confirmed
        startModification(reservation);
      });
  };

  function startModification(reservation) {
    // Redirecting to hotel detail page with corresponding booking settings
    // and switching to edit mode

    var bookingParams = {
      adults: $scope.getCount('adults'),
      children: $scope.getCount('children'),
      dates: reservation.arrivalDate + DATES_SEPARATOR + reservation.departureDate,
      // NOTE: Check corp/group codes
      promoCode: reservation.promoCode,
      // NOTE: This will enable editing
      reservation: reservation.reservationCode,
      // Removing email param when user is logged in
      email: user.isLoggedIn() ? null : reservation.email
    };

    propertyService.getPropertyDetails(reservation.property.code)
      .then(function(details) {
        var paramsData = {};
        paramsData.property = details;
        bookingParams.scrollTo = 'jsRooms';
        routerService.buildStateParams('hotel', paramsData).then(function(params) {
          bookingParams = _.extend(bookingParams, params);
          $state.go('hotel', bookingParams);
        });
      });
  }

  $scope.openCancelReservationDialog = function() {
    // NOTE: API not providing the flag yet
    if ($scope.reservation.canCancel === false) {
      modalService.openReservationCancelingDisabledDialogue();
      return;
    }

    modalService.openCancelReservationDialog($stateParams.reservationCode).then(function() {
      var reservationPromise = reservationService.cancelReservation($stateParams.reservationCode, user.isLoggedIn() ? null : $scope.reservation.email)
        .then(function() {
          // Reservation is removed, notifying user
          //TODO: move to locales

          if ($scope.config.displayCancelConfirmedModal) {
            modalService.openReservationCancelConfirmedDialog($stateParams.reservationCode);
          } else {
            userMessagesService.addMessage('<div>Your Reservation <strong>' +
              $stateParams.reservationCode + '</strong> was successfully cancelled.</div>', false, true);
          }

          // Tracking refund
          dataLayerService.trackReservationRefund($stateParams.reservationCode);

          if (user.isLoggedIn()) {
            $state.go('reservations');
          } else {
            $state.go('home');
          }

        }, function(error) {
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
  $scope.getCount = function(prop) {
    if (!$scope.reservation || !$scope.reservation.rooms || !$scope.reservation.rooms.length) {
      return null;
    }

    return _.reduce(
      _.map($scope.reservation.rooms, function(room) {
        return room[prop];
      }),
      function(t, n) {
        return t + n;
      });
  };

  $scope.getCountPriceDetail = function(prop) {
    if (!$scope.reservation || !$scope.reservation.rooms || !$scope.reservation.rooms.length) {
      return null;
    }

    return _.reduce(
      _.map($scope.reservation.rooms, function(room) {
        if (room.priceDetail) {
          return room.priceDetail[prop];
        }
      }),
      function(t, n) {
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

  $scope.toggleAddonDescription = function(e, addon) {
    addon._expanded = !addon._expanded;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  $scope.addAddon = function(addon) {
    // Checking if same addone is already there
    if ($scope.reservationAddons.indexOf(addon.code) === -1) {
      // Adding the addon to current reservation
      var addAddonPromise = reservationService.addAddon(
        $stateParams.reservationCode,
        addon,
        user.isLoggedIn() ? null : $scope.reservation.email).then(function() {

        //Infiniti Tracking purchase
        var infinitiTrackingProducts = [];
        var product = {
          'id': addon.code,
          'variant': 'Room:' + addon.roomTypeCode + '|Type:' + addon.name,
          'quantity': 1,
          'amount': $scope.inclusionsAsAddons ? addon.price.totalAfterTax : addon.price,
          'category': 'Add-Ons',
          'currency': $rootScope.currencyCode,
          'title': addon.name,
          'desc': addon.description
        };
        infinitiTrackingProducts.push(product);

        var infinitiTrackingData = {
          'reservationNumber': $stateParams.reservationCode,
          'products': infinitiTrackingProducts
        };

        //Getting anon user details
        if (!user.isLoggedIn()) {

          var reservationParams = {
            email: $scope.reservation.email
          };

          reservationService.getReservation($stateParams.reservationCode, reservationParams).then(function(reservation) {
            reservationService.getAnonUserProfile(reservation.customer.id, $scope.reservation.email).then(function(anonUserData) {
              contentService.getTitles().then(function(titles) {
                contentService.getCountries().then(function(countries) {

                  var userTitle = _.find(titles, function(title) {
                    return title.id === anonUserData.title;
                  });
                  var userCountry = _.find(countries, function(country) {
                    return country.id === anonUserData.localeCode;
                  });

                  infinitiTrackingData.customer = {
                    'title': userTitle.name,
                    'fName': anonUserData.firstName,
                    'lName': anonUserData.lastName,
                    'address': anonUserData.address1,
                    'city': anonUserData.city,
                    'zip': anonUserData.zip,
                    'country': userCountry.code,
                    'email': anonUserData.email,
                    'phone': anonUserData.tel1,
                    'secondPhoneNumber': anonUserData.tel2
                  };

                  infinitiEcommerceService.trackPurchase(user.isLoggedIn(), infinitiTrackingData);

                });
              });
            });
          });
        } else {
          infinitiEcommerceService.trackPurchase(user.isLoggedIn(), infinitiTrackingData);
        }

        // Removing from available addons
        $scope.availableAddons = _.reject($scope.availableAddons, function(a) {
          return a.code === addon.code;
        });
        // Adding to reservation addons
        // NOTE: When getting addons from the API points will be reflected in another
        // property as in original object `points` instead of `pointsRequired`
        addon.points = addon.pointsRequired;
        $scope.reservationAddons.push(addon);
        userMessagesService.addMessage('<div>You have added ' + addon.name + ' to your reservation</div>', true);

        // Updating user loyalties once payment was done using the points
        if (addon.pointsRequired && user.isLoggedIn()) {
          user.loadLoyalties();
        }
      });

      preloaderFactory(addAddonPromise);
    }
  };

  // Returns a total price of addons added to current reservation
  $scope.getAddonsTotalPrice = function() {
    return _.reduce($scope.reservationAddons, function(acc, addon) {
      return acc + ($scope.inclusionsAsAddons ? addon.price.totalAfterTax : addon.price);
    }, 0);
  };

  $scope.getAddonsTotalPoints = function() {
    return _.reduce($scope.reservationAddons, function(acc, addon) {
      return acc + addon.points;
    }, 0);
  };

  $scope.openAddonDetailDialog = function(e, addon, payWithPoints) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    modalService.openAddonDetailDialog($scope.addAddon, addon, payWithPoints);
  };

  function isInThePast(reservation) {
    var today = $window.moment().valueOf();
    return $window.moment(reservation.departureDate).valueOf() < today;
  }

  $scope.sendToPassbook = function() {
    reservationService.sendToPassbook($stateParams.reservationCode).then(function() {
      userMessagesService.addMessage('<div>You have successfully added your reservation to passbook.</div>');
    }, function() {
      userMessagesService.addMessage('<div>Sorry, we could not add reservation to passbook, please try again.</div>');
    });
  };

  $scope.openOtherRoomsDialog = function() {
    if (!$scope.reservation) {
      return;
    }

    // Getting rooms settings
    // TODO: Fix images
    var rooms = $scope.reservation.rooms.map(function(room) {
      // Finding corresponding images
      var images;
      var otherRoom = null;

      _.forEach($scope.otherRooms, function(value) {
        if (value.code === room.roomTypeCode) {
          otherRoom = value;
        }
      });

      if (otherRoom) {
        images = otherRoom.images;
      } else {
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
            totalBaseAfterPricingRules: room.price
          }
        }
      };
    });

    modalService.openOtherRoomsDialog(rooms);
  };

  //print page
  $scope.printPage = function() {
    $window.print();
  };

  //Extended breakdown
  $scope.getBreakdownTotalTax = function(code) {
    // Returning a total price of all taxes per id
    var total = 0;
    _.map($scope.reservation.rooms, function(room) {
      _.each(room.priceDetail.taxDetails.policyTaxItemDetails, function(taxItem) {
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
    _.map($scope.reservation.rooms, function(room) {
      _.each(room.priceDetail.feeDetails.policyTaxItemDetails, function(feeItem) {
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
    _.map($scope.reservation.rooms, function(room) {
      _.each(room.priceDetail.breakdowns, function(breakdown) {
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
    _.map($scope.reservation.rooms, function(room) {
      totalBaseAfterPricingRules += room.priceDetail.totalBaseAfterPricingRules;
    });
    return totalBaseAfterPricingRules;
  };

  $scope.getBreakdownTotalTaxes = function(isFee) {
    // Returning a total for all taxes or fees
    var total = 0;
    _.map($scope.reservation.rooms, function(room) {
      total += isFee ? room.priceDetail.feeDetails.totalTax : room.priceDetail.taxDetails.totalTax;
    });
    return total;
  };

  //format dates
  $scope.formatDate = function(date, format) {
    return $window.moment(date).format(format);
  };

  $location.search({});
});
