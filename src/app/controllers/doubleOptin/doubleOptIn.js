(function () {

  'use strict';

  angular
    .module('mobius.controllers.doubleOptin', [])
    .controller('DoubleOptinCtrl', DoubleOptinCtrl);

  function DoubleOptinCtrl ($scope, $state, $stateParams, $timeout, apiService, user) {

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
        user.authPromise.then(function (loggedIn) {
          if (loggedIn) {
            var userData = user.getUser();
            userData.doubleOptInConfirmed = true;
          }
          $timeout(function () {
            $state.go('home');
            if (!loggedIn) {
              $scope.auth.login();
            }
          }, 5000);
        });
      }, function () {
        $scope.success = false;
        $scope.preloader.visible = false;
      });
  }

})();
