'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.data', [
  'mobius.controllers.modals.generic'
])

.controller( 'ModalDataCtrl', function($scope, $controller, data) {
  $scope.data = data;
  $controller('ModalCtrl', {$scope: $scope});
});
