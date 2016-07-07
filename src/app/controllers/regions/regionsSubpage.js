'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.regions.subpage', [])

.controller( 'RegionsSubpageCtrl', function($scope, bookingService, $state, contentService,
  locationService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService,
  $window, advertsService, $controller, $timeout, $stateParams, metaInformationService, $location, _, Settings) {

  $scope.scroll = 0;
  $scope.moreInfo = [];

  if(!$stateParams.infoSlug || $stateParams.infoSlug === ''){
    $state.go('regions', {regionSlug: $stateParams.regionSlug});
  }

  var previousState = {
    state: $state.fromState,
    params: $state.fromParams
  };

  // TODO: Change to a classic selectors . #
  function scrollTo(hash, speed, offset) {
    $window._.defer(function () {
      var $item = angular.element('#' + hash);
      if($item.length) {
        offset = offset || 0;
        angular.element('html, body').animate({
          scrollTop: $item.offset().top + offset
        }, speed || 300);
      }
    });
  }

  $scope.scrollToBreadcrumbs = function(){
    $timeout(function(){
      scrollTo('breadcrumbs', 1200, -angular.element('#main-header').height());
    }, 0);
  };

  
  function sortInfo(data){

    _.find(data.content, function(content){
      if(content.slug === $stateParams.infoSlug){
        $scope.info = content;
      }
      else{
        //Pull first image of description to use in moreInfo thumbnails
        var elem = document.createElement('div');
        elem.innerHTML = content.description;
        var images = elem.getElementsByTagName('img');
        if(images.length){
          content.image = {};
          content.image.uri = images[0].src;
          content.image.alt = images[0].alt;
        }
        if(elem.parentNode){
          elem.parentNode.removeChild(elem);
        }
        
        $scope.moreInfo.push(content);
      }
    });

  }


  function getDetails(){

    var regionsPromise = locationService.getRegions();
    var locationsPromise = locationService.getLocations();

    preloaderFactory($q.all([regionsPromise, locationsPromise]).then(function(data) {
      var regions = data[0];
      var locations = data[1];
      var curLocation = null;

      var curRegion = _.find(regions, function(region){
        return region.meta.slug === $stateParams.regionSlug;
      });

      if($stateParams.locationSlug){
        curLocation = _.find(locations, function(location){
          return location.meta.slug === $stateParams.locationSlug;
        });
        sortInfo(curLocation);
      }
      else{
        sortInfo(curRegion);
      }

      $scope.details = $stateParams.locationSlug ? curLocation : curRegion;

      if(Settings.UI.viewsSettings.breadcrumbsBar.displayPropertyTitle){
        breadcrumbsService.setHeader($scope.details.nameShort);
      }

      metaInformationService.setMetaDescription($scope.details.meta.description);
      metaInformationService.setMetaKeywords($scope.details.meta.keywords);
      metaInformationService.setPageTitle($scope.details.meta.pagetitle);

      if($scope.details.meta.microdata){
        $scope.details.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        metaInformationService.setOgGraph($scope.details.meta.microdata.og);
      }

      if($stateParams.locationSlug){
        breadcrumbsService
        .clear()
        .addBreadCrumb('Locations', 'regions', {regionSlug: null})
        .addBreadCrumb(curRegion.nameShort, 'regions', {regionSlug: curRegion.meta.slug})
        .addBreadCrumb(curLocation.nameShort, 'hotels', {regionSlug: curRegion.meta.slug, locationSlug: curLocation.meta.slug})
        .addBreadCrumb($scope.info.title);
      }
      else{
        breadcrumbsService
        .clear()
        .addBreadCrumb('Locations', 'regions', {regionSlug: null})
        .addBreadCrumb(curRegion.nameShort, 'regions', {regionSlug: curRegion.meta.slug})
        .addBreadCrumb($scope.info.title);
      }
      
      // Updating Hero content images
      if($scope.details.images){
        $scope.updateHeroContent(_.filter($scope.details.images, {includeInSlider: true}));

        // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
        // Current version of PhantomJS is missing not supporting .bind
        // https://github.com/ariya/phantomjs/issues/10522
        // TODO: Update PhantomJS
        $scope.openGallery = function(){
          modalService.openGallery(
            $scope.details.images.map(function(image){return image.uri;})
          );
        };
      }

      $scope.scrollToBreadcrumbs();

      //scroll to hash if any
      var hash = $window.location.hash;
      if (hash) {
        scrollTo(hash.substr(1));
      }
    }), function(){
      $state.go('regions', {regionSlug: null});
    });
  }


  getDetails();
  
  
  $scope.goToInfo = function(info) {
    $state.go('locationInfo', {regionSlug: $stateParams.regionSlug, locationSlug: $stateParams.locationSlug || null, infoSlug: info.slug});
  };

  $scope.goBack = function() {
    if(previousState && previousState.state && previousState.state.name !== ''){
      $state.go(previousState.state, previousState.params);
    }
    else{
      $state.go('regions', {regionSlug: $stateParams.regionSlug});
    }
  };
});
