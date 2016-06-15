'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.reservationLookup', [])

  .controller('ReservationLookupCtrl', function($scope, $controller, $state,
    chainService, Settings, breadcrumbsService, modalService, reservationService){

    console.log('ReservationLookupCtrl');

    //$controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Reservation Lookup');

    console.log('1');

    $scope.formData = {};

    console.log('2');

    //get contact information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
    });

    console.log('3');

    $scope.find = function(){
      $scope.form.$submitted = true;

      if(!$scope.form.$valid) {
        return;
      }

      reservationService.find($scope.formData.fields.subject, $scope.formData.fields.email).then(function(data){
        // Redirecting to reservation details
        var stateParams = {
          reservationCode: data.reservationCode
        };

        if($scope.formData.fields.email){
          stateParams.email = $scope.formData.fields.email;
        }

        $state.go('reservationDetail', stateParams);

      }, function(){
        modalService.openReservationLookupFailedDialog();
      });

    };
  });
