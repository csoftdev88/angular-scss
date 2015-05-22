'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService, filtersService) {
  var bookingParams = bookingService.getAPIParams();
  var propertyCode = bookingParams.productGroupId;

  delete bookingParams.productGroupId;

  // Getting BRP which is required when asking for availibility
  filtersService.getBestRateProduct().then(function(brp){
    if(brp){
      bookingParams.productGroupId = brp.id;
    }

    // Loading the rooms
    propertyService.getPropertyDetails(propertyCode, bookingParams)
      .then(function(details){
        $scope.details = details;
      });
  });
});
