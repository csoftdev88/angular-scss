'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService){

    $controller('MainCtrl', {$scope: $scope});

    $scope.showNewsList = true;
    contentService.getNews().then(function(response) {
      $scope.newsList = response.news;
    });

    $scope.selectNews = function(index) {
      $scope.selectedNews = $scope.newsList[index];
      $scope.showNewsList = false;
    };

    $scope.goToNewsList = function() {
      $scope.showNewsList = true;
    };
  });
