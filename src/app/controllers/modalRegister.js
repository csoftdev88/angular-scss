'use strict';
/*
 * This module controls user registration
 */
angular.module('mobius.controllers.modals.register', [])

  .controller( 'RegisterCtrl', function($scope, $controller, $modalInstance, apiService,
    modalService, user, $log) {

    $scope.emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    $scope.registrationStep = 0;
    $scope.formData = {};
    $scope.confirmData = {};


    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

    $scope.goBack = function() {
      $scope.registrationStep--;
    };

    $scope.register = function(form){
      form.submitted = true;
      if (form.$valid) {
        if($scope.registrationStep === 1) {
          apiService.post(apiService.getFullURL('customers.customers'), $scope.formData).then(
           function(response) {
            $scope.registrationStep++;
            user.loadUser(response.id);
          },
           function(error) {
            $log.error('Login error: ' + JSON.stringify(error, null,4));
          });
        } else {
          $scope.registrationStep++;
        }
      } else {
        form.$setPristine();
      }
    };

  });
