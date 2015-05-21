'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService) {
  var bookingParams = bookingService.getAPIParams();
  var propertyCode = bookingParams.productGroupId;
  delete bookingParams.productGroupId;

  // Loading the rooms
  propertyService.getPropertyDetails(propertyCode, bookingParams).then(function(details){
    $scope.details = details;
    console.log(details);
  });
});
