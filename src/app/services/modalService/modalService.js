'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_LOGIN = 'LoginCtrl',
      CONTROLLER_REGISTER = 'RegisterCtrl',
      CONTROLLER_ADVANCED_OPTIONS = 'AdvancedOptionsCtrl',
      CONTROLLER_RESERVATIONS = 'ModalReservationCtrl';

  function openDialog(templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller };

    // Merge required and arbitrary options together
    angular.extend(modalOptions, options);

    $modal.open(modalOptions).result.then(function(data) {
      $log.info('Dialog closed');
      q.resolve(data);
    }, function(reason) {
      $log.info('Dialog dismissed');
      q.reject(reason);
    });

    return q.promise;
  }

  function openLoginDialog(){
    return openDialog('layouts/modals/loginDialog.html', CONTROLLER_LOGIN);
  }

  function openRegisterDialog(){
    return openDialog('layouts/modals/registerDialog.html', CONTROLLER_REGISTER);
  }

  function openPasswordResetDialog(){
    return openDialog('layouts/modals/passwordResetDialog.html', CONTROLLER_LOGIN);
  }

  function openEnterCodeDialog(){
    return openDialog('layouts/modals/enterCodeDialog.html', CONTROLLER_LOGIN);
  }

  function openAdvancedOptionsDialog(){
    return openDialog('layouts/modals/advancedOptionsDialog.html', CONTROLLER_ADVANCED_OPTIONS);
  }

  // Accepting reservation data to be rendered in modal window
  function openCancelReservationDialog(reservation){
    return openDialog('layouts/modals/cancelReservationDialog.html', CONTROLLER_RESERVATIONS, {
      windowClass: 'is-wide has-white-bg',
      resolve: {reservation: function(){return reservation;}}
    });
  }

  function openCCVInfo(){
    return openDialog('layouts/modals/ccvInfo.html', CONTROLLER_DEFAULT);
  }

  function openPoliciesInfo(){
    return openDialog('layouts/modals/policiesInfo.html', CONTROLLER_DEFAULT, {
      windowClass: 'is-wide'
    });
  }

  function openPriceBreakdownInfo(){
    return openDialog('layouts/modals/priceBreakdownInfo.html', CONTROLLER_DEFAULT), {
      windowClass: 'is-wide'
    };
  }

  // Public methods
  return {
    openLoginDialog: openLoginDialog,
    openRegisterDialog: openRegisterDialog,
    openPasswordResetDialog: openPasswordResetDialog,
    openEnterCodeDialog: openEnterCodeDialog,
    openAdvancedOptionsDialog: openAdvancedOptionsDialog,
    openCancelReservationDialog: openCancelReservationDialog,
    openCCVInfo: openCCVInfo,
    openPoliciesInfo: openPoliciesInfo,
    openPriceBreakdownInfo: openPriceBreakdownInfo
  };

});
