'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService, filtersService, preloaderFactory, locationService, $interval, $window) {

  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.property;
  delete bookingParams.property;

  var localTimeIntervalPromise = null;

  function getAvailableRooms(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var promise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;
        // Updating Hero content images
        if(details.previewImages){
          var heroContent =  details.previewImages.map(function(src){
            return {'image': src};
          });

          $scope.updateHeroContent(heroContent);

          if(angular.isDefined(details.lat) && angular.isDefined(details.long)){
            $scope.position = [details.lat, details.long];
          }
        }

        if(details.locationCode) {
          locationService.getLocation(details.locationCode).then(function(location) {
            $scope.localInfo = location.localInfo;
            var localTime = $window.moment(location.localInfo.time.localTime);
            $scope.localTime = localTime.format('h.mm A');
            localTimeIntervalPromise = $interval(function() {
              $scope.localTime = localTime.add(1, 'minutes').format('h.mm A');
            }, 1000*60);
          });
        }
      });

    preloaderFactory(promise);
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if(bookingParams.productGroupId){
    getAvailableRooms(propertyCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getAvailableRooms(propertyCode, bookingParams);
    });
  }

  $scope.scrollToRooms = function() {
    var $item = angular.element('#hotelRooms');
    angular.element('html, body').animate({
      scrollTop: $item.offset().top
    }, 2000);
  };

  $scope.$on('$destroy', function() {
    if (angular.isDefined(localTimeIntervalPromise)) {
      $interval.cancel(localTimeIntervalPromise);
      localTimeIntervalPromise = undefined;
    }
  });
});
