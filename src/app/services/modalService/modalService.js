'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log) {
  var CONTROLLER_DEFAULT = 'ModalCtrl',
      CONTROLLER_LOGIN_REGISTER = 'LoginRegisterCtrl',
      CONTROLLER_ADVANCED_OPTIONS = 'AdvancedOptionsCtrl';

  function openDialog(templateUrl, controller, options){
    var q = $q.defer(),
        modalOptions = { templateUrl: templateUrl, controller: controller };

    angular.extend(modalOptions, options);

    $modal.open(modalOptions).result.then(function() {
      $log.info('Dialog closed');
      q.resolve();
    }, function() {
      $log.info('Dialog dismissed');
      q.reject();
    });

    return q.promise;
  }

  function openLoginDialog(){
    return openDialog('layouts/modals/loginDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openRegisterDialog(){
    return openDialog('layouts/modals/registerDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openPasswordResetDialog(){
    return openDialog('layouts/modals/passwordResetDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openEnterCodeDialog(){
    return openDialog('layouts/modals/enterCodeDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openAdvancedOptionsDialog(){
    return openDialog('layouts/modals/advancedOptionsDialog.html', CONTROLLER_ADVANCED_OPTIONS);
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
    openCCVInfo: openCCVInfo,
    openPoliciesInfo: openPoliciesInfo,
    openPriceBreakdownInfo: openPriceBreakdownInfo
  };

});
