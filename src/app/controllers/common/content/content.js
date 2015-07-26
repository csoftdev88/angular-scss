'use strict';

angular.module('mobius.controllers.common.content', [])

  .controller('ContentCtr', function($scope, preloaderFactory, propertyService, contentService,
         locationService, bookingService, $state, _) {

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
        'reverseSort': true,
        'slug': true
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
        'reverseSort': true,
        'slug': true
      },
      'about': {
        'service': 'contentService',
        'method': 'getAbout',
        'detailState': 'aboutUs',
        'listState': 'aboutUs',
        'paramName': 'code',
        'title': 'title',
        'sort': 'prio',
        'reverseSort': true,
        'slug': true
      }
    };

    var services = {
      propertyService: propertyService,
      contentService: contentService,
      locationService: locationService
    };

    $scope.settings = contentTypes[$scope.item];

    // Getting the details from booking widget
    var bookingParams = bookingService.getAPIParams(true);

    // Loading hotels
    var hotelsPromise = propertyService.getAll(bookingParams).then(function(hotels){
      $scope.hotels = hotels || [];
    });

    preloaderFactory(hotelsPromise);

    function findPropertyBySlug(value) {
      var obj;
      if ($scope.hotels instanceof Array) {
        obj = _.find($scope.hotels, function (item) {
          return item && item.meta &&
            item.meta.slug && item.meta.slug === value;
        });
      }
      return obj;
    }

    function createParamsObject(code) {
      var params = {};
      params[$scope.settings.paramName] = code;
      preprocessParams(code, params);
      return params;
    }

    function preprocessParams(code, params) {
      //if hotel slug then need to update property param
      if (contentTypes.hotels.paramName === $scope.settings.paramName && code) {
        var property = findPropertyBySlug(code);
        params.property = property ? property.code : null;
      }
    }

    $scope.getStateHref = function(code){
      if(!$scope.settings){
        return null;
      }
      var params = createParamsObject(code);
      var link = $state.href(code?$scope.settings.detailState:$scope.settings.listState, params);
      return (link && link.substr(-1) === '/') ? link.slice(0,-1) : link;
    };

    $scope.goToState = function($event, code){
      if(!$scope.settings){
        return null;
      }
      var params = createParamsObject(code);
      $event.preventDefault();
      $event.stopPropagation();
      $state.go(code?$scope.settings.detailState:$scope.settings.listState, params, {reload: true});
    };

    function processSettings() {
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
