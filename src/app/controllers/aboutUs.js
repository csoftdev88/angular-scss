'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.about', [])

  .controller('AboutUsCtrl', function($scope, $controller, chainService, Settings, modalService){

    $controller('MainCtrl', {$scope: $scope});

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;

      $scope.openGallery = modalService.openGallery.bind(modalService, chain.images);
    });
  });
