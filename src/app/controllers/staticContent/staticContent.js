'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.staticContent', [])

  .controller('StaticContentCtrl', function($scope, contentService, $stateParams, _, breadcrumbsService,
         metaInformationService, scrollService, $timeout, $location, $state) {

    contentService.getAbout().then(function(response) {

      //Get current content
      $scope.selectedAbout = _.find(response, function(item){
        return item.meta.slug === $stateParams.contentSlug;
      });

      if($scope.selectedAbout){
        //Set meta info
        metaInformationService.setMetaDescription($scope.selectedAbout.meta.description);
        metaInformationService.setMetaKeywords($scope.selectedAbout.meta.keywords);
        metaInformationService.setPageTitle($scope.selectedAbout.meta.pagetitle);

        $scope.selectedAbout.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        metaInformationService.setOgGraph($scope.selectedAbout.meta.microdata.og);

        //Add breadcrumb
        breadcrumbsService.clear()
          .addBreadCrumb($scope.content.title);

        //Scroll to content
        $timeout(function () {
          scrollService.scrollTo('about-detail', 20);
        });
      }
      else{
        $state.go('home');
      }
      
    });

  });
