'use strict';

angular.module('mobiusApp.directives.isoCountryOptions', [])

  .directive('isoCountryOptions', function() {

    return {
      restrict: 'A',
      templateUrl: 'directives/isoCountryOptions/isoCountryOptions.html'
    };
  });
