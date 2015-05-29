'use strict';
/*
*  Controller for room details page
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, $stateParams,
  bookingService, propertyService) {

  var bookingParams = bookingService.getAPIParams();

  var propertyId = bookingParams.property;
  delete bookingParams.property;

  var roomId = $stateParams.roomID;

  $scope = $scope;

  // Getting room details
  propertyService.getRoomDetails(propertyId, roomId).then(function(data){
    console.log(data, 'roomDetails');
  });
});
