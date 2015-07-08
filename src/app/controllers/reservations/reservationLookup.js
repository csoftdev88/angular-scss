'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.reservationLookup', [])

  .controller('ReservationLookupCtrl', function($scope, $controller, chainService, Settings,
    breadcrumbsService, modalService /*, formsService */){

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Reservation Lookup');

    // $scope.formData = angular.copy(formDataCopy);

    //get contact information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
    });

    //get form structure and default field values
    /*formsService.getContactForm().then(function(response) {
      if(response) {
        $scope.formData.fields.subject = response.schema.subject.default;
      }
    });*/

    $scope.sendForm = function(){
      $scope.form.$submitted = true;

      if ($scope.form.$valid) {
        console.log('Reservation Lookup form sent');
        modalService.openReservationLookupLoginDialog();
      } else {
        console.log('Reservation Lookup form was not sent');
        modalService.openReservationLookupFailedDialog();
      }
    };
  });
