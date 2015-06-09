'use strict';
/*
*  Generic controller for room details and reservation pages
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, $q, modalService,
  propertyService, filtersService, bookingService) {
  $scope.selectProduct = function(product){
    $scope.selectedProduct = product;
  };

  $scope.setRoomDetails = function(roomDetails){
    $scope.roomDetails = roomDetails;
  };

  $scope.openPoliciesInfo = function(){
    modalService.openPoliciesInfo($scope.selectedProduct);
  };

  $scope.openPriceBreakdownInfo = function(){
    modalService.openPriceBreakdownInfo($scope.roomDetails, $scope.selectedProduct);
  };

  $scope.getRoomData = function(propertyCode, roomCode){
    var q = $q.defer();

    var bookingParams = bookingService.getAPIParams(true);

    // Using PGID from the booking params
    if(bookingParams.productGroupId){
      // TODO:
      //getRoomData();

    } else {
      filtersService.getBestRateProduct().then(function(brp){
        if(brp){
          bookingParams.productGroupId = brp.id;
        }

        getRoomData(propertyCode, roomCode, bookingParams).then(function(data){
          q.resolve(data);
        }, function(err){
          q.reject(err);
        });
      });
    }

    return q.promise;
  };

  function getRoomData(propertyCode, roomCode, bookingParams){
    return $q.all([
      propertyService.getRoomDetails(propertyCode, roomCode),
      propertyService.getRoomProductDetails(propertyCode, roomCode, bookingParams)
    ]);
  }
});
