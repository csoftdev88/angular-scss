'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.about', [])

  .controller('AboutUsCtrl', function($scope, $controller, contentService, chainService,
         $state, $stateParams, _, Settings, modalService, breadcrumbsService,
         metaInformationService, $location, bookingService, scrollService, $timeout) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.clear()
     .addBreadCrumb('About Us');

    $scope.config = Settings.UI.aboutChain;
    $scope.contentConfig = Settings.UI.contents;

    $scope.$on('$stateChangeSuccess', function() {
      $timeout(function(){
        scrollService.scrollTo('top');
      }, 0);
    });

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
      metaInformationService.setMetaDescription($scope.chain.meta.description);
      metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
      metaInformationService.setPageTitle('About | ' + $scope.chain.meta.pagetitle);

      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

      if($scope.contentConfig.displayContentImageInHeroSlider){
        $scope.updateHeroContent(chain.images);
      }
      else {
        $scope.previewImages = contentService.getLightBoxContent(
        chain.images, 300, 150, 'fill');
        $scope.updateHeroContent(null, true);
      }

      $scope.openGallery = function(slideIndex){
        modalService.openGallery(
          contentService.getLightBoxContent(chain.images),
          slideIndex);
      };
    });

    var NUMBER_OF_RELEVANT_ABOUT_US = 3;

    var selectedAboutIndex;

    $scope.showDetail = $stateParams.code ? true : false;
    $scope.$watch(function(){
      return $scope.showDetail;
    }, function(){
      if($scope.showDetail) {
        $timeout(function () {
          scrollService.scrollTo('about-detail', 20);
        });
      }
    });

    contentService.getAbout().then(function(response) {
      $scope.aboutList = _.sortBy(response, 'prio').reverse();
      //Scroll to aboutList if scrollTo value
      var scrollToValue = $location.search().scrollTo || null;
      if (scrollToValue) {
        $timeout(function(){
          scrollService.scrollTo(scrollToValue, 20);
        }, 1500);
      }
      if ($stateParams.code) {
        selectAbout($stateParams.code);
      }
    });

    $scope.getRelevant = function(about, index) {
      var offset = selectedAboutIndex < NUMBER_OF_RELEVANT_ABOUT_US ? 1 : 0;
      return selectedAboutIndex !== index && NUMBER_OF_RELEVANT_ABOUT_US + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function(code) {
      $state.go('aboutUs', {code: code});
    };

    $scope.goToAboutList = function() {
      $state.go('aboutUs', {code: ''}, {reload: true});
    };

    function selectAbout(code) {
      code = bookingService.getCodeFromSlug(code);
      selectedAboutIndex = _.findIndex($scope.aboutList, {code: code});
      if (selectedAboutIndex < 0) {
        return $state.go('aboutUs', {code: null});
      }
      $scope.selectedAbout = $scope.aboutList[selectedAboutIndex];
      metaInformationService.setMetaDescription($scope.selectedAbout.meta.description);
      metaInformationService.setMetaKeywords($scope.selectedAbout.meta.keywords);
      metaInformationService.setPageTitle($scope.selectedAbout.meta.pagetitle);

      if($scope.contentConfig.displayContentImageInHeroSlider && !_.isEmpty($scope.selectedAbout.image)){
        $scope.updateHeroContent([$scope.selectedAbout.image]);
      }
      else{
        $scope.updateHeroContent(null, true);
      }

      $scope.selectedAbout.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedAbout.meta.microdata.og);
      breadcrumbsService.clear()
        .addBreadCrumb('About Us', 'aboutUs', {code: null})
        .addBreadCrumb($scope.selectedAbout.title);
    }
  });
