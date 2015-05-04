'use strict';
/*
 * This module controls user login and password reset dialogs
 */
angular.module('mobius.controllers.modals.register', [])

  .controller( 'RegisterCtrl', function($scope, $controller, $modalInstance/*,
    modalService, apiService, user, $log*/) {

    $scope.emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    $scope.registrationStep = 0;
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
        $scope.registrationStep++;
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
