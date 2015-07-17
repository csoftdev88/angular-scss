'use strict';

angular.module('mobius.controllers.common.content', [])

  .controller('ContentCtr', function($scope, propertyService, contentService,
         locationService, $state, _) {

    // We are using different methods for getting the data
    // from the server according to content type. Also, menu
    // items are located under different objects.
    var contentTypes = {
      'hotels': {
        'service': 'propertyService',
        'method': 'getAll',
        'detailState': 'hotel',
        'listState': 'hotels',
        'paramName': 'propertySlug',
        'title': 'nameShort',
        'sort': 'nameShort',
        'reverseSort': false,
        'slug': true,
        'fallback': {
          'maxItems': 5,
          'service': 'locationService',
          'method': 'getRegions',
          'detailState': 'hotels',
          'listState': 'hotels',
          'paramName': 'regionCode',
          'title': 'nameShort',
          'sort': 'nameShort',
          'reverseSort': false
        }
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
        'subtitle': 'subtitle',
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
      contentService: contentService,
      locationService: locationService
    };

    $scope.settings = contentTypes[$scope.item];

    function processSettings() {
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
        var content = data || [];
        if ($scope.settings.fallback && $scope.settings.fallback.maxItems < content.length) {
          $scope.settings = $scope.settings.fallback;
          processSettings();
        } else {
          $scope.content = _.chain(content).sortBy($scope.settings.sort).map(function(item) {
            return {
              code: $scope.settings.slug? item.meta.slug : item.code,
              title: item[$scope.settings.title],
              subtitle: item[$scope.settings.subtitle]
            };
          }).value();
          if ($scope.settings.reverseSort) {
            $scope.content = $scope.content.reverse();
          }
        }
      });
    }

    if ($scope.settings) {
      processSettings();
    }
  });
