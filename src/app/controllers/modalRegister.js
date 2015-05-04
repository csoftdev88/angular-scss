'use strict';
/*
 * This module controls user login and password reset dialogs
 */
angular.module('mobius.controllers.modals.register', [])

  .controller( 'RegisterCtrl', function($scope, $controller, $modalInstance/*,
    modalService, apiService, user, $log*/) {
    var REGISTRATION_STEPS = ['step-1', 'step-2', 'step-3'];

    $scope.emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    $scope.registrationStep = REGISTRATION_STEPS[0];
    $scope.formData = {};

    $scope.success = false;
    $scope.codePattern = /[0-9\-]{8}/;
    $scope.passwordChanged = false;

    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});



    $scope.register = function(form, formData){
      form.submitted = true;
      console.log('formData ' + JSON.stringify(formData, null,4));

      console.log('form ' + JSON.stringify(form, null,4));
      if (form.$valid) {
        /*apiService.post(apiService.getFullURL('customers.login'), formData).then(
          function(response) {
            user.loadUser(response.id).then($scope.ok);
          },
          function(error) {
            $log.error('Login error: ' + JSON.stringify(error, null,4));
            loginForm.$error.wrongCredentials = true;
            loginForm.submitted = true;
          }
        ).finally(function() {
            loginForm.$setPristine();
          });*/
      } else {
        form.$setPristine();
      }
    };

  });
