'use strict';

angular.module('mobius.controllers.common.price', [])

  // TODO - Refactor, add unit tests
  // In templates - use ng-switch instead of multiple ng-if's
  .controller('PriceCtr', function($scope, bookingService, $window,
      preferenceService, perStay, userPreferenceService) {
    var PP_NIGHT = 'night';
    var PP_STAY = 'stay';
    var PRICE_PER_PREFERENCE_KEY = 'booking_price_per';

    $scope.PP_NIGHT = PP_NIGHT;
    $scope.PP_STAY = PP_STAY;

    $scope.setPricePer = function(pricePer) {
      if ((pricePer !== PP_NIGHT) && (pricePer !== PP_STAY)) {
        pricePer = PP_NIGHT;
      }
      $scope.pricePer = pricePer;
      userPreferenceService.setCookie(PRICE_PER_PREFERENCE_KEY, pricePer);
    };

    $scope.getValuePer = function(value, isProductValue){
      if(value === undefined){
        return null;
      }
      // Product values are already perStay
      if(isProductValue){
        return $scope.pricePer === PP_STAY ? value:$scope.getProductPricePerNight(value);
      }else{
        return $scope.pricePer === PP_NIGHT ? value:value * ($scope.days || 1);
      }
    };

    $scope.getProductPricePerNight = function(value){
      if(value === undefined){
        return null;
      }
      return value / ($scope.days || 1);
    };

    var bookingParams = bookingService.getAPIParams();

    $scope.days = (bookingParams.to && bookingParams.from) ? $window.moment(bookingParams.to).diff(bookingParams.from, 'days') : 0;

    var mobiusUserPreferences = userPreferenceService.getCookie();
    if(mobiusUserPreferences && mobiusUserPreferences[PRICE_PER_PREFERENCE_KEY]){
      $scope.setPricePer($scope.days > 0 && mobiusUserPreferences[PRICE_PER_PREFERENCE_KEY] === PP_STAY ? PP_STAY : PP_NIGHT);
    }
    else{
      $scope.setPricePer(PP_NIGHT);
    }
    

  }).constant('perStay', {});
