'use strict';
/*
 * This module controls single reservation in modal window
 */
angular.module('mobius.controllers.modals.confirmation', [])

  .controller('ConfirmationCtrl', function($scope, $controller, $modalInstance, setup, $q) {

    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

    if (!setup.header) {
      setup.header = 'Confirmation';
    }
    if (!setup.question) {
      setup.question = 'Are you sure?';
    }
    if (!setup.yes) {
      setup.yes = 'Yes';
    }

    // yesCallback/noCallback should return true or promise returning true
    function close(res) {
      if (res === true) {
        $scope.cancel();
      }
    }
    $scope.yesCallback = function() {
      return $q.when(setup.yesCallback ? setup.yesCallback() : true).then(close, close);
    };
    $scope.noCallback = function() {
      return $q.when(setup.noCallback ? setup.noCallback() : true).then(close, close);
    };

    $scope.setup = setup;
  });
