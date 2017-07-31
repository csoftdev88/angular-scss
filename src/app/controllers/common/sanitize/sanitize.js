'use strict';
/*
* This a generic controller html sanitization
*/
angular.module('mobius.controllers.common.sanitize', [])

.controller( 'SanitizeCtrl', function($scope, $sce, $log) {
  $scope.sanitize = function(content){
    if (typeof content !== "string") {
      return '';
    }
    return $sce.trustAsHtml(content);
  };
});
