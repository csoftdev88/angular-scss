'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log, queryService) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_DATA = 'ModalDataCtrl',
      CONTROLLER_LOGIN = 'LoginCtrl',
      CONTROLLER_REGISTER = 'RegisterCtrl',
      CONTROLLER_ADVANCED_OPTIONS = 'AdvancedOptionsCtrl',
      CONTROLLER_RESERVATIONS = 'ModalReservationCtrl',
      CONTROLLER_POLICY = 'PolicyCtrl',
      CONTROLLER_LOYALTIES = 'LoyaltiesCtrl',
      DIALOG_PARAM_NAME = 'dialog';

  function openDialog(dialogName, templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller };

    // Merge required and arbitrary options together
    angular.extend(modalOptions, options);

    $modal.open(modalOptions).result.then(function(data) {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog closed');
      q.resolve(data);
    }, function(reason) {
      queryService.removeParam(DIALOG_PARAM_NAME);
      $log.info('Dialog dismissed');
      q.reject(reason);
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

  function openAdvancedOptionsDialog(data){
    return openDialog('AdvancedOptionsDialog',
      'layouts/modals/advancedOptionsDialog.html',
      CONTROLLER_ADVANCED_OPTIONS,
      {resolve: {data: function(){return data || {};}}}
    );
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

  function openPoliciesInfo(product){
    return openDialog('PoliciesInfo', 'layouts/modals/policiesInfo.html', CONTROLLER_POLICY, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return product;
        }
      }
    });
  }

  function openPriceBreakdownInfo(roomDetails, product){
    return openDialog('PriceBreakdownInfo', 'layouts/modals/priceBreakdownInfo.html', CONTROLLER_DATA, {
      windowClass: 'is-wide',
      resolve: {
        data: function(){
          return {
            roomDetails: roomDetails,
            product: product
          };
        }
      }
    });
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
      // NOTE: Commenting this out. Logic must be reviewed
      //throw new Error('Unknown dialog "' + dialogName + '"');
    }
  }

  function openBadgesDialog(badges){
    return openDialog('Badges', 'layouts/modals/loyalties/badges.html', CONTROLLER_LOYALTIES, {
      windowClass: 'dialog-badges',
      resolve: {
        data: function(){
          return badges;
        }
      }
    });
  }

  function openLoyaltiesDialog(badges){
    return openDialog('Loyalties', 'layouts/modals/loyalties/loyalties.html', CONTROLLER_LOYALTIES, {
      windowClass: 'dialog-loyalties',
      resolve: {
        data: function(){
          return badges;
        }
      }
    });
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
    openDialogIfPresent: openDialogIfPresent,
    // Loyalties
    openBadgesDialog: openBadgesDialog,
    openLoyaltiesDialog: openLoyaltiesDialog
  };

});
