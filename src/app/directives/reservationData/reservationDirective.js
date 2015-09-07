'use strict';
/*
*  Common controller for reservation directives
*/
angular.module('mobius.controllers.reservation.directive', [])

.controller( 'ReservationDirectiveCtrl', function($scope, $controller, $state, _) {
  function getCount(prop){
    if(!$scope.reservation){
      return 0;
    }

    return _.reduce(
      _.map($scope.reservation.rooms, function(room){
        return room[prop];
      }), function(t, n){
        return t + n;
      });
  }

  $scope.getAdultsCount = function(){
    return getCount('adults');
  };

  $scope.getChildrenCount = function(){
    return getCount('children');
  };

  $scope.getPrice = function(){
    return getCount('price');
  };

  $scope.getTax = function(){
    return getCount('tax');
  };

  $scope.getPriceAfterTax = function(){
    return getCount('priceAfterTax');
  };

  $scope.$state = $state;
});
