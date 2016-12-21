'use strict';
/*
 * This a generic controller for modal dialogs
 */
angular.module('mobius.controllers.modals.addonDetail', [
  'mobius.controllers.modals.generic'
])

  .controller( 'AddonDetailCtrl', function($scope, $modalInstance, $controller, addon, addAddon,
      payWithPoints, Settings) {

    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
    $scope.addon = addon;
    $scope.payWithPoints = payWithPoints;
    $scope.state = {
      confirmed: $scope.payWithPoints !== undefined
    };
    if (Settings.UI.currencies.default) {
      $scope.defaultCurrencyCode = Settings.UI.currencies.default;
    }
    $scope.config = Settings.UI.reservations;
    // Confirmation is not displayed when paying with points/money
    // - once clicked on payment buttons instead of the whole container
    $scope.addon._confirmation =

    $scope.selectPaymentMethod = function(withPoints){
      $scope.payWithPoints = withPoints;
      $scope.state.confirmed = true;
    };

    $scope.addAddon = function(addon) {
      // NOTE: Price/pointsRequired should be used according to the payment
      // method - only corresponding prop should be sent back to the server

      if(addon.furtherInfoRequired && $scope.config.displayAddonComments){
        if($scope.addon.comment) {
          if($scope.payWithPoints){
            delete addon.price;
          } else {
            delete addon.pointsRequired;
          }
          delete addon.$$hashKey;
          delete addon._expanded;
          delete addon._confirmation;
          addAddon(addon);
          $scope.cancel();
        }
        else {
          $scope.descriptionInvalid = true;
          console.log('enter a description');
        }
      }
      else {
        if($scope.payWithPoints){
          delete addon.price;
        } else {
          delete addon.pointsRequired;
        }
        addAddon(addon);
        $scope.cancel();
      }
    };
  });
