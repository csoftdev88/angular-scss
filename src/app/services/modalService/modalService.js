'use strict';
/*
* This service controls opening of all dialogs in the application
*/
angular.module('mobiusApp.services.modal', [])
.service( 'modalService',  function($modal, $q) {
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
    return openDialog('layouts/modals/loginDialog.html', 'LoginRegisterCtrl');
  }

  function openPasswordResetDialog(){
    return openDialog('layouts/modals/passwordResetDialog.html', 'LoginRegisterCtrl');
  }
  // Public methods
  return {
    openLoginDialog: openLoginDialog,
    openPasswordResetDialog: openPasswordResetDialog
  };
});
