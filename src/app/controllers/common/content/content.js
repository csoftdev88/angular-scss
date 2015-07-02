'use strict';

angular.module('mobius.controllers.common.content', [])

  .controller('ContentCtr', function($scope, propertyService, contentService, $state, _) {

    // We are using different methods for getting the data
    // from the server according to content type. Also, menu
    // items are located under different objects.
    var contentTypes = {
      'hotels': {
        'service': 'propertyService',
        'method': 'getAll',
        'detailState': 'hotel',
        'listState': 'hotels',
        'paramName': 'propertyCode',
        'title': 'nameShort',
        'sort': 'nameShort',
        'reverseSort': false
      },
      'news': {
        'service': 'contentService',
        'method': 'getNews',
        'detailState': 'news',
        'listState': 'news',
        'paramName': 'code',
        'title': 'title',
        'sort': 'prio',
        'reverseSort': true
      },
      'offers': {
        'service': 'contentService',
        'method': 'getOffers',
        'detailState': 'offers',
        'listState': 'offers',
        'paramName': 'code',
        'title': 'title',
        'sort': 'prio',
        'reverseSort': true
      },
      'about': {
        'service': 'contentService',
        'method': 'getAbout',
        'detailState': 'aboutUs',
        'listState': 'aboutUs',
        'paramName': 'code',
        'title': 'title',
        'sort': 'prio',
        'reverseSort': true
      }
    };

    var services = {
      propertyService: propertyService,
      contentService: contentService
    };

    $scope.settings = contentTypes[$scope.item];

    if ($scope.settings) {
      $scope.goToState = function(code) {
        var params = {};
        params[$scope.settings.paramName] = code;
        if (code) {
          $state.go($scope.settings.detailState, params, {reload: true});
        } else {
          $state.go($scope.settings.listState, params, {reload: true});
        }
      };

      services[$scope.settings.service][$scope.settings.method]().then(function(data) {
        $scope.content = _.chain(data || []).sortBy($scope.settings.sort).map(function(item) {
          return {
            code: item.code,
            title: item[$scope.settings.title]
          };
        }).value();
        if ($scope.settings.reverseSort) {
          $scope.content = $scope.content.reverse();
        }
      });
    }
  });
