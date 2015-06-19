'use strict';
/*
*  Generic controller for room details and reservation pages
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, $q, modalService,
  propertyService, filtersService, bookingService) {

  $scope.setRoomDetails = function(roomDetails){
    $scope.roomDetails = roomDetails;
  };

  $scope.openPoliciesInfo = modalService.openPoliciesInfo;
  $scope.openPriceBreakdownInfo = function(product) {
    return modalService.openPriceBreakdownInfo($scope.roomDetails, product);
  };

  $scope.getRoomData = function(propertyCode, roomCode){
    var qBookingParam = $q.defer();
    var qRoomData = $q.defer();

    var bookingParams = bookingService.getAPIParams(true);

    // Using PGID from the booking params
    if(bookingParams.productGroupId){
      qBookingParam.resolve(bookingParams);
    } else {
      filtersService.getBestRateProduct().then(function(brp){
        if(brp){
          bookingParams.productGroupId = brp.id;
        }
        qBookingParam.resolve(bookingParams);
      });
    }

    qBookingParam.promise.then(function(bookingParams) {
      getRoomData(propertyCode, roomCode, bookingParams).then(function(data) {
        qRoomData.resolve({
          roomDetails: data[0],
          roomProductDetails: data[1]
        });
      }, function(err) {
        qRoomData.reject(err);
      });
    });

    return qRoomData.promise;
  };

  function getRoomData(propertyCode, roomCode, bookingParams){
    return $q.all([
      propertyService.getRoomDetails(propertyCode, roomCode),
      propertyService.getRoomProductDetails(propertyCode, roomCode, bookingParams)
    ]);
  }
});
