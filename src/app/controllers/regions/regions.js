'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.regions', [])

  .controller('RegionsCtrl', function($scope, $rootScope, $location, locationService, breadcrumbsService, $stateParams, scrollService, $timeout, $state, contentService, _, modalService, chainService, metaInformationService, Settings) {

    function getRegionUrl(region){
      var regionSlug = region.meta.slug;
      return $state.href('regions', {regionSlug: regionSlug});
    }

    function getLocationUrl(location){
      var locationSlug = location.meta.slug;
      return $state.href('hotels', {regionSlug: $stateParams.regionSlug, locationSlug: locationSlug});
    }

    function updateMetaData(titleSegment){
      metaInformationService.updateMetaData(titleSegment);
    }

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
            region.merchandisingBanner = region.merchandisingBanners.length === 1 ? region.merchandisingBanners[0] : region.merchandisingBanners[Math.floor(region.merchandisingBanners.length * Math.random())];
          }
          region.url = getRegionUrl(region);
        });
        $scope.allRegions = regions;

        //Add meta to page
        updateMetaData('Locations | ');

        //scroll to detail
        $timeout(function () {
          scrollService.scrollTo('region-list', 20);
        });
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

        if($scope.regionConfig.bookingStatistics && $scope.regionConfig.bookingStatistics.display && $scope.region && $scope.region.statistics){
          $timeout(function(){
            $scope.$broadcast('STATS_GROWL_ALERT', $scope.region.statistics);
          });
        }

        var images = $scope.region ? $scope.region.images : [];
        //hero slider
        $scope.updateHeroContent(images);

        //gallery
        $scope.previewImages = contentService.getLightBoxContent(images, 300, 150, 'fill');
        $scope.openGallery = function(slideIndex){
          modalService.openGallery(
            contentService.getLightBoxContent(images),
            slideIndex
          );
        };

        //Locations
        locationService.getLocations().then(function(locations){
          //Only show locations that belong to current region
          locations = _.where(locations, {regionCode: $scope.region.code});
          //Pick random merchandizing banner if any
          _.each(locations, function(location){
            if(location.merchandisingBanners && location.merchandisingBanners.length){
              location.merchandisingBanner = location.merchandisingBanners.length === 1 ? location.merchandisingBanners[0] : location.merchandisingBanners[Math.floor(location.merchandisingBanners.length * Math.random())];
            }
            location.url = getLocationUrl(location);
          });
          $scope.allLocations = locations;
        });

        //breadcrumbs
        breadcrumbsService.clear()
          .addBreadCrumb('Locations', 'regions', {regionSlug: null})
          .addBreadCrumb($scope.region.nameShort);

        var titleRegionSegment = $scope.region.nameShort + ' | ';

        //Add meta data to page
        updateMetaData(titleRegionSegment);

        //scroll to detail
        $timeout(function () {
          scrollService.scrollTo('region-detail', 20);
        });
      });
    }

    $scope.showDetail = $stateParams.regionSlug ? true : false;
    $scope.regionConfig = Settings.UI.regions;

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
