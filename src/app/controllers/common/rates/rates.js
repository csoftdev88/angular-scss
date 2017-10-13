'use strict';
/*
* This a generic controller for rates filtering, promoCode notification/selection
*/
angular.module('mobius.controllers.common.rates', [])

.controller( 'RatesCtrl', function($scope, $rootScope, $state, $stateParams, _,
    filtersService, notificationService) {

  var EVENT_EXTRA_FILTER_REMOVED = 'notification-extra-filter-removed';

  $scope.rates = {
    // all - full rate list from the server
    // selectedRate - user selected option or the one presented in
    // the URL
    onRateChanged: function(){
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
    var notificationMessage = '';

    // Finding the corresponding rate
    if($stateParams.rate){
      var currentRate = _.find($scope.rates.all, {id: parseInt($stateParams.rate, 10)});
      if(currentRate){
        $scope.rates.selectedRate = currentRate;

        if($state.current.data && $state.current.data.hasRateNotification){
          notificationMessage = '<span>You have selected: <strong>' + currentRate.name + '</strong> </span>';
        }
      }
    }

    // Promo code
    if($stateParams.promoCode){
      notificationMessage += '<span> Promo code: <strong>' + $stateParams.promoCode + '</strong></span>';
    }else if($stateParams.corpCode){
      notificationMessage += '<span> Corp code: <strong>' + $stateParams.corpCode + '</strong></span>';
    }else if($stateParams.groupCode){
      notificationMessage += '<span> Group code: <strong>' + $stateParams.groupCode + '</strong></span>';
    }

    if(notificationMessage !== ''){
      notificationService.show(notificationMessage, EVENT_EXTRA_FILTER_REMOVED, true);
    }
  }

  var removeExtraFilterHandler = $rootScope.$on(EVENT_EXTRA_FILTER_REMOVED, function() {
    var stateParams = $stateParams;
    stateParams.rate = null;
    stateParams.promoCode = null;
    stateParams.corpCode = null;
    stateParams.groupCode = null;
    // Updating current state excluding rate
    $state.go($state.current.name, stateParams);
  });

  $scope.$on('$destroy', function () {
    removeExtraFilterHandler();
  });
});
