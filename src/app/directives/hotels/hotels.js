'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'filtersService', 'bookingService',
  'propertyService', 'preloaderFactory', '_', 'user',
  '$q', 'modalService', '$controller', 'breadcrumbsService', 'scrollService', '$location', '$timeout',
  function($state, filtersService, bookingService, propertyService,
    preloaderFactory, _, user, $q, modalService, $controller,
    breadcrumbsService, scrollService, $location, $timeout){

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
      breadcrumbsService.clear().addBreadCrumb('Hotel Search');

      $controller('SSOCtrl', {$scope: scope});
      $controller('MainCtrl', {$scope: scope});
      $controller('PreferenceCtrl', {$scope: scope});
      $controller('RatesCtrl', {$scope: scope});
      $controller('SSOCtrl', {$scope: scope});

      scope.sortingOptions = [
        {
          name: 'Availability',
          prop: 'available',
          value: true
        },
        {
          name: 'Price Low to High',
          prop: 'priceFrom',
          value: false
        },
        {
          name: 'Price High to Low',
          prop: 'priceFrom',
          value: true
        },
        {
          name: 'Star Rating Low to High',
          prop: 'rating',
          value: false
        },
        {
          name: 'Star Rating High to Low',
          prop: 'rating',
          value: true
        },
        {
          name: 'A - Z',
          prop: 'nameShort',
          value: false
        },
        {
          name: 'Z - A',
          prop: 'nameShort',
          value: true
        }
      ];

      scope.preference.setDefault('hotels-view-mode', 'tiles');

      scope.minStars = 0;
      scope.maxStars = 5;
      scope.minRating = 0;
      scope.maxRating = 5;


      function getProperties(params){
        // Loading hotels
        var hotelsPromise = propertyService.getAll(params).then(function(hotels){
          // Now API always returns full list of hotels, that will change in the future. Uncomment the line below to test future behaviour
          // hotels = undefined;
          scope.hotels = hotels || [];

          scope.minPrice = Math.floor(_.chain(scope.hotels).pluck('priceFrom').min());
          scope.maxPrice = Math.ceil(_.chain(scope.hotels).pluck('priceFrom').max());
          scope.minSelectedPrice = scope.minPrice;
          scope.maxSelectedPrice = scope.maxPrice;

          //scroll to element if set in url scrollTo param
          var scrollToValue = $location.search().scrollTo || null;
          if (scrollToValue) {
            $timeout(function(){
              scrollService.scrollTo(scrollToValue, 20);
            }, 500);
          }
        });

        // Loading locations
        /* var locationsPromise = locationService.getLocations(bookingParams).then(function(locations){
          scope.locations = locations || [];
          scope.locations.unshift({nameShort: 'All Locations'});

          // NOTE: LOCATION FEATURE IS DROPPED
          /*if(bookingParams.locationCode) {
            scope.location = _.find(scope.locations, {code: bookingParams.locationCode});
            if(scope.location) {
              scope.loadLocation();
            }
          }
        });*/
        preloaderFactory(hotelsPromise);
      }

/*
      filtersService.getProducts(true).then(function(data) {
        scope.rates = data || [];
      });

      scope.onRateChange = function(){
        // Server side filtering
        var bookingParams = bookingService.getAPIParams(true);
        bookingParams.productGroupId = scope.selectedRate.id;

        // NOTE: Server side filtering by rate
        getProperties(bookingParams);

        updateRateFilteringInfo(scope.selectedRate);
      };

      // Updating notification bar
      function updateRateFilteringInfo(rate){
        notificationService.show('You are filtering by: ' + rate.name, 'notification-rate-filter-removed');
      }
*/
      // This function invoked from RatesCtrl
      scope.onRateChanged = function(rate){
        var bookingParams = bookingService.getAPIParams(true);

        bookingParams.productGroupId = rate?rate.id:scope.rates.defaultRate.id;
        getProperties(bookingParams);
      };

      scope.navigateToHotel = function(propertySlug){
        // Getting the current hotel
        var selectedHotel = _.find(scope.hotels, function (item) {
          return item && item.meta && item.meta.slug === propertySlug;
        });

        // Getting rate details from RateCtrl
        var stateParams = {
          property: selectedHotel ? selectedHotel.code : null,
          propertySlug: propertySlug,
          rate: (scope.rates && scope.rates.selectedRate)?scope.rates.selectedRate.id:null
        };

        if($state.params && $state.params.hasOwnProperty('fromSearch') && typeof $state.params.fromSearch !== 'undefined') {
          stateParams.scrollTo = 'jsRooms';
        }

        $state.go('hotel', stateParams);
      };

      /*
      scope.loadLocation = function() {
        //if(scope.location && scope.location.code) {
        //  preloaderFactory(locationService.getLocation(scope.location.code).then(function(location) {
        //    scope.locationDetails = location;
        //  }));
        //} else {
        //  scope.locationDetails = null;
        //}
      };*/

      // Getting the details from booking widget
      var bookingParams = bookingService.getAPIParams(true);

      // Default sorting by availability or price
      if(bookingService.APIParamsHasDates()) {
        scope.currentOrder = scope.sortingOptions[0];
      } else {
        scope.currentOrder = scope.sortingOptions[1];
      }

      if(bookingParams.productGroupId){
        getProperties(bookingParams);
      } else{
        // productGroupId is not set by the widget - getting default BAR
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }

          getProperties(bookingParams);
        });
      }

      scope.setMinStars = function(stars) {
        scope.minStars = stars;
        if(scope.maxStars < scope.minStars) {
          scope.maxStars = scope.minStars;
        }
      };

      scope.setMaxStars = function(stars) {
        scope.maxStars = stars;
        if(scope.minStars > scope.maxStars) {
          scope.minStars = scope.maxStars;
        }
      };

      scope.setMinRating = function(rating) {
        scope.minRating = rating;
        if(scope.maxRating < scope.minRating) {
          scope.maxRating = scope.minRating;
        }
      };

      scope.setMaxRating = function(rating) {
        scope.maxRating = rating;
        if(scope.minRating > scope.maxRating) {
          scope.minRating = scope.maxRating;
        }
      };

      scope.hotelFilter = function(hotel) {
        return (
          (scope.minSelectedPrice <= hotel.priceFrom && hotel.priceFrom <= scope.maxSelectedPrice) &&
          (scope.minStars <= hotel.rating && hotel.rating < (scope.maxStars + 1)) &&
          (scope.minRating <= hotel.tripAdvisorRating && hotel.tripAdvisorRating < (scope.maxRating + 1)) &&
          (!scope.location || !scope.location.code || (scope.location.code === hotel.locationCode)) &&
          (!bookingParams.regionCode || (bookingParams.regionCode === hotel.regionCode))
        );
      };

      scope.hasDates = function(){
        return bookingService.APIParamsHasDates();
      };

      scope.openLocationDetail = modalService.openLocationDetail;
    }
  };
}]);
