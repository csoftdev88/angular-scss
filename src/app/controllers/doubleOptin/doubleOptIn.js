(function () {

  'use strict';

  angular
    .module('mobius.controllers.doubleOptin', [])
    .controller('DoubleOptinCtrl', DoubleOptinCtrl);

  function DoubleOptinCtrl ($scope, $state, $stateParams, apiService, $controller) {
    $controller('AuthCtrl', {
      $scope: $scope,
      config: {}
    });

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
        $scope.auth.login();
      }, function () {
        $scope.success = false;
        $scope.preloader.visible = false;
      });
  }

})();
