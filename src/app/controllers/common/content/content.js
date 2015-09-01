'use strict';

angular.module('mobius.controllers.common.content', [])

.controller('ContentCtr', function($scope, $rootScope, preloaderFactory, propertyService, contentService,
 locationService, bookingService, $state, $timeout, _, Settings) {

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
  var hotelsPromise = services.propertyService.getAll(bookingParams).then(function(hotels){
    $scope.hotels = hotels || [];
    $scope.city = getCityOfContent();
  });

  // Loading offers
  var offers = services.contentService.getOffers().then(function(offers){
    $scope.offers = offers || [];
  });

  preloaderFactory(hotelsPromise);
  preloaderFactory(offers);

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
    }else{
      params.property = null;
    }
  }

  function broadcast(code) {
    //clone state object
    var stateParams = angular.copy($state.params);

    //if offer details page
    if (contentTypes.offers.detailState === $scope.settings.detailState &&
      contentTypes.offers.paramName === $scope.settings.paramName && code) {

      code = bookingService.getCodeFromSlug(code);
      var selectedOfferIndex = _.findIndex($scope.offers, {code: code});
      if (selectedOfferIndex >= 0) {
        stateParams.promoCode = $scope.offers[selectedOfferIndex].promoCode;
      }
    }

    $timeout(function(){
      $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', stateParams);
    });
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

    broadcast(code);

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
            subtitle: item[$scope.settings.subtitle],
            filtered: isFiltered(item)
          };
        }).value();
        if ($scope.settings.reverseSort) {
          $scope.content = $scope.content.reverse();
        }
      }
    });
  }

  function needFilter() {
    return Settings.UI.menu.offerSpecificToSelectedProperty && $scope.settings.method === contentTypes.offers.method && $state.params.property;
  }

  function getCityOfContent() {
    var property = findPropertyBySlug($state.params.propertySlug);
    return property ? property.city : null;
  }

  function isFiltered(item) {
    if (needFilter()) {
      var codes = item.limitToPropertyCodes;
      var element = _.find(codes, function (code) {
        return code === $state.params.property;
      });
      return element !== undefined;
    } else {
      return true;
    }
  }

  if ($scope.settings) {
    processSettings();
  }
});
