'use strict';

angular.module('mobius.controllers.common.content', [])

.controller('ContentCtr', function($scope, $rootScope, propertyService, contentService,
 locationService, bookingService, $q, $state, $timeout, _, Settings) {

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
      'propertyState': 'propertyOffers',
      'paramName': 'code',
      'propertyParamName': 'propertySlug',
      'title': 'title',
      'subtitle': 'subtitle',
      'sort': 'prio',
      'reverseSort': true,
      'keepProperty': Settings.UI.menu.offersKeepProperty,
      'limitToPropertyCodes': true,
      'chainWideOnly': Settings.UI.menu.offerlimitedToChainWide,
      'maxItemsCount': Settings.UI.menu.maxOffersCount,
      'slug': true
    },
    'deals': {
      'service': 'contentService',
      'method': 'getOffers',
      'detailState': 'hotDeals',
      'listState': 'hotDeals',
      'propertyState': 'propertyOffers',
      'paramName': 'code',
      'propertyParamName': 'propertySlug',
      'title': 'title',
      'subtitle': 'subtitle',
      'sort': 'prio',
      'reverseSort': true,
      'keepProperty': true,
      'limitToPropertyCodes': true,
      'singlePropertyOnly': true,
      'maxItemsCount': Settings.UI.menu.maxOffersCount,
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
      'maxItemsCount': Settings.UI.menu.maxAboutCount,
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
  //var bookingParams = bookingService.getAPIParams(true);

  // Loading hotels
  //var hotelsPromise = services.propertyService.getAll(bookingParams).then(function(hotels){
  var hotelsPromise = services.propertyService.getAll().then(function(hotels){
    $scope.hotels = hotels || [];
    $scope.city = getCityOfContent();
  });

  // Loading offers
  var offers = services.contentService.getOffers().then(function(offers){
    $scope.offers = offers || [];
  });

  $q.all([hotelsPromise, offers]).then(function(){
    if($scope.settings){
      processSettings();
    }
  });

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
    }else if(!$scope.settings.keepProperty){
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
        var availability = _.find($scope.offers[selectedOfferIndex].offerAvailability, function(availability){
          return availability.property === $state.params.property;
        });
        stateParams.promoCode = availability && availability.promoCode ? availability.promoCode : $scope.offers[selectedOfferIndex].promoCode;
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

    var toState = code ? $scope.settings.detailState : $scope.settings.listState;

    if($state.params.property && $scope.settings.propertyState && $scope.settings.keepProperty){
      params[$scope.settings.propertyParamName] = $state.params.propertySlug;
      toState = $scope.settings.propertyState;
    }

    $state.go(toState, params, {reload: true});
  };

  function processSettings() {
    services[$scope.settings.service][$scope.settings.method]().then(function(data) {



      data = _.reject(data, function(item){

        //Hot Deals vs Special Offers - Hot Deals are offers specific to a single property, if enabled Special Offers are only offers that have multiple properties availability
        /*
        if($scope.settings.singlePropertyOnly && item.offerAvailability && item.offerAvailability.length > 1 || $scope.settings.multiPropertyOnly && item.offerAvailability && item.offerAvailability.length < 2){
          return true;
        }
        */

        if($scope.settings.chainWideOnly){
          return item.showAtChainLevel === false;
        }


        //If on a property, remove items that have showOnMenu = false in offerAvailability
        if($state.params.property){
          var availability = _.find(item.offerAvailability, function(availability){
            return availability.property === $state.params.property;
          });

          if(availability){
            return availability.showOnMenu === false;
          }
        }

        //If at chain level, remove items that have showOnMenu = false in main settings
        if(item.showAtChainLevel && !$state.params.property){
          return item.showOnMenu === false;
        }

      });
      var content = data || [];
      if ($scope.settings.fallback && $scope.settings.fallback.maxItems < content.length) {
        $scope.settings = $scope.settings.fallback;
        processSettings();
      } else {

        if($scope.settings.limitToPropertyCodes && $scope.hotels && !bookingService.getParams().property){
          content = _.where(content, {showAtChainLevel: true});
        }

        $scope.content = _.chain(content).sortBy($scope.settings.sort).map(function(item) {
          var availability = _.find(item.offerAvailability, function(availability){
            return availability.property === $state.params.property;
          });

          var availabilitySlug = availability && availability.slug && availability.slug !== '' ? availability.slug : null;

          return {
            code: $scope.settings.slug ? availabilitySlug || item.meta.slug : item.code,
            title: availability && availability[$scope.settings.title] && availability[$scope.settings.title] !== '' ? availability[$scope.settings.title] : item[$scope.settings.title],
            subtitle: availability && availability[$scope.settings.subtitle] && availability[$scope.settings.subtitle] !== '' ? availability[$scope.settings.subtitle] : item[$scope.settings.subtitle],
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
      var availability = _.find(item.offerAvailability, function(availability){
        return availability.property === $state.params.property;
      });
      return availability !== undefined;
    } else {
      return true;
    }
  }
});
