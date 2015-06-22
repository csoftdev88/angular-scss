'use strict';
/*
 * This a generic controller for modal dialogs
 */
angular.module('mobius.controllers.modals.addonDetail', [
  'mobius.controllers.modals.generic'
])

  .controller( 'AddonDetailCtrl', function($scope, $modalInstance, $controller, addon, addAddon) {
    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
    $scope.addon = addon;

    $scope.addAddon = function(addon) {
      addAddon(addon);
      $scope.cancel();
    };
  });
