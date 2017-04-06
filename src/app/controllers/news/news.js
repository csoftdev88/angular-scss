'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService,
      $state, $stateParams, _, breadcrumbsService, metaInformationService, $location,
      bookingService, chainService, Settings, scrollService, $timeout) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('News');

    var NUMBER_OF_RELEVANT_NEWS = 3;

    var selectedNewsIndex;

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

    contentService.getNews().then(function(response) {
      $scope.newsList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        selectNews($stateParams.code);
      }
    });

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      var chainData = chain;

      chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      chainData.meta.microdata.og['og:title'] = 'News: ' + chainData.meta.microdata.og['og:title'];
      chainData.meta.microdata.og['og:description'] = 'News: ' + chainData.meta.microdata.og['og:description'];
      metaInformationService.setOgGraph(chainData.meta.microdata.og);

      metaInformationService.setOgGraph(chainData.meta.microdata.og);
      metaInformationService.setPageTitle('News | ' + chain.meta.pagetitle);
      metaInformationService.setMetaDescription(chain.meta.description);
      metaInformationService.setMetaKeywords(chain.meta.keywords);
    });

    $scope.getRelevant = function(news, index) {
      var offset = selectedNewsIndex < NUMBER_OF_RELEVANT_NEWS ? 1 : 0;
      return selectedNewsIndex !== index && NUMBER_OF_RELEVANT_NEWS + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function(code) {
      $state.go('news', {code: code});
    };

    $scope.goToNewsList = function() {
      $state.go('news', {code: ''}, {reload: true});
    };

    function selectNews(code) {
      code = bookingService.getCodeFromSlug(code);
      selectedNewsIndex = _.findIndex($scope.newsList, {code: code});
      if (selectedNewsIndex < 0) {
        return $state.go('news', {code: null});
      }
      $scope.selectedNews = $scope.newsList[selectedNewsIndex];
      metaInformationService.setMetaDescription($scope.selectedNews.meta.description);
      metaInformationService.setMetaKeywords($scope.selectedNews.meta.keywords);
      metaInformationService.setPageTitle($scope.selectedNews.meta.pagetitle);
      $scope.selectedNews.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      metaInformationService.setOgGraph($scope.selectedNews.meta.microdata.og);
      breadcrumbsService.clear()
        .addBreadCrumb('News', 'news', {code: null})
        .addBreadCrumb($scope.selectedNews.title);
    }
  });
