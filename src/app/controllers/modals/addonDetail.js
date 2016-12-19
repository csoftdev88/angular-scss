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

      if($scope.addon.voucherDescription) {
        var thisAddon = addon;
        if($scope.payWithPoints){
          delete thisAddon.price;
        } else {
          delete thisAddon.pointsRequired;
        }
        delete thisAddon.$$hashKey;
        delete thisAddon._expanded;
        delete thisAddon._confirmation;
        thisAddon.price = addon.price.totalAfterTax;
        console.log(thisAddon);
        addAddon(thisAddon);
        $scope.cancel();
      }
      else {
        $scope.descriptionInvalid = true;
        console.log('enter a description');
      }
    };
  });
