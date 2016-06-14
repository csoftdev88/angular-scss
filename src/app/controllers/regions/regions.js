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
        //Pick random merchandizing banner if any
        _.each(regions, function(region){
          if(region.merchandisingBanners && region.merchandisingBanners.length){
            region.merchandisingBanner = region.merchandisingBanners.length === 1 ? region.merchandisingBanners[0] : region.merchandisingBanners[Math.random()*region.merchandisingBanners.length-1];
          }
        });
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

        //hero slider
        $scope.updateHeroContent($scope.region.images);
        
        //gallery
        $scope.previewImages = contentService.getLightBoxContent($scope.region.images, 300, 150, 'fill');

        //Locations
        locationService.getLocations().then(function(locations){
          //Only show locations that belong to current region
          locations = _.where(locations, {regionCode: $scope.region.code});
          //Pick random merchandizing banner if any
          _.each(locations, function(location){
            if(location.merchandisingBanners && location.merchandisingBanners.length){
              location.merchandisingBanner = location.merchandisingBanners.length === 1 ? location.merchandisingBanners[0] : location.merchandisingBanners[Math.random()*location.merchandisingBanners.length-1];
            }
          });
          $scope.allLocations = locations;
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
