'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService, $state,
  propertyService, filtersService, preloaderFactory, $q, modalService,
  breadcrumbsService, $window) {

  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.property;
  delete bookingParams.property;

  function getHotelDetails(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;
        breadcrumbsService.addBreadCrumb(details.nameShort);
        breadcrumbsService
          .addHref('About', 'jsAbout')
          .addHref('Location', 'jsLocation')
          .addHref('Offers', 'jsOffers')
          .addHref('Rooms', 'jsRooms');

        // Updating Hero content images
        if(details.images){
          $scope.updateHeroContent($window._.filter(details.images, {includeInSlider: true}));
        }

        if(details.availability) {
          $scope.rooms = details.availability.rooms || [];
        }

        $scope.openGallery = modalService.openGallery;
      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        if(!$scope.rooms) {
          $scope.rooms = rooms;
        }
      });

    preloaderFactory($q.all([detailPromise, roomsPromise]));
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
    var $item = angular.element('#jsRooms');
    angular.element('html, body').animate({
      scrollTop: $item.offset().top
    }, 300);
  };
});
