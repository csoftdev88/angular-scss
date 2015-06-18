'use strict';

angular.module('mobiusApp.directives.hotels', [])

// TODO: Start using ng-min
.directive('hotels', ['$state', 'filtersService', 'bookingService',
  'propertyService', 'preloaderFactory', '_', 'user', 'locationService',
  '$q', 'modalService',
  function($state, filtersService, bookingService, propertyService,
    preloaderFactory, _, user, locationService, $q, modalService){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
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

      scope.view = 'tiles';
      scope.minStars = 0;
      scope.maxStars = 5;
      scope.isUserLoggedIn = user.isLoggedIn;

      function getProperties(params){
        // Loading hotels
        var hotelsPromise = propertyService.getAll(params).then(function(hotels){
          // Now API always returns full list of hotels, that will change in the future. Uncomment the line below to test future behaviour
          // hotels = undefined;
          scope.hotels = hotels || [];

          scope.minPrice = _.chain(scope.hotels).pluck('priceFrom').min();
          scope.maxPrice = _.chain(scope.hotels).pluck('priceFrom').max();
          scope.minSelectedPrice = scope.minPrice;
          scope.maxSelectedPrice = scope.maxPrice;
        });
        // Loading locations
        var locationsPromise = locationService.getLocations().then(function(locations){
          scope.locations = locations || [];
          scope.locations.unshift({nameShort: 'All Locations'});
        });

        preloaderFactory($q.all([hotelsPromise, locationsPromise]));
      }

      scope.navigateToHotel = function(propertyCode){
        $state.go('hotel', {propertyCode: propertyCode});
      };

      scope.loadLocation = function() {
        if(scope.location && scope.location.code) {
          preloaderFactory(locationService.getLocation(scope.location.code).then(function(location) {
            scope.locationDetails = location;
            scope.openGallery = modalService.openGallery.bind(modalService, location.images);
          }));
        } else {
          scope.locationDetails = null;
        }
      };

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

      scope.hotelFilter = function(hotel) {
        return (
          (scope.minSelectedPrice <= hotel.priceFrom && hotel.priceFrom <= scope.maxSelectedPrice) &&
          (scope.minStars <= hotel.rating && hotel.rating <= scope.maxStars) &&
          (!scope.location || !scope.location.code || (scope.location.code === hotel.locationCode))
        );
      };
    }
  };
}]);
