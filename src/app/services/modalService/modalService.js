'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q) {
  var CONTROLLER_LOGIN_REGISTER = 'LoginRegisterCtrl';
  var CONTROLLER_DEFAULT = 'ModalCtrl';

  function openDialog(templateUrl, controller){
    var q = $q.defer();

    $modal.open({
      templateUrl: templateUrl,
      controller: controller
    }).result.then(function() {
      q.resolve();
    }, function() {
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

  function openPromoCodeDialog(){
    return openDialog('layouts/modals/enterCodeDialog.html', CONTROLLER_DEFAULT);
  }

  // Public methods
  return {
    openLoginDialog: openLoginDialog,
    openPasswordResetDialog: openPasswordResetDialog,
    openRegisterDialog: openRegisterDialog,
    openPromoCodeDialog: openPromoCodeDialog
  };
});
