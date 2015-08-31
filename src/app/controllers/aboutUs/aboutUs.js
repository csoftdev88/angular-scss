'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.about', [])

  .controller('AboutUsCtrl', function($scope, $controller, contentService, chainService,
         $state, $stateParams, _, Settings, modalService, breadcrumbsService,
         metaInformationService, $location, bookingService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.clear()
     .addBreadCrumb('About Us');

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
      metaInformationService.setMetaDescription($scope.chain.meta.description);
      metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
      metaInformationService.setPageTitle($scope.chain.meta.pagetitle);

      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

      $scope.previewImages = contentService.getLightBoxContent(
        chain.images, 300, 150, 'fill');

      $scope.openGallery = function(){
        modalService.openGallery(contentService.getLightBoxContent(chain.images));
      };
    });

    var NUMBER_OF_RELEVANT_ABOUT_US = 3;

    var selectedAboutIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getAbout().then(function(response) {
      $scope.aboutList = _.sortBy(response, 'prio').reverse();
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

      $scope.selectedAbout.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedAbout.meta.microdata.og);
      breadcrumbsService.clear()
        .addBreadCrumb('About Us', 'aboutUs', {code: null})
        .addBreadCrumb($scope.selectedAbout.title);
    }
  });
