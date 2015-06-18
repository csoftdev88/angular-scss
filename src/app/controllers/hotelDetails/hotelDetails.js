'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService, filtersService, preloaderFactory, $q) {

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
        // Updating Hero content images
        if(details.previewImages){
          var heroContent =  details.previewImages.map(function(src){
            return {'image': src};
          });

          $scope.updateHeroContent(heroContent);
        }

        if(angular.isDefined(details.lat) && angular.isDefined(details.long)){
          $scope.position = [details.lat, details.long];
        }

        if(details.availability) {
          $scope.rooms = details.availability.rooms || [];
        }
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        debugger;
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
    var $item = angular.element('#hotelRooms');
    angular.element('html, body').animate({
      scrollTop: $item.offset().top
    }, 2000);
  };
});
