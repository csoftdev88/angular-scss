'use strict';
/*
*  Controller for room details page
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, $stateParams,
  bookingService, propertyService, filtersService) {

  var bookingParams = bookingService.getAPIParams();

  var propertyCode = bookingParams.property;
  delete bookingParams.property;

  var roomCode = $stateParams.roomID;

  // Getting room details
  propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
    console.log(data, 'roomDetails');
  });

  // Room product details
  function getRoomProductDetails(propertyCode, roomCode, params){
    propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
      $scope.details = data;

      console.log(data, 'room products');
    });
  }

  if(bookingParams.productGroupId){
    getRoomProductDetails(propertyCode, roomCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getRoomProductDetails(propertyCode, roomCode, bookingParams);
    });
  }
});
