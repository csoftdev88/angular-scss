'use strict';
/*
* This a generic controller for rates filtering, selection
*/
angular.module('mobius.controllers.common.rates', [])

.controller( 'RatesCtrl', function($scope, $rootScope, $state, $stateParams, _,
    filtersService, notificationService) {

  var EVENT_RATE_FILTER_REMOVED = 'notification-rate-filter-removed';

  $scope.rates = {
    // all - full rate list from the server
    // selectedRate - user selected option or the one presented in
    // the URL
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

    updateRateNotification();
  });

  function updateRateNotification(){
        // Checking if notification message should be displayed
    if(!$stateParams.rate){
      return;
    }

    // Finding the corresponding rate
    var currentRate = _.find($scope.rates.all, {id: parseInt($stateParams.rate, 10)});
    if(currentRate){
      $scope.rates.selectedRate = currentRate;

      if($state.current.data && $state.current.data.hasRateNotification){
        notificationService.show('You have selected: ' + currentRate.name, EVENT_RATE_FILTER_REMOVED, true);
      }
    }
  }

  $rootScope.$on(EVENT_RATE_FILTER_REMOVED, function(){
    var stateParams = $stateParams;
    stateParams.rate = null;
    // Updating current state excluding rate
    $state.go($state.current.name, stateParams);
  });
});
