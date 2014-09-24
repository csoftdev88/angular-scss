'use strict';

angular.module('mobiusApp.directives.best.offers', [])

.directive('bestOffers', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/bestOffers/bestOffers.html',

    // Widget logic goes here
    link: function(){
      //scope, elem, attrs
    }
  };
});
