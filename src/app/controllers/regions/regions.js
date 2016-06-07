'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.regions', [])

  .controller('RegionsCtrl', function($scope, locationService, breadcrumbsService, $stateParams, scrollService, $timeout) {

    breadcrumbsService.addBreadCrumb('Locations');

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.allRegions = null;

    $scope.$watch(function(){
      return $scope.showDetail;
    }, function(){
      if($scope.showDetail) {
        $timeout(function () {
          scrollService.scrollTo('region-detail', 20);
        });
      }
    });

    //Get Regions
    locationService.getRegions().then(function(regions){
      $scope.allRegions = regions;

      if ($stateParams.code) {
        //selectOffer(bookingService.getCodeFromSlug($stateParams.code));
      }
    });


  });
