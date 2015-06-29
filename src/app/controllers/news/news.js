'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService,
         $state, $stateParams, _, breadcrumbsService) {

    $controller('MainCtrl', {$scope: $scope});

    breadcrumbsService.addBreadCrumb('News');

    var NUMBER_OF_RELEVANT_NEWS = 3;

    var selectedNewsIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getNews().then(function(response) {
      $scope.newsList = response;
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

    function selectNews(code) {
      selectedNewsIndex = _.findIndex($scope.newsList, {code: code});
      if (selectedNewsIndex < 0) {
        $state.go('news');
      }
      $scope.selectedNews = $scope.newsList[selectedNewsIndex];
      breadcrumbsService.clear()
        .addBreadCrumb('News', 'news')
        .addBreadCrumb($scope.selectedNews.title);
    }
  });
