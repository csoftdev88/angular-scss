'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.regions', [])

  .controller('RegionsCtrl', function($scope, locationService, breadcrumbsService, $stateParams, scrollService, $timeout, $state, contentService, _) {

    $scope.showDetail = $stateParams.code ? true : false;

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
    function getRegion(regionCode){
      locationService.getRegion(regionCode).then(function(region){

        //Apply region to scope
        $scope.region = region;

        //gallery
        $scope.previewImages = contentService.getLightBoxContent(region.images, 300, 150, 'fill');

        //Locations
        locationService.getLocations().then(function(locations){
          $scope.allLocations = _.where(locations, {regionCode: regionCode});
        });

        //breadcrumbs
        breadcrumbsService.clear()
          .addBreadCrumb('Locations', 'regions', {code: null})
          .addBreadCrumb(region.nameShort);

        //scroll to detail
        $timeout(function () {
          scrollService.scrollTo('region-detail', 20);
        });
      });
    }

    //go to region detail
    $scope.goToDetail = function(regionCode){
      $state.go('regions', {code: regionCode});
    };

    //go to location hotels
    $scope.goToHotels = function(locationSlug){
      $state.go('hotels', {locationSlug: locationSlug});
    };

    //Init
    if($scope.showDetail){
      getRegion($stateParams.code);
    }
    else{
      getRegions();
    }


  });
