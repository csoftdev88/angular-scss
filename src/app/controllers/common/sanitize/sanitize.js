'use strict';
/*
* This a generic controller html sanitization
*/
angular.module('mobius.controllers.common.sanitize', [])

.controller( 'SanitizeCtrl', function($scope, $sce) {
  $scope.sanitize = function(content){
    return $sce.trustAsHtml(content);
  };
});
