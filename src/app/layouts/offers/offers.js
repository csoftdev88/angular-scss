'use strict';

angular.module('mobius.controllers.offers', [])

.controller( 'OffersCtrl',  function($scope, $stateParams) {
  // Application settings
  $scope.category = $stateParams.category;
  $scope.offerID = $stateParams.offerID;
});
