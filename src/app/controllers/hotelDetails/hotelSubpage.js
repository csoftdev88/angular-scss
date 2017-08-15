'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.subpage', [])

.controller( 'HotelSubpageCtrl', function($scope, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService,
  $window, advertsService, $controller, $timeout, $stateParams, metaInformationService,
  $location, _, Settings, routerService, queryService) {

  $scope.scroll = 0;
  $scope.moreInfo = [];

  if(!$stateParams.infoSlug || $stateParams.infoSlug === ''){
    $state.go('hotel', {propertySlug: $stateParams.propertySlug});
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
    var len = data.content.length;
    for(var i = 0; i < len; i++){
      var c = data.content[i];
      if(c.meta.slug === $stateParams.infoSlug){
        $scope.info = c;
      }
      else{
        if(c.thumbnail && c.thumbnail.uri)
        {
          c.image = {};
          c.image.uri = c.thumbnail.uri;
          c.image.alt = c.thumbnail.alt;
        }
        else
        {
          //Pull first image of description to use in moreInfo thumbnails
          var elem = document.createElement('div');
          elem.innerHTML = c.description;
          var images = elem.getElementsByTagName('img');
          if(images.length){
            c.image = {};
            c.image.uri = images[0].src;
            c.image.alt = images[0].alt;
          }
          if(elem.parentNode){
            elem.parentNode.removeChild(elem);
          }
        }

        c.url = getInfoUrl(c);
        $scope.moreInfo.push(c);
      }
    }
  }

  function buildRedirectUrl(urlData) {
    var url = urlData.url;
    var keepParams = urlData.retainParameters;

    if (keepParams) {
      var arr = url.split('?');
      var params = angular.extend(queryService.getQueryParameters(arr[1]), $location.search());
      url = arr[0] + '?' + $.param(params);
    }

    return url;
  }

  function getHotelDetails(propertyCode, params){

    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){

        $scope.details = details;
        $scope.updateHeroContent(_.filter(details.images, {includeInSlider: true}));

        if(Settings.UI.viewsSettings.breadcrumbsBar.displayPropertyTitle){
          breadcrumbsService.setHeader(details.nameLong);
        }

        //Generate content for current hotel subpage
        sortInfo(details);

        metaInformationService.setMetaDescription($scope.info.meta.description);
        metaInformationService.setMetaKeywords($scope.info.meta.keywords);
        metaInformationService.setPageTitle($scope.info.meta.pagetitle);

        $scope.details.meta.microdata.og['og:title'] = $scope.info.meta.pagetitle;
        $scope.details.meta.microdata.og['og:description'] = $scope.info.meta.description;
        $scope.details.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];

        metaInformationService.setOgGraph($scope.details.meta.microdata.og);

        if (Settings.UI.hotelDetails.subPageRedirects) {
          var redirectUrl = $scope.info && $scope.info.meta && $scope.info.meta.redirectUrl ? $scope.info.meta.redirectUrl : null;

          if (redirectUrl && redirectUrl.url) {
            $window.location.href = buildRedirectUrl(redirectUrl);
          }
        }

        //Get property region/location data for breadcrumbs
        propertyService.getPropertyRegionData(details.locationCode).then(function(propertyRegionData){
          if($stateParams.regionSlug && $stateParams.locationSlug && !Settings.UI.generics.singleProperty)
          {
            //breadcrumbs
            breadcrumbsService
              .addBreadCrumb(propertyRegionData.region.nameShort, 'regions', {regionSlug: propertyRegionData.region.meta.slug, property: null})
              .addBreadCrumb(propertyRegionData.location.nameShort, 'hotels', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, property: null});
          }
          else {
            breadcrumbsService.addBreadCrumb('Hotels', 'hotels');
          }
          //breadcrumbs
          breadcrumbsService
            .addBreadCrumb(details.nameShort, 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug})
            .addBreadCrumb($scope.info.title);

          //alt nav
          breadcrumbsService
          .addAbsHref('About', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug, scrollTo: 'jsAbout'})
          .addAbsHref('Location', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug, scrollTo: 'jsLocation'})
          .addAbsHref('Offers', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug, scrollTo: 'jsOffers'})
          .addAbsHref('Rooms', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug, scrollTo: 'jsRooms'})
          .addAbsHref('Gallery', 'hotel', {regionSlug: propertyRegionData.region.meta.slug, locationSlug: propertyRegionData.location.meta.slug, propertySlug: details.meta.slug, scrollTo: 'fnOpenLightBox'});

        });

        // Updating Hero content images
        if(details.images){
          $scope.updateHeroContent($window._.filter(details.images, {includeInSlider: true}));

          // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
          // Current version of PhantomJS is missing not supporting .bind
          // https://github.com/ariya/phantomjs/issues/10522
          // TODO: Update PhantomJS
          $scope.openGallery = function(){
            modalService.openGallery(
              details.images.map(function(image){return image.uri;})
            );
          };
        }

        $scope.scrollToBreadcrumbs();

        $scope.goToInfo = function(info) {
          var paramsData = {
            'property': $scope.details
          };
          var stateParams = {
            'infoSlug': info.meta.slug
          };
          routerService.buildStateParams('hotelInfo', paramsData).then(function(params){
            stateParams = _.extend(stateParams, params);
            $state.go('hotelInfo', stateParams, {reload: true});
          });
        };

      }, function() {
        $state.go('hotels');
      });


    preloaderFactory($q.all([detailPromise]).then(function() {
      var hash = $window.location.hash;
      if (hash) {
        scrollTo(hash.substr(1));
      }
    }));
  }

  function getInfoUrl(info) {
    var stateParams = {
      'propertySlug': $scope.details.meta.slug,
      'infoSlug': info.meta.slug,
      'regionSlug': $stateParams.regionSlug,
      'locationSlug': $stateParams.locationSlug
    };
    return $state.href('hotelInfo', stateParams, {reload: true});
  }

  getHotelDetails(bookingService.getCodeFromSlug($stateParams.propertySlug));

  $scope.goBack = function() {
    if(previousState && previousState.state && previousState.state.name !== ''){
      $state.go(previousState.state, previousState.params);
    }
    else{
      $state.go('hotel', {propertySlug: $stateParams.propertySlug});
    }
  };
});
