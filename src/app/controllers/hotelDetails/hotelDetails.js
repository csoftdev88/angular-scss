'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [
  'mobiusApp.filters.cloudinaryImage'
])

.controller( 'HotelDetailsCtrl', function($scope, $filter, _, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService, metaInformationService,
  $window, advertsService, $controller, $timeout, scrollService, $location, $stateParams, Settings, stateService, $rootScope, userPreferenceService) {

  $controller('PriceCtr', {$scope: $scope});
  // Used for rate notification message
  $controller('RatesCtrl', {$scope: $scope});

  //Apply config:
  $scope.hasViewMore = Settings.UI.viewsSettings.hotelDetails.hasViewMore;
  $scope.hasTitle = Settings.UI.viewsSettings.hotelDetails.hasTitle;
  $scope.roomsConfig = Settings.UI.hotelDetails.rooms;
  $scope.ratesLoaded = false;
  $scope.isFromSearch = $stateParams.fromSearch && $stateParams.fromSearch === '1';
  $scope.showLocalInfo = Settings.UI.hotelDetails.showLocalInfo;
  $scope.headerPartial = Settings.UI.hotelDetails.headerPartial;
  $scope.partials = [];

  //define page partials based on settings
  _.map(Settings.UI.hotelDetails.partials, function(value, key){
    if(value === true){
      var partial = 'layouts/hotels/detailPartial/' + key + '.html';
      $scope.partials.push(partial);
    }
  });


  var SHORT_DESCRIPTION_LENGTH = 200;
  var NUMBER_OF_OFFERS = 3;
  var bookingParams = bookingService.getAPIParams();
  bookingParams = bookingService.updateOfferCode(bookingParams);
  var mobiusUserPreferences = userPreferenceService.getCookie();
  // Include the amenities
  bookingParams.includes = 'amenities';

  // Sorting options
  $scope.initSortingOptions = function(options){
    $scope.sortingOptions = [
      {
        name: options.priceLowToHigh,
        sort: function(room){
          return room.priceFrom;
        }
      },
      {
        name: options.priceHighToLow,
        sort: function(room){
          return 0 - room.priceFrom;
        }
      }
    ];

    if(Settings.UI.hotelDetails.rooms.sortRoomsByWeighting){
      $scope.sortingOptions.splice(0, 0, {
        name: options.recommended,
        sort: function(room){
          return [-room.priceFrom, -room.weighting];
        }
      });
    }

    /*
    USER PREFERENCE SETTINGS
    */
    //order switch default value
    if(mobiusUserPreferences && mobiusUserPreferences.hotelCurrentOrder){
      var index = _.findIndex($scope.sortingOptions, function(option) {
        return option.name === mobiusUserPreferences.hotelCurrentOrder;
      });
      $timeout(function(){
        $scope.currentOrder = $scope.sortingOptions[index !== -1 ? index : 0];
      }, 0);
    }
    else{
      $timeout(function(){
        $scope.currentOrder = $scope.sortingOptions[1];
      }, 0);
    }

    //save order switch value to cookies when changed
    $scope.orderSwitchChange = function(selected){
      userPreferenceService.setCookie('hotelCurrentOrder', selected.name);
    };

  };


  var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);

  if(!propertyCode){
    $state.go('hotels');
    return;
  }

  $scope.scrollToBreadcrumbs = function(){
    $timeout(function(){
      scrollService.scrollTo();
    }, 0);
  };

  //Getting raw property details to display property desc etc...fast
  propertyService.getPropertyDetails(propertyCode).then(function(details){
    $scope.localInfo = details.localInfo;
    $scope.details = details;
    // Updating Hero content images
    if(details.images){
      $scope.updateHeroContent($window._.filter(details.images, {includeInSlider: true}));

      // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
      // Current version of PhantomJS is missing not supporting .bind
      // https://github.com/ariya/phantomjs/issues/10522
      // TODO: Update PhantomJS
      $scope.openGallery = function(slideIndex){
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
      $timeout(function(){
        var offset = stateService.isMobile() ? -50 : 20;
        scrollService.scrollTo(scrollToValue, offset);
      }, 1500).then(function(){
        //Set scrollTo value to null so page doesn't scroll to rooms if user doesn't come from booking bar
        if(Settings.UI.hotelDetails.removeScrollToRoomsOnFinish){
          $timeout(function(){
            $location.search('scrollTo', null);
          }, 1500);
        }
      });
    }
  });

  function getHotelDetails(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;
        metaInformationService.setMetaDescription($scope.details.meta.description);
        metaInformationService.setMetaKeywords($scope.details.meta.keywords);
        metaInformationService.setPageTitle($scope.details.meta.pagetitle);

        $scope.details.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        metaInformationService.setOgGraph($scope.details.meta.microdata.og);

        $scope.details.description = ('' + $scope.details.description);
        var firstParaEnd = $scope.details.description.indexOf('</p>');
        var firstBr = $scope.details.description.indexOf('<br>');
        firstParaEnd = Math.max(firstParaEnd, 0);
        firstBr = Math.max(firstBr, 0);
        var shortDescLength = (firstBr > 0 && firstParaEnd > 0) ? Math.min(firstBr, firstParaEnd) : Math.max(firstBr, firstParaEnd);
        $scope.details.descriptionShort = $scope.details.description.substr(0, shortDescLength > 0 ? ($scope.details.description.indexOf('>', shortDescLength) + 1) : SHORT_DESCRIPTION_LENGTH);
        $scope.details.hasViewMore = $scope.details.descriptionShort.length < $scope.details.description.length;

        breadcrumbsService.clear();
        breadcrumbsService.addBreadCrumb('Hotels', 'hotels').addBreadCrumb(details.nameShort);

        breadcrumbsService
          .addHref('About', 'jsAbout')
          .addHref('Rooms', 'jsRooms')
          .addHref('Location', 'jsLocation')
          .addHref('Offers', 'jsOffers')
          .addHref('Gallery', 'fnOpenHotelLightBox');

        if(details.hasOwnProperty('available')) {
          roomsPromise.then(function() {
            $scope.availableRooms = [];
            $window._.forEach((details.availability && details.availability.rooms) || [], function(availableRoom) {
              var room = $window._.find($scope.rooms, {code: availableRoom.code});
              if(room) {
                room = $window._.extend(room, availableRoom);
                $scope.availableRooms.push(room.code);
              }
            });
            $scope.ratesLoaded = true;
          });
        }
        else{
          $scope.ratesLoaded = true;
        }

        var offersParams = $window._.extend({}, bookingParams);
        delete offersParams.promoCode;
        delete offersParams.corpCode;
        delete offersParams.groupCode;
        contentService.getOffers().then(function(response) {
          response = _.filter(response, function(offer, index){
            var availability = _.find(offer.offerAvailability, function(availability){
              return availability.property === propertyCode;
            });
            response[index].availability =  availability && availability.showOnHotelPage ? availability : null;
            return availability && availability.showOnHotelPage;
          });
          $scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
          if(!$scope.offersList || $window._.isEmpty($scope.offersList)) {
            breadcrumbsService.removeHref('Offers');
          }
          else{
            var scrollToValue = $location.search().scrollTo || null;
            if (scrollToValue && scrollToValue === 'jsOffers') {
              $timeout(function(){
                scrollService.scrollTo(scrollToValue, 20);
              }, 500);
            }
          }

        });

        //$scope.scrollToBreadcrumbs();

      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        if(stateService.isMobile() || Settings.UI.hotelDetails.rooms.displayRatesOnLoad){
          // Marking rates as displayed by default
          _.each(rooms, function(room){
            $scope.displayRoomRates(room);
          });
        }

        $scope.rooms = rooms;

        $scope.numberOfRoomsDisplayed = Settings.UI.hotelDetails.defaultNumberOfRooms;
        $scope.numberOfAmenities = Settings.UI.hotelDetails.rooms.defaultNumberOfAmenities;
        $scope.viewRatesButtonText = Settings.UI.hotelDetails.rooms.viewRatesButtonText;
        $scope.hoverTriggerDelay = Settings.UI.hotelDetails.rooms.hoverTriggerDelay;

        $scope.openRoomGallery = function(room, slideIndex){
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
        $timeout(function(){
          scrollService.scrollTo(scrollToValue, 20);
        }, 500);
      }
      else if(scrollToValue && scrollToValue === 'fnOpenLightBox'){
        $scope.openGallery();
        $location.search('scrollTo', null);
      }
    }));
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if(bookingParams.productGroupId){
    getHotelDetails(propertyCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getHotelDetails(propertyCode, bookingParams);
    });
  }

  $scope.scrollToRooms = function() {
    $timeout(function(){
      scrollService.scrollTo('#jsRooms', -20);
    }, 0);
  };

  $scope.goToRoom = function(pSlug, rSlug, viewAllRates) {
    viewAllRates = viewAllRates ? '1' : null;
    if($stateParams.promoCode){
      $state.go('room', {propertySlug: pSlug, roomSlug: rSlug, promoCode: $stateParams.promoCode, viewAllRates: viewAllRates});
    }
    else{
      $state.go('room', {propertySlug: pSlug, roomSlug: rSlug, viewAllRates: viewAllRates});
    }

  };

  $scope.getAbsUrl = function(){
    return $location.absUrl().split('?')[0];
  };

  $scope.advertClick = function(link){
    $state.go(link.type, {code: link.code, propertySlug: bookingParams.propertySlug});
  };

  $scope.isOverAdultsCapacity = bookingService.isOverAdultsCapacity;
  $scope.switchToMRBMode = bookingService.switchToMRBMode;

  $scope.displayRoomRates = function(room){
    if(!room || room._displayRates || $scope.availableRooms && $scope.availableRooms.indexOf(room.code) === -1 && !room.priceFrom){
      return;
    }

    room._displayRates = true;
  };

  $scope.displayAllRooms = function(){
    $scope.numberOfRoomsDisplayed = $scope.rooms.length;
  };

  $scope.displayMoreRooms = function(){
    $scope.numberOfRoomsDisplayed  += Settings.UI.hotelDetails.numberOfRoomsAddedOnMobile || 1;
  };

  $scope.hasDates = function(){
    return bookingService.APIParamsHasDates();
  };

  $scope.getCheckinDate = function(){
    return $window.moment(bookingService.getAPIParams().from).format('Do MMM YYYY');
  };

  $scope.getCheckoutDate = function(){
    return $window.moment(bookingService.getAPIParams().to).format('Do MMM YYYY');
  };

  $scope.selectDates = function(){
    $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
      openBookingTab: true,
      openDatePicker: true,
      promoCode: $stateParams.promoCode || null,
      corpCode: $stateParams.corpCode || null,
      groupCode: $stateParams.groupCode || null
    });
  };
});
