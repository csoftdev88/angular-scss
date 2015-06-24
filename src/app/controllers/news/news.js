'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.news', [])

  .controller('NewsCtrl', function($scope, $controller, contentService, $stateParams, _){

    $controller('MainCtrl', {$scope: $scope});

    var NUMBER_OF_RELEVANT_NEWS = 3;

    var selectedNewsIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getNews().then(function(response) {
      $scope.newsList = response;
      if($stateParams.code) {
        $scope.selectNews($stateParams.code);
      }
    });

    $scope.getRelevant = function(news, index) {
      var offset = selectedNewsIndex < NUMBER_OF_RELEVANT_NEWS ? 1 : 0;
      return selectedNewsIndex !== index && NUMBER_OF_RELEVANT_NEWS + offset > parseInt(index, 10);
    };


    $scope.selectNews = function(code) {
      selectedNewsIndex = _.findIndex($scope.newsList,
        function (item) {
          return item.code === code;
        });
      $scope.selectedNews = $scope.newsList[selectedNewsIndex];
      $scope.showDetail = true;
    };

  });
