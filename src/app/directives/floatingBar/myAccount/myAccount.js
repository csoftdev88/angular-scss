'use strict';

angular.module('mobiusApp.directives.floatingBar.myAccount', [])

  .directive('myAccount', function(loyaltyService){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'directives/floatingBar/myAccount/myAccount.html',

      // Widget logic goes here
      link: function() {
        console.log('loyaltyService.getAll()' + JSON.stringify(loyaltyService.getAll(), null,4));
      }
    };
  });
