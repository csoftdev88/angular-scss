'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.reservationLookup', [])

  .controller('ReservationLookupCtrl', function($scope, $controller, $state,
    chainService, Settings, breadcrumbsService, modalService, reservationService, $rootScope, $timeout){

    //$controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Reservation Lookup');

    // Hide the floating bar on entry if meandall tenant
    if (Settings.UI.lookUp && Settings.UI.lookUp.hideFloatingBarOnEntry) {
        $timeout(function() {
            $rootScope.$broadcast('floatingBarEvent', {
                isCollapsed: true
            });
        });
    }

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
          reservationCode: data.reservationCode,
          showActionButtons: false
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
