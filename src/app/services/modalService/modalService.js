'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q, $log) {
  var CONTROLLER_LOGIN_REGISTER = 'LoginRegisterCtrl';

  function openDialog(templateUrl, controller){
    var q = $q.defer();

    $modal.open({
      templateUrl: templateUrl,
      controller: controller
    }).result.then(function() {
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

  function openPasswordResetDialog(){
    return openDialog('layouts/modals/passwordResetDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openRegisterDialog(){
    return openDialog('layouts/modals/registerDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  function openEnterCodeDialog(){
    return openDialog('layouts/modals/enterCodeDialog.html', CONTROLLER_LOGIN_REGISTER);
  }

  // Public methods
  return {
    openLoginDialog: openLoginDialog,
    openPasswordResetDialog: openPasswordResetDialog,
    openRegisterDialog: openRegisterDialog,
    openEnterCodeDialog: openEnterCodeDialog
  };
});
