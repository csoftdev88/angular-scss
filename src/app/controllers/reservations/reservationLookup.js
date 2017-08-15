'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.reservationLookup', [])

  .controller('ReservationLookupCtrl', function($scope, $controller, $state, chainService, Settings,
                                                breadcrumbsService, modalService, reservationService,
                                                $rootScope, $timeout, user, apiService){

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

      var email = $scope.formData.fields.email;

      var headers = apiService.getHeaders();

      // This is a hotfix for the lookup issue
      // The issues is being caused by the api service auth header not being included in
      // sessions that are not 'new'. To get around this we will manually send the email if the user is logged in
      // and the auth header is not available
      if ($scope.auth.isLoggedIn() && !(headers['mobius-authentication'] || headers['keystone-authentication'])) {
        email = user.getUser().email;
      }

      reservationService.find($scope.formData.fields.subject, email).then(function(data){
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
