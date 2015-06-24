'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService, breadcrumbsService){

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('News');

    var NUMBER_OF_RELEVANT_NEWS = 3;

    var selectedNewsIndex;
    $scope.getRelevant = function(news, index) {
      var offset = selectedNewsIndex < NUMBER_OF_RELEVANT_NEWS ? 1 : 0;
      return selectedNewsIndex !== index && NUMBER_OF_RELEVANT_NEWS + offset > parseInt(index, 10);
    };

    $scope.showDetail = false;
    contentService.getNews().then(function(response) {
      $scope.newsList = response;
    });

    $scope.selectNews = function(index) {
      $scope.selectedNews = $scope.newsList[index];
      breadcrumbsService.clear()
        .addBreadCrumb('News', 'news')
        .addBreadCrumb($scope.selectedNews.title);
      selectedNewsIndex = index;
      $scope.showDetail = true;
    };

  });
