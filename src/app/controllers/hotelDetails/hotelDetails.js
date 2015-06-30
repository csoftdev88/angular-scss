'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService,
  $window, advertsService) {

  var SHORT_DESCRIPTION_LENGTH = 200;
  var NUMBER_OF_OFFERS = 3;
  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.propertyCode;

  function scrollTo(hash) {
    $window._.defer(function () {
      var $item = angular.element('#' + hash);
      if($item.length) {
        angular.element('html, body').animate({
          scrollTop: $item.offset().top
        }, 300);
      }
    });
  }

  function getHotelDetails(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;

        $scope.details.description = ('' + $scope.details.description);
        $scope.details.descriptionShort = $scope.details.description.substr(0, SHORT_DESCRIPTION_LENGTH);
        $scope.details.hasViewMore = $scope.details.descriptionShort.length < $scope.details.description.length;
        if ($scope.details.hasViewMore) {
          $scope.details.descriptionShort += '…';
        }

        breadcrumbsService.addBreadCrumb(details.nameShort);
        breadcrumbsService
          .addHref('About', 'jsAbout')
          .addHref('Location', 'jsLocation')
          .addHref('Offers', 'jsOffers')
          .addHref('Rooms', 'jsRooms');

        // Updating Hero content images
        if(details.images){
          $scope.updateHeroContent($window._.filter(details.images, {includeInSlider: true}));


          // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
          // Current version of PhantomJS is missing not supporting .bind
          // https://github.com/ariya/phantomjs/issues/10522
          // TODO: Update PhantomJS
          $scope.openGallery = function(){
            modalService.openGallery(
              details.images.map(function(image){return image.uri;}));
          };
        }

        if(details.availability) {
          $scope.rooms = details.availability.rooms || [];
        }

        contentService.getOffers(bookingParams).then(function(response) {
          $scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
          if(!$scope.offersList || $window._.isEmpty($scope.offersList)) {
            breadcrumbsService.removeHref('Offers');
          }
        });
      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        if(!$scope.rooms) {
          $scope.rooms = rooms;
        }
      });

    preloaderFactory($q.all([detailPromise, roomsPromise]).then(function() {
      var hash = $window.location.hash;
      if (hash) {
        scrollTo(hash.substr(1));
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
    scrollTo('jsRooms');
  };

  $scope.advertClick = advertsService.advertClick;
});
