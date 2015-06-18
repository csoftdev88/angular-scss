'use strict';
/*
 * This a generic controller for modal dialogs
 */
angular.module('mobius.controllers.modals.gallery', [
  'mobius.controllers.modals.generic'
])

  .controller( 'GalleryCtrl', function($scope, $modalInstance, $controller, data) {
    $scope.images = data;
    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
  });
