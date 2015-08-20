'use strict';

/**
 * Filter for content filtering.
 */

angular.module('mobiusApp.filters.content', [])

  .filter('filteredContent', function() {
    return function(input) {
      var inputArray = [];

      for (var item in input) {
        inputArray.push(input[item]);
      }

      return inputArray.filter(function(contentItem) { return contentItem.filtered; });
    };
  });
