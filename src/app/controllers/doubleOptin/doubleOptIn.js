(function () {

  'use strict';

  angular
    .module('mobius.controllers.doubleOptin', [])
    .controller('DoubleOptinCtrl', DoubleOptinCtrl);

  function DoubleOptinCtrl ($scope, $state, $stateParams, apiService, user) {

    $scope.success = false;
    $scope.preloader.visible = true;

    if (!$stateParams.key) {
      $state.go('home');
    }

    apiService
      .post(apiService.getFullURL('customers.doubleOptin'), { token: $stateParams.key })
      .then(function () {
        $scope.success = true;
        $scope.preloader.visible = false;
        user.authPromise.then(function (logged) {
          if (logged) {
            var userData = user.getUser();
            userData.doubleOptInConfirmed = true;
          } else {
            $scope.auth.login();
          }
        });
      }, function () {
        $scope.success = false;
        $scope.preloader.visible = false;
      });
  }

})();
