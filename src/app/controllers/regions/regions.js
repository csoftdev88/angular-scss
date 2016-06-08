'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.regions', [])

  .controller('RegionsCtrl', function($scope, locationService, breadcrumbsService, $stateParams, scrollService, $timeout, $state, contentService, _) {

    $scope.showDetail = $stateParams.regionSlug ? true : false;

    //Regions overview
    function getRegions(){
      //breadcrumbs
      breadcrumbsService.clear()
        .addBreadCrumb('Locations');
      //Get regions
      locationService.getRegions().then(function(regions){
        $scope.allRegions = regions;
      });
    }

    //Region Detail
    function getRegion(regionSlug){
      locationService.getRegions().then(function(regions){

        //Apply region to scope
        //$scope.region = _.where(regions, {meta['slug']: regionSlug});
        $scope.region = _.find(regions, function(region){ 
          return region.meta.slug === regionSlug; 
        });
        
        //gallery
        $scope.previewImages = contentService.getLightBoxContent($scope.region.images, 300, 150, 'fill');

        //Locations
        locationService.getLocations().then(function(locations){
          $scope.allLocations = _.where(locations, {regionCode: $scope.region.code});
        });

        //breadcrumbs
        breadcrumbsService.clear()
          .addBreadCrumb('Locations', 'regions', {regionSlug: null})
          .addBreadCrumb($scope.region.nameShort);

        //scroll to detail
        $timeout(function () {
          scrollService.scrollTo('region-detail', 20);
        });
      });
    }

    //go to region detail
    $scope.goToDetail = function(regionSlug){
      $state.go('regions', {regionSlug: regionSlug});
    };

    //go to location hotels
    $scope.goToHotels = function(locationSlug){
      $state.go('hotels', {regionSlug: $stateParams.regionSlug, locationSlug: locationSlug});
    };

    //Init
    if($scope.showDetail){
      getRegion($stateParams.regionSlug);
    }
    else{
      getRegions();
    }


  });
