'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.data', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller( 'ModalDataCtrl', function($scope, $modalInstance, $controller, data, $window) {
  $scope.data = data;
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});
  //format dates
  $scope.formatDate = function(date, format){
    return $window.moment(date).format(format);
  };
});
