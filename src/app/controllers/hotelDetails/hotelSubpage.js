'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.subpage', [])

.controller( 'HotelSubpageCtrl', function($scope, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService,
  $window, advertsService, $controller, $timeout, $stateParams, metaInformationService, $location) {
  
  $scope.scroll = 0;
  $scope.moreInfo = [];

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
        $scope.moreInfo.push(c);
      }
    }
  }

  function getHotelDetails(propertyCode, params){

    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){

        $scope.details = details;


        metaInformationService.setMetaDescription($scope.details.meta.description);
        metaInformationService.setMetaKeywords($scope.details.meta.keywords);
        metaInformationService.setPageTitle($scope.details.meta.pagetitle);

        $scope.details.meta.microdata.og['og:url'] = $location.absUrl();
        metaInformationService.setOgGraph($scope.details.meta.microdata.og);

        sortInfo(details);

        breadcrumbsService.addBreadCrumb('Hotels', 'hotels').addBreadCrumb(details.nameShort, 'hotel', {propertySlug: $stateParams.propertySlug}).addBreadCrumb($stateParams.infoSlug.split('_').join(' '));

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

  getHotelDetails($stateParams.propertySlug.split('-')[1]);

  $scope.goToInfo = function(info) {
    $state.go('hotelInfo', {propertySlug: $stateParams.propertySlug, infoSlug: info.meta.slug});
  };
  $scope.goBack = function() {
    $state.go('hotel', {propertySlug: $stateParams.propertySlug});
  };


});
