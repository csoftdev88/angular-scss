'use strict';
/*
* This a generic controller for rates filtering, selection
*/
angular.module('mobius.controllers.common.rates', [])

.controller( 'RatesCtrl', function($scope, _, filtersService) {

  var EVENT_RATE_FILTER_REMOVED = 'notification-rate-filter-removed';

  $scope.rates = {
    // all - full rate list from the server
    // selectedRate - user selected option
    // defaultRate - rate specifyed in config
    onRateChanged: function(){
      //updateRateFilteringInfo($scope.rates.selectedRate);
      if(_.isFunction($scope.onRateChanged)){
        $scope.onRateChanged($scope.rates.selectedRate);
      }
    }
  };

  // Getting rates
  filtersService.getProducts(true).then(function(data) {
    $scope.rates.all = data || [];

    // Finding default rate product
    filtersService.getBestRateProduct().then(function(product){
      $scope.defaultRate = _.find(data, {id: product.id});
    });
  });

  // Updating notification bar
  //function updateRateFilteringInfo(rate){
  //  notificationService.show('You are filtering by: ' + rate.name, EVENT_RATE_FILTER_REMOVED);
  //}

  $scope.$on(EVENT_RATE_FILTER_REMOVED, function(){
    // Rate filter is removed - setting to default
    $scope.rates.selectedRate = null;

    //if(_.isFunction($scope.onRateChanged)){
    //  $scope.onRateChanged(null);
    //}
  });
});
