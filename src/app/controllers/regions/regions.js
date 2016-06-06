'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.regions', [])

  .controller('RegionsCtrl', function($scope, locationService, breadcrumbsService, $stateParams) {

    breadcrumbsService.addBreadCrumb('Locations');

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.allRegions = null;

    //Get Regions
    locationService.getRegions().then(function(regions){
      $scope.allRegions = regions;
    });


  });
