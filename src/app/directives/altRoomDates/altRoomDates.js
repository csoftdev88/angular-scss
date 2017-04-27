'use strict';

angular.module('mobiusApp.directives.room.altRoomDates', [])

  .directive('altRoomDates', function($rootScope, $timeout, $window, $state, bookingService, dataLayerService, _) {
    return {
      restrict: 'E',
      templateUrl: 'directives/altRoomDates/altRoomDates.html',
      scope: {
        dates: '=',
        lengthOfStay: '=',
        selectDates: '='
      },
      replace: false,
      link: function(scope) {
        var bookingParams = bookingService.getAPIParams();
        var propertyCode = bookingParams && bookingParams.propertySlug ? bookingService.getCodeFromSlug(bookingParams.propertySlug) : null;
         
        _.each(scope.dates, function(availability){
          if(availability.available && availability.fullyAvailable){
            availability.params = angular.copy(bookingParams);
            delete availability.params.fromSearch;

            availability.params.from = availability.date;
            availability.params.to = $window.moment(availability.params.from).add(scope.lengthOfStay, 'days').format('YYYY-MM-DD');
            availability.params.dates = availability.params.from + '_' + availability.params.to;
            availability.params.scrollTo = 'jsRooms';
            availability.url = $state.href('hotel', availability.params);
          }
          if(availability.date === bookingParams.from){
            availability.selected = true;
          }
        });

        //Track the display of alt dates
        dataLayerService.trackAltDisplayLoad('Dates');

        scope.availabilityClick = function($event, availability){
          $event.preventDefault();

          //Track the select of an alt date
          dataLayerService.trackAltDisplaySelect('Dates', availability.date, propertyCode, null, availability.priceFrom, null, null);

          if(availability.available && availability.fullyAvailable){
            $state.go($state.current.name, availability.params, {reload: true});
            $timeout(function() {
              $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', availability.params);
            });
          }
        };
      }
    };
  });
