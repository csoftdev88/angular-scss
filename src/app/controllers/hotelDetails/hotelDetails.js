'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService, filtersService, preloaderFactory) {

  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.property;
  delete bookingParams.property;

  function getAvailableRooms(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var promise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        debugger;
        $scope.details = details;
        // Updating Hero content images
        if(details.previewImages){
          var heroContent =  details.previewImages.map(function(src){
            return {'image': src};
          });

          $scope.updateHeroContent(heroContent);

          if(angular.isDefined(details.lat) && angular.isDefined(details.long)){
            $scope.position = [details.lat, details.long];
          }
        }
      });

    preloaderFactory(promise);
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if(bookingParams.productGroupId){
    getAvailableRooms(propertyCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getAvailableRooms(propertyCode, bookingParams);
    });
  }
});
