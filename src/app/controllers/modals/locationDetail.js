'use strict';
/*
 * This module controls single reservation in modal window
 */
angular.module('mobius.controllers.modals.locationDetail', [])

  .controller('LocationDetailCtrl', function($scope, $controller, $modalInstance,
                                             modalService, locationService, data) {

    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

    $scope.location = data;

    locationService.getRegion(data.regionCode).then(function(region) {
      $scope.region = region;
    });
  });
