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
        'title': 'nameShort'
      },
      'news': {
        'service': 'contentService',
        'method': 'getNews',
        'detailState': 'news',
        'listState': 'news',
        'paramName': 'code',
        'title': 'title'
      },
      'offers': {
        'service': 'contentService',
        'method': 'getOffers',
        'detailState': 'offers',
        'listState': 'offers',
        'paramName': 'code',
        'title': 'title'
      },
      'about': {
        'service': 'contentService',
        'method': 'getAbout',
        'detailState': 'aboutUs',
        'listState': 'aboutUs',
        'paramName': 'code',
        'title': 'title'
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
        $scope.content = _.map(data || [], function(item) {
          return {
            code: item.code,
            title: item[$scope.settings.title]
          };
        });
      });
    }
  });
