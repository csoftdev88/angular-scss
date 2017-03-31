'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.reservationLookup', [])

  .controller('ReservationLookupCtrl', function($scope, $controller, $state,
    chainService, Settings, breadcrumbsService, modalService, reservationService){

    //$controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Reservation Lookup');

    $scope.formData = {};
    $scope.config = Settings.UI.lookUp;

    //get contact information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
    });
    

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
