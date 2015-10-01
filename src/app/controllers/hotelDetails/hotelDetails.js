'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [
  'mobiusApp.filters.cloudinaryImage'
])

.controller( 'HotelDetailsCtrl', function($scope, $filter, _, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService, metaInformationService,
  $window, advertsService, $controller, $timeout, scrollService, $location, $stateParams, Settings, stateService) {

  $controller('PriceCtr', {$scope: $scope});
  // Used for rate notification message
  $controller('RatesCtrl', {$scope: $scope});

  var SHORT_DESCRIPTION_LENGTH = 200;
  var NUMBER_OF_OFFERS = 3;
  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  // Sorting options
  $scope.sortingOptions = [
    {
      name: 'Price - Low to High',
      sort: function(room){
        return room.priceFrom;
      }
    },
    {
      name: 'Price - High to Low',
      sort: function(room){
        return 0 - room.priceFrom;
      }
    }
  ];

  $scope.currentOrder = $scope.sortingOptions[0];

  $scope.partials = [
      'layouts/hotels/detailPartial/hotelInfo.html',
      'layouts/hotels/detailPartial/hotelRooms.html',
      'layouts/hotels/detailPartial/hotelServices.html',
      'layouts/hotels/detailPartial/hotelLocation.html',
      'layouts/hotels/detailPartial/hotelOffers.html'
    ];

  var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);

  if(!propertyCode){
    $state.go('hotels');
    return;
  }

  $scope.scroll = 0;

  $scope.scrollToBreadcrumbs = function(){
    $timeout(function(){
      scrollService.scrollTo();
    }, 0);
  };

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
          });
        }

        var offersParams = $window._.extend({}, bookingParams);
        delete offersParams.promoCode;
        delete offersParams.corpCode;
        delete offersParams.groupCode;
        contentService.getOffers(offersParams).then(function(response) {
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

        $scope.scrollToBreadcrumbs();

      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        if(stateService.isMobile()){
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
      });

    preloaderFactory($q.all([detailPromise, roomsPromise]).then(function() {
      //scroll to element if set in url scrollTo param
      var scrollToValue = $location.search().scrollTo || null;
      if (scrollToValue && scrollToValue !== 'jsOffers' && scrollToValue !== 'fnOpenLightBox') {
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

  $scope.goToRoom = function(pSlug, rSlug) {
    if($stateParams.promoCode){
      $state.go('room', {propertySlug: pSlug, roomSlug: rSlug, promoCode: $stateParams.promoCode});
    }
    else{
      $state.go('room', {propertySlug: pSlug, roomSlug: rSlug});
    }

  };

  $scope.getAbsUrl = function(){
    return $location.absUrl().split('?')[0];
  };

  $scope.advertClick = advertsService.advertClick;

  $scope.isOverAdultsCapacity = bookingService.isOverAdultsCapacity;
  $scope.switchToMRBMode = bookingService.switchToMRBMode;

  $scope.displayRoomRates = function(room){
    if(!room || room._displayRates || $scope.availableRooms.indexOf(room.code) === -1 && !room.priceFrom){
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
});
