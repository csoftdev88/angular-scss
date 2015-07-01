'use strict';

angular.module('mobius.controllers.common.price', [])

  .controller('PriceCtr', function($scope, bookingService, $window, perStay) {
    var PP_NIGHT = 'night';
    var PP_STAY = 'stay';

    $scope.PP_NIGHT = PP_NIGHT;
    $scope.PP_STAY = PP_STAY;

    $scope.setPricePer = function(pricePer) {
      if ((pricePer !== PP_NIGHT) && (pricePer !== PP_STAY)) {
        pricePer = PP_NIGHT;
      }
      $scope.pricePer = pricePer;
      perStay.value = pricePer;
    };

    var bookingParams = bookingService.getAPIParams();
    $scope.days = (bookingParams.to && bookingParams.from) ? $window.moment(bookingParams.to).diff(bookingParams.from, 'days') : 0;
    $scope.setPricePer($scope.days > 0 ? perStay.value : PP_NIGHT);
  }).constant('perStay', {});
