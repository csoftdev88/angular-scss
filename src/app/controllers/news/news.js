'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService,
         $state, $stateParams, _, breadcrumbsService, metaInformationService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('News');

    var NUMBER_OF_RELEVANT_NEWS = 3;

    var selectedNewsIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getNews().then(function(response) {
      $scope.newsList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        selectNews($stateParams.code);
      }
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
      selectedNewsIndex = _.findIndex($scope.newsList, {code: code});
      if (selectedNewsIndex < 0) {
        return $state.go('news', {code: null});
      }
      $scope.selectedNews = $scope.newsList[selectedNewsIndex];
      metaInformationService.setMetaDescription($scope.selectedNews.meta.description);
      breadcrumbsService.clear()
        .addBreadCrumb('News', 'news', {code: null})
        .addBreadCrumb($scope.selectedNews.title);
    }
  });
