'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log, queryService) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_LOGIN = 'LoginCtrl',
      CONTROLLER_REGISTER = 'RegisterCtrl',
      CONTROLLER_ADVANCED_OPTIONS = 'AdvancedOptionsCtrl',
      CONTROLLER_RESERVATIONS = 'ModalReservationCtrl';
  var DIALOG_PARAM_NAME = 'dialog';

  function openDialog(dialogName, templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller };

    // Merge required and arbitrary options together
    angular.extend(modalOptions, options);

    $modal.open(modalOptions).result.then(function() {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog closed');
      q.resolve();
    }, function() {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog dismissed');
      q.reject();
    });

    queryService.setValue(DIALOG_PARAM_NAME, dialogName);

    return q.promise;
  }

  function openLoginDialog(){
    return openDialog('LoginDialog', 'layouts/modals/loginDialog.html', CONTROLLER_LOGIN);
  }

  function openRegisterDialog(){
    return openDialog('RegisterDialog', 'layouts/modals/registerDialog.html', CONTROLLER_REGISTER);
  }

  function openPasswordResetDialog(){
    return openDialog('PasswordResetDialog', 'layouts/modals/passwordResetDialog.html', CONTROLLER_LOGIN);
  }

  function openEnterCodeDialog(){
    return openDialog('EnterCodeDialog', 'layouts/modals/enterCodeDialog.html', CONTROLLER_LOGIN);
  }

  function openAdvancedOptionsDialog(){
    return openDialog('AdvancedOptionsDialog', 'layouts/modals/advancedOptionsDialog.html', CONTROLLER_ADVANCED_OPTIONS);
  }

  // Accepting reservation data to be rendered in modal window
  function openCancelReservationDialog(reservation){
    return openDialog('CancelReservationDialog', 'layouts/modals/cancelReservationDialog.html', CONTROLLER_RESERVATIONS, {
      windowClass: 'is-wide has-white-bg',
      resolve: {reservation: function(){return reservation;}}
    });
  }

  function openCCVInfo(){
    return openDialog('CCVInfo', 'layouts/modals/ccvInfo.html', CONTROLLER_DEFAULT);
  }

  function openPoliciesInfo(){
    return openDialog('PoliciesInfo', 'layouts/modals/policiesInfo.html', CONTROLLER_DEFAULT, {
      windowClass: 'is-wide'
    });
  }

  function openPriceBreakdownInfo(){
    return openDialog('PriceBreakdownInfo', 'layouts/modals/priceBreakdownInfo.html', CONTROLLER_DEFAULT), {
      windowClass: 'is-wide'
    };
  }

  function openDialogIfPresent() {
    var dialogName = queryService.getValue(DIALOG_PARAM_NAME);
    switch (dialogName) {
    case '':
    case undefined:
      // do nothing
      break;
    case 'LoginDialog':
      return openLoginDialog();
    case 'RegisterDialog':
      return openRegisterDialog();
    case 'PasswordResetDialog':
      return openPasswordResetDialog();
    case 'EnterCodeDialog':
      return openEnterCodeDialog();
    case 'AdvancedOptionsDialog':
      return openAdvancedOptionsDialog();
    case 'CancelReservationDialog':
      return openCancelReservationDialog();
    case 'CCVInfo':
      return openCCVInfo();
    case 'PoliciesInfo':
      return openPoliciesInfo();
    case 'PriceBreakdownInfo':
      return openPriceBreakdownInfo();
    default:
      throw new Error('Unknown dialog "' + dialogName + '"');
    }
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
    openPriceBreakdownInfo: openPriceBreakdownInfo,
    openDialogIfPresent: openDialogIfPresent
  };

});
