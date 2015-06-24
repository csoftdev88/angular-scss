'use strict';

angular.module('mobius.controllers.offers', [])

.controller( 'OffersCtrl',  function($scope, $stateParams, $controller, breadcrumbsService) {

  $controller('MainCtrl', {$scope: $scope});
  breadcrumbsService.addBreadCrumb('Offers');

  // Application settings
  $scope.category = $stateParams.category;
  $scope.offerID = $stateParams.offerID;
});
