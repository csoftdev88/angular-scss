'use strict';
/*
 *  Controller for hotel details page with a list of rooms
 */
angular.module('mobius.controllers.hotel.details', [
  'mobiusApp.filters.cloudinaryImage'
])

.controller('HotelDetailsCtrl', function($scope, $filter, _, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService, metaInformationService, channelService, previousSearchesService,
  $window, advertsService, $controller, $timeout, scrollService, $location, $stateParams, Settings, stateService, $rootScope, userPreferenceService, locationService, routerService, DynamicMessages) {

  $controller('PriceCtr', {
    $scope: $scope
  });
  // Used for rate notification message
  $controller('RatesCtrl', {
    $scope: $scope
  });

  //Apply config:
  $scope.hasViewMore = Settings.UI.viewsSettings.hotelDetails.hasViewMore;
  $scope.hasTitle = Settings.UI.viewsSettings.hotelDetails.hasTitle;
  $scope.config = Settings.UI.hotelDetails;
  $scope.roomsConfig = Settings.UI.hotelDetails.rooms;
  $scope.viewSettings = Settings.UI.viewsSettings.hotelDetails;
  $scope.ratesLoaded = false;
  $scope.isFromSearch = $stateParams.fromSearch && $stateParams.fromSearch === '1';
  $scope.showLocalInfo = Settings.UI.hotelDetails.showLocalInfo;
  $scope.headerPartial = Settings.UI.hotelDetails.headerPartial;
  $scope.partials = [];
  $scope.fromMeta = channelService.getChannel().name === 'meta' ? true : false;
  $scope.compareRoomLimit = 3;
  $scope.comparisonIndex = 0;

  var defaultRoomsViewMode = $scope.viewSettings.defaultViewMode;
  var showAltDates = $scope.roomsConfig.alternativeDisplays && $scope.roomsConfig.alternativeDisplays.dates && $scope.roomsConfig.alternativeDisplays.dates.enable;
  var showAltProperties = $scope.roomsConfig.alternativeDisplays && $scope.roomsConfig.alternativeDisplays.properties && $scope.roomsConfig.alternativeDisplays.properties.enable;

  //Get our dynamic translations
  var appLang = stateService.getAppLanguageCode();
  var dynamicMessages = appLang && DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang] : null;

  //define page partials based on settings
  _.map(Settings.UI.hotelDetails.partials, function(value, key) {
    if (value === true) {
      var partial = 'layouts/hotels/detailPartial/' + key + '.html';
      $scope.partials.push(partial);
    }
  });


  var SHORT_DESCRIPTION_LENGTH = 200;
  var NUMBER_OF_OFFERS = 6;
  var bookingParams = bookingService.getAPIParams();
  bookingParams = bookingService.updateOfferCode(bookingParams);
  bookingParams = bookingService.updateDiscountCode(bookingParams);
  var mobiusUserPreferences = userPreferenceService.getCookie();
  var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);

  $rootScope.flexibleDates = mobiusUserPreferences && mobiusUserPreferences.flexibleDates ? mobiusUserPreferences.flexibleDates : null;
  $scope.showFlexibleDates = $stateParams.dates && Settings.UI.bookingWidget.flexibleDates && Settings.UI.bookingWidget.flexibleDates.enable && $rootScope.flexibleDates ? true : false;

  // Include the amenities
  bookingParams.includes = 'amenities';

  // Sorting options
  $scope.initSortingOptions = function(options) {
    $scope.sortingOptions = [{
      name: options.priceLowToHigh,
      sort: function(room) {
        return room.priceFrom ? room.priceFrom : room.name;
      }
    }, {
      name: options.priceHighToLow,
      sort: function(room) {
        return room.priceFrom ? 0 - room.priceFrom : room.name;
      }
    }];

    if (Settings.UI.hotelDetails.rooms.sortRoomsByWeighting) {
      $scope.sortingOptions.splice(0, 0, {
        name: options.recommended,
        sort: function(room) {
          return room.weighting ? [-room.priceFrom, -room.weighting] : room.name;
        }
      });
    }

    /*
    USER PREFERENCE SETTINGS
    */
    //order switch default value
    if (mobiusUserPreferences && mobiusUserPreferences.hotelCurrentOrder) {
      var index = _.findIndex($scope.sortingOptions, function(option) {
        return option.name === mobiusUserPreferences.hotelCurrentOrder;
      });
      $timeout(function() {
        $scope.currentOrder = $scope.sortingOptions[index !== -1 ? index : 0];
      }, 0);
    } else {
      $timeout(function() {
        $scope.currentOrder = $scope.sortingOptions[1];
      }, 0);
    }

    /*<select
      name="sorting"
      ng-model="currentOrder"
      disable-search="true"
      chosen
      ng-options="option.name for option in sortingOptions"
      placeholder-text-single="_sorting_filter_placeholder_"
      ng-change="orderSwitchChange(currentOrder)"
      ng-init="initSortingOptions({
        'priceLowToHigh': '_price_low_to_high_',
        'priceHighToLow': '_price_high_to_low_',
        'recommended': '_recommended_'
      })">
    </select>*/

    //save order switch value to cookies when changed
    $scope.orderSwitchChange = function(selected) {
      userPreferenceService.setCookie('hotelCurrentOrder', selected.name);
    };

  };


  //If flexible dates is enabled and dates are selected
  if($scope.showFlexibleDates && $stateParams.dates && $rootScope.flexibleDates){

    $scope.flexibleDates = [];

    var dates = $stateParams.dates.split('_');
    var fromDate = dates[0];
    var toDate = dates[1];

    var lengthOfStay = $window.moment(dates[1]).diff($window.moment(dates[0]), 'days');

    var startFromDate = $window.moment.tz(fromDate, Settings.UI.bookingWidget.timezone).add((-1 * $rootScope.flexibleDates), 'day').startOf('day');
    var startToDate = $window.moment.tz(toDate, Settings.UI.bookingWidget.timezone).add((-1 * $rootScope.flexibleDates), 'day').startOf('day');
    var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
    var datesLength = ($rootScope.flexibleDates * 2) + 1;
    var origStartFromDate = startFromDate;

    for(var i = 0; i < datesLength; i++)
    {
      if(startFromDate >= today && startToDate >= today){
        var flexiDate = {
          'value':startFromDate.format('YYYY-MM-DD') + '_' + startToDate.format('YYYY-MM-DD'),
          'name':startFromDate.format('DD MMM YYYY') + ' - ' + startToDate.format('DD MMM YYYY')
        };
        flexiDate.shortName = flexiDate.name;
        $scope.flexibleDates.push(flexiDate);
      }
      startFromDate = $window.moment(startFromDate).add(1, 'day');
      startToDate = $window.moment(startToDate).add(1, 'day');
    }

    var lengthDifference = datesLength - $scope.flexibleDates.length;
    $scope.flexibleDate = $scope.flexibleDates[$rootScope.flexibleDates - lengthDifference];

    var params = {
      'from':origStartFromDate.format('YYYY-MM-DD'),
      'to':startFromDate.add(-1,'day').format('YYYY-MM-DD'),
      'adults':bookingParams.adults,
      'children':bookingParams.children,
      'lengthOfStay':lengthOfStay
    };

    if(bookingParams.productGroupId){
      params.productPropertyRoomTypeId = bookingParams.productGroupId;
    }
    if(bookingParams.promoCode){
      params.promoCode = bookingParams.promoCode;
    }
    if(bookingParams.groupCode){
      params.groupCode = bookingParams.groupCode;
    }
    if(bookingParams.corpCode){
      params.corpCode = bookingParams.corpCode;
    }

    propertyService.getAvailabilityOverview(propertyCode, params).then(function(availabilities){
      _.each($scope.flexibleDates, function(flexibleDate){
        var datesArray = flexibleDate.value.split('_');
        var flexibleFrom = $window.moment.tz(datesArray[0], Settings.UI.bookingWidget.timezone);
        _.each(availabilities, function(availability){
          if(flexibleFrom.format('YYYY-MM-DD') === availability.date)
          {
            flexibleDate.available = availability.available && availability.fullyAvailable;
            if(flexibleDate.available && availability.priceFrom){
              var fromString = dynamicMessages && dynamicMessages.from ? dynamicMessages.from : 'from';
              flexibleDate.name += ' ('+ fromString + ' ' + stateService.getCurrentCurrency().symbol + availability.priceFrom +')';
            }
            else
            {
              flexibleDate.disabled = true;
              flexibleDate.name += ' (unavailable)';
            }
          }
        });
        $timeout(function() {
          $('.dates-dropdown-container .dates-switch select').trigger('chosen:updated');
        });
      });
      $timeout(function() {
        $('.dates-dropdown-container .dates-switch select').trigger('chosen:updated');
      });
    });

    $scope.flexibleDatesChange = function(flexibleDate){
      $scope.flexibleDate = flexibleDate;
      var params = $state.params;
      params.dates = flexibleDate.value;
      $state.go($state.current.name, params, {reload: false});
      bookingParams.from = params.dates.split('_')[0];
      bookingParams.to = params.dates.split('_')[1];
      getHotelDetails(propertyCode, bookingParams);
      $timeout(function() {
        $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', bookingParams);
      });
    };
  }

  if (!propertyCode) {
    $state.go('hotels');
    return;
  }

  $scope.scrollToBreadcrumbs = function() {
    $timeout(function() {
      scrollService.scrollTo();
    }, 0);
  };

  //Getting raw property details to display property desc etc...fast
  propertyService.getPropertyDetails(propertyCode).then(function(details) {

    //response from request with params may be faster, in which case don't overwrite scope.details as response from this call does not include amenities
    if (angular.isUndefined($scope.details)) {
      $scope.details = details;
    }

    //If a property is defined (which denotes a search) store this search
    if(propertyCode){
      var currentParams = angular.copy($stateParams);
      currentParams.property = propertyCode;
      previousSearchesService.addSearch($state.current.name, currentParams, details.nameLong, details.code);
    }

    $scope.localInfo = details.localInfo;
    if (Settings.UI.viewsSettings.breadcrumbsBar.displayPropertyTitle) {
      breadcrumbsService.setHeader(details.nameLong);
    }
    // Updating Hero content images
    if (details.images) {
      $scope.updateHeroContent($window._.filter(details.images, {
        includeInSlider: true
      }));

      // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
      // Current version of PhantomJS is missing not supporting .bind
      // https://github.com/ariya/phantomjs/issues/10522
      // TODO: Update PhantomJS
      $scope.openGallery = function(slideIndex) {
        modalService.openGallery(
          contentService.getLightBoxContent(details.images),
          slideIndex
        );
      };

      // Preview content
      $scope.previewImages = contentService.getLightBoxContent(
        details.images, 300, 150, 'fill');
    }

    //Scroll to rooms straight away if user comes from booking bar
    var scrollToValue = $location.search().scrollTo || null;
    if (scrollToValue && scrollToValue === 'jsRooms') {
      $timeout(function() {
        var offset = stateService.isMobile() ? -50 : 20;
        scrollService.scrollTo(scrollToValue, offset);
      }, 1500).then(function() {
        //Set scrollTo value to null so page doesn't scroll to rooms if user doesn't come from booking bar
        if (Settings.UI.hotelDetails.removeScrollToRoomsOnFinish) {
          $timeout(function() {
            $location.search('scrollTo', null);
          }, 1500);
        }
      });
    }
    else {
      $timeout(function() {
        scrollService.scrollTo('top');
      }, 0);
    }
  });

  function getHotelDetails(propertyCode, params) {
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;

        //If dates are selected
        if(showAltProperties && bookingParams && bookingParams.from && bookingParams.to){
          var allAltProperties = $scope.details.alternateProperties;

          $scope.altProperties = _.reject(allAltProperties, function(altProperty){
            return altProperty.available === false;
          });
        }

        if($scope.config.bookingStatistics && $scope.config.bookingStatistics.display && $scope.details.statistics){
          $timeout(function(){
            $scope.$broadcast('STATS_GROWL_ALERT', $scope.details.statistics);
          });
        }

        //Gp to error page if response is empty
        if (_.isEmpty($scope.details)) {
          $state.go('error');
        }

        //Set meta content
        if ($scope.details && $scope.details.meta) {
          metaInformationService.setMetaDescription($scope.details.meta.description);
          metaInformationService.setMetaKeywords($scope.details.meta.keywords);
          metaInformationService.setPageTitle($scope.details.meta.pagetitle);

          $scope.details.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
          metaInformationService.setOgGraph($scope.details.meta.microdata.og);
        }

        if ($scope.details && $scope.details.description) {
          $scope.details.description = ('' + $scope.details.description);
          var firstParaEnd = $scope.details.description.indexOf('</p>');
          var firstBr = $scope.details.description.indexOf('<br>');
          firstParaEnd = Math.max(firstParaEnd, 0);
          firstBr = Math.max(firstBr, 0);
          var shortDescLength = (firstBr > 0 && firstParaEnd > 0) ? Math.min(firstBr, firstParaEnd) : Math.max(firstBr, firstParaEnd);
          $scope.details.shortenedDescription = $scope.details.description.substr(0, shortDescLength > 0 ? ($scope.details.description.indexOf('>', shortDescLength) + 1) : SHORT_DESCRIPTION_LENGTH);
          $scope.details.hasViewMore = $scope.details.shortenedDescription.length < $scope.details.description.length;
        }

        //Breadcrumbs
        breadcrumbsService.clear();

        if ($scope.config.breadcrumbs.hotels) {
          breadcrumbsService.addBreadCrumb('Hotels', 'hotels');
        }

        if ($scope.config.breadcrumbs.location && $stateParams.regionSlug && $stateParams.locationSlug) {
          //Get property region/location data for breadcrumbs
          propertyService.getPropertyRegionData(details.locationCode).then(function(data) {
            breadcrumbsService
              .addBreadCrumb(data.region.nameShort, 'regions', {
                regionSlug: $stateParams.regionSlug,
                property: null
              })
              .addBreadCrumb(data.location.nameShort, 'hotels', {
                regionSlug: $stateParams.regionSlug,
                locationSlug: $stateParams.locationSlug,
                property: null
              })
              .addBreadCrumb(details.nameShort);
          });
        } else {
          breadcrumbsService.addBreadCrumb(details.nameShort);
        }

        if($scope.details.content){
          _.each($scope.details.content, function(item){
            if(item.meta){
              item.url = getContentUrl(item);
            }
          });
        }

        breadcrumbsService
          .addHref('About', 'jsAbout')
          .addHref('Rooms', 'jsRooms')
          .addHref('Location', 'jsLocation')
          .addHref('Offers', 'jsOffers')
          .addHref('Gallery', 'fnOpenHotelLightBox');

        if (details.hasOwnProperty('available')) {
          roomsPromise.then(function() {
            $scope.availableRooms = [];
            $window._.forEach((details.availability && details.availability.rooms) || [], function(availableRoom) {
              var room = $window._.find($scope.rooms, {
                code: availableRoom.code
              });
              if (room) {
                room = $window._.extend(room, availableRoom);
                $scope.availableRooms.push(room.code);
              }
            });
            $scope.ratesLoaded = true;
            $scope.filterCompareRooms();

            if ($scope.availableRooms.length === 0) {
              //If show alternative dates is enabled
              if((!$scope.altProperties || !$scope.altProperties.length) && showAltDates && bookingParams && bookingParams.from && bookingParams.to){
                var flexiRange = $scope.roomsConfig.alternativeDisplays.dates.flexiRange || 3;
                $scope.lengthOfStay = $window.moment(bookingParams.to).diff($window.moment(bookingParams.from), 'days');
                var fromDate = $window.moment(bookingParams.from).subtract(flexiRange, 'day');
                var toDate = $window.moment(bookingParams.from).add(flexiRange, 'day');

                var params = angular.copy(bookingParams);
                params.from = fromDate.format('YYYY-MM-DD');
                params.to = toDate.format('YYYY-MM-DD');
                params.lengthOfStay = $scope.lengthOfStay;
                delete params.propertySlug;
                delete params.propertyCode;
                delete params.includes;

                //Get our flexi alt dates
                propertyService.getAvailabilityOverview(propertyCode, params).then(function(availabilities){
                  $scope.altRoomDates = availabilities;
                  $scope.altRoomDatesAvailable = _.reject(availabilities, function(availability){
                    return !availability.fullyAvailable;
                  });
                });
              }

              $rootScope.$broadcast('floatingBarEvent', {
                isCollapsed: false
              });
            }
          });
        } else {
          $scope.ratesLoaded = true;
        }

        var offersParams = $window._.extend({}, bookingParams);
        delete offersParams.promoCode;
        delete offersParams.corpCode;
        delete offersParams.groupCode;

        if(!$scope.fromMeta)
        {
          setPropertyOffersUrl();
          contentService.getOffers().then(function(response) {
            response = _.filter(response, function(offer, index) {
              var availability = _.find(offer.offerAvailability, function(availability) {
                return availability.property === propertyCode;
              });
              response[index].availability = availability && availability.showOnHotelPage ? availability : null;
              return availability && availability.showOnHotelPage;
            });
            $scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
            _.each($scope.offersList, function(offer) {
              offer.url = getOfferUrl(offer);
            });
            if (!$scope.offersList || $window._.isEmpty($scope.offersList)) {
              breadcrumbsService.removeHref('Offers');
            } else {
              var scrollToValue = $location.search().scrollTo || null;
              if (scrollToValue && scrollToValue === 'jsOffers') {
                $timeout(function() {
                  scrollService.scrollTo(scrollToValue, 20);
                }, 500);
              }
            }

          });
        }
        else {
          breadcrumbsService.removeHref('Offers');
        }
        //$scope.scrollToBreadcrumbs();

      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms) {

        //handle displaying of rates
        _.each(rooms, function(room) {
          room.userHidden = false;
          if (stateService.isMobile() || Settings.UI.hotelDetails.rooms.displayRatesOnLoad) {
            $scope.displayRoomRates(room);
          } else {
            room._displayRates = false;
          }
        });

        $scope.rooms = rooms;
        $scope.filteredCompareRooms = rooms;

        $scope.numberOfRoomsDisplayed = Settings.UI.hotelDetails.defaultNumberOfRooms;
        $scope.numberOfAmenities = Settings.UI.hotelDetails.rooms.defaultNumberOfAmenities;
        $scope.viewRatesButtonText = Settings.UI.hotelDetails.rooms.viewRatesButtonText;
        $scope.hoverTriggerDelay = Settings.UI.hotelDetails.rooms.hoverTriggerDelay;

        $scope.openRoomGallery = function(room, slideIndex) {
          modalService.openGallery(
            contentService.getLightBoxContent(angular.fromJson(room).images),
            slideIndex,
            false
          );
        };
      });

    preloaderFactory($q.all([detailPromise, roomsPromise]).then(function() {
      //scroll to element if set in url scrollTo param
      var scrollToValue = $location.search().scrollTo || null;
      if (scrollToValue && scrollToValue !== 'jsOffers' && scrollToValue !== 'fnOpenLightBox' && scrollToValue !== 'jsRooms') {
        $timeout(function() {
          scrollService.scrollTo(scrollToValue, 20);
        }, 500);
      } else if (scrollToValue && scrollToValue === 'fnOpenLightBox') {
        modalService.openGallery(
          contentService.getLightBoxContent($scope.details.images),
          0
        );
        $location.search('scrollTo', null);
      }
    }));
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if (bookingParams.productGroupId) {
    getHotelDetails(propertyCode, bookingParams);
  } else {
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp) {
      if (brp) {
        bookingParams.productGroupId = brp.id;
      }

      getHotelDetails(propertyCode, bookingParams);
    });
  }

  $scope.scrollToRooms = function() {
    $timeout(function() {
      scrollService.scrollTo('#jsRooms', -20);
    }, 0);
  };

  $scope.getRoomUrl = function(pSlug, rSlug, viewAllRates) {
    viewAllRates = viewAllRates ? '1' : null;
    if ($stateParams.promoCode) {
      return $state.href('room', {
        regionSlug: $stateParams.regionSlug,
        locationSlug: $stateParams.locationSlug,
        propertySlug: pSlug,
        roomSlug: rSlug,
        promoCode: $stateParams.promoCode,
        viewAllRates: viewAllRates,
        scrollTo: 'hotel-room'
      });
    } else {
      return $state.href('room', {
        regionSlug: $stateParams.regionSlug,
        locationSlug: $stateParams.locationSlug,
        propertySlug: pSlug,
        roomSlug: rSlug,
        viewAllRates: viewAllRates,
        scrollTo: 'hotel-room'
      });
    }
  };

  $scope.goToRoom = function(pSlug, rSlug, viewAllRates) {
    viewAllRates = viewAllRates ? '1' : null;
    if ($stateParams.promoCode) {
      $state.go('room', {
        regionSlug: $stateParams.regionSlug,
        locationSlug: $stateParams.locationSlug,
        propertySlug: pSlug,
        roomSlug: rSlug,
        promoCode: $stateParams.promoCode,
        viewAllRates: viewAllRates,
        scrollTo: 'hotel-room'
      });
    } else {
      $state.go('room', {
        regionSlug: $stateParams.regionSlug,
        locationSlug: $stateParams.locationSlug,
        propertySlug: pSlug,
        roomSlug: rSlug,
        viewAllRates: viewAllRates,
        scrollTo: 'hotel-room'
      });
    }
  };

  $scope.getAbsUrl = function() {
    return $location.absUrl().split('?')[0];
  };

  $scope.goToInfo = function(property, infoSlug) {
    var paramsData = {
      'property': property
    };
    var stateParams = {
      'infoSlug': infoSlug
    };
    routerService.buildStateParams('hotelInfo', paramsData).then(function(params) {
      stateParams = _.extend(stateParams, params);
      $state.go('hotelInfo', stateParams, {
        reload: true
      });
    });
  };

  $scope.isOverAdultsCapacity = bookingService.isOverAdultsCapacity;
  $scope.switchToMRBMode = bookingService.switchToMRBMode;

  $scope.displayRoomRates = function(room, ratesScrollTarget) {
    if (!room || room._displayRates || $scope.availableRooms && $scope.availableRooms.indexOf(room.code) === -1) {
      return;
    }
    room._displayRates = true;

    if (ratesScrollTarget) {
      scrollToRates(ratesScrollTarget);
    }
  };

  $scope.displayAllRooms = function() {
    $scope.numberOfRoomsDisplayed = $scope.rooms.length;
  };

  $scope.displayMoreRooms = function() {
    $scope.numberOfRoomsDisplayed += Settings.UI.hotelDetails.numberOfRoomsAddedOnMobile || 1;
  };

  $scope.hasDates = function() {
    return bookingService.APIParamsHasDates();
  };

  $scope.getCheckinDate = function() {
    return $window.moment(bookingService.getAPIParams().from).format(Settings.UI.generics.longDateFormat ? Settings.UI.generics.longDateFormat : 'Do MMM YYYY');
  };

  $scope.getCheckoutDate = function() {
    return $window.moment(bookingService.getAPIParams().to).format(Settings.UI.generics.longDateFormat ? Settings.UI.generics.longDateFormat : 'Do MMM YYYY');
  };

  $scope.selectDates = function() {
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
      openBookingTab: true,
      openDatePicker: true,
      promoCode: $stateParams.promoCode || null,
      corpCode: $stateParams.corpCode || null,
      groupCode: $stateParams.groupCode || null
    });
  };

  $scope.roomsDisplayFilter = function(room) {
    if (!$scope.hasDates()) {
      return true;
    }
    return !$scope.roomsConfig.hideRoomsWithNoAvailability || ($scope.roomsConfig.hideRoomsWithNoAvailability && $scope.availableRooms && $scope.availableRooms.indexOf(room.code) > -1 && room.priceFrom && $scope.hasDates() && $scope.ratesLoaded);
  };

  $scope.setRoomsViewMode = function(mode){
    $scope.roomsViewMode = mode;
    userPreferenceService.setCookie('roomsViewMode', mode);
  };

  //If room view type is stored in cookie, display this
  if (mobiusUserPreferences && mobiusUserPreferences.roomsViewMode) {
    $scope.setRoomsViewMode(mobiusUserPreferences.roomsViewMode);
  }
  //Otherwise display the default type if one is set, if not display as list
  else {
    $scope.setRoomsViewMode(defaultRoomsViewMode ? defaultRoomsViewMode : 'list');
  }

  $scope.hideRoom = function(room){
    room.userHidden = true;
    $scope.filterCompareRooms();
    $scope.showCompareRoomsReset = true;
    //If number of filtered rooms is equal to the current carousel index (i.e. we are at the end of the carousel), move carousel back to show previous page
    if($scope.filteredCompareRooms.length === $scope.comparisonIndex){
      $scope.comparisonIndex -= 3;
      if($scope.comparisonIndex < 0){
        $scope.comparisonIndex = 0;
      }
    }
  };

  $scope.resetCompareRooms = function(){
    $scope.filteredCompareRooms = $scope.rooms;
    _.each($scope.filteredCompareRooms, function(room) {
      room.userHidden = false;
    });
    $scope.filterCompareRooms();
    $scope.showCompareRoomsReset = false;
  };

  $scope.shiftRoomCarousel = function(forward){
    if(forward){
      $scope.comparisonIndex++;
    }
    else {
      $scope.comparisonIndex--;
    }
  };

  $scope.filterCompareRooms = function(){
    $scope.filteredCompareRooms = $filter('filter')($scope.filteredCompareRooms, {userHidden:false});
    $scope.filteredCompareRooms = _.filter($scope.filteredCompareRooms, function(room){
      return $scope.roomsDisplayFilter(room);
    });
  };

  $scope.roomClick = function(room){
    if($scope.config.rooms.roomsAsLinks && $stateParams.dates){
      $scope.goToRoom($scope.details.meta.slug, room.meta.slug);
    }
  };

  function scrollToRates(target) {
    $timeout(function() {
      scrollService.scrollTo(target, 20);
    }, 100);
  }

  function setPropertyOffersUrl() {
    var paramsData = {
      'property': $scope.details
    };
    var toState = $scope.config.offers.toState;

    if(Settings.newUrlStructure){
      routerService.buildStateParams(toState, paramsData).then(function(params) {
        $scope.propertyOffersHref = $state.href(toState, params, {
          reload: true
        });
      });
    }
    else {
      $scope.propertyOffersHref = $state.href(toState, {'propertySlug':$stateParams.propertySlug}, {
        reload: true
      });
    }
  }

  function getContentUrl(item) {
    var stateParams = {
      'infoSlug': item.meta.slug,
      'locationSlug': $stateParams.locationSlug,
      'propertySlug': $scope.details.meta.slug,
      'regionSlug': $stateParams.regionSlug
    };
    return $state.href('hotelInfo', stateParams, {
      reload: true
    });
  }

  function getOfferUrl(offer) {
    var stateParams = {
      'code': offer.availability && offer.availability.slug && offer.availability.slug !== '' ? offer.availability.slug : offer.meta.slug,
      'regionSlug': $stateParams.regionSlug,
      'locationSlug': $stateParams.locationSlug,
      'propertySlug': $scope.details.meta.slug
    };

    return $state.href($scope.config.offers.toState, stateParams);
  }

});
