'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.staticContent', [])

  .controller('StaticContentCtrl', function($scope, contentService, $stateParams, _, breadcrumbsService,
         metaInformationService, scrollService, $timeout, $location, $state) {

    $scope.preloader.visible = true;

    contentService.getStatic().then(function(response) {

      //Get current content
      $scope.selectedContent = _.find(response, function(item){
        //removing the code
        var slug = item.meta.slug;
        var codeStartIndex = slug.lastIndexOf('-');
        slug = slug.substring(0, codeStartIndex);
        return slug === $stateParams.contentSlug;
      });

      $scope.preloader.visible = false;

      if($scope.selectedContent){
        //Set meta info
        metaInformationService.setMetaDescription($scope.selectedContent.meta.description);
        metaInformationService.setMetaKeywords($scope.selectedContent.meta.keywords);
        metaInformationService.setPageTitle($scope.selectedContent.meta.pagetitle);

        $scope.selectedContent.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        metaInformationService.setOgGraph($scope.selectedContent.meta.microdata.og);

        //Add breadcrumb
        breadcrumbsService.clear()
          .addBreadCrumb($scope.selectedContent.title);

        //Scroll to content
        $timeout(function () {
          scrollService.scrollTo('about-detail', 20);
        });
      }
      else{
        $state.go('home');
      }
      
    }, function(){
      $state.go('home');
    });

  });

