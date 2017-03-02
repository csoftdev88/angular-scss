'use strict';

/**
 * Checkin date formatter filter
 */

angular.module('mobiusApp.filters.byNameOrZip', [])
  .filter('byNameOrZip', function(_) {
    // Just add arguments to your HTML separated by :
    // And add them as parameters here, for example:
    // return function(dataArray, searchTerm, argumentTwo, argumentThree) {
    return function(dataArray, searchTerm, locationLevel) {
      // If no array is given, exit.
      if (!dataArray) {
        return;
      }
      // If no search term exists, return the array unfiltered.
      else if (!searchTerm) {
        return dataArray;
      }
      // Otherwise, continue.
      else {
        var term = searchTerm.toLowerCase();
        if (!locationLevel) {
          // Convert filter text to lower case.

          // Return the array and filter it by looking for any occurrences of the search term in each items id or name.
          return dataArray.filter(function(item) {
            var termInShortName = item.nameShort.toLowerCase().indexOf(term) > -1;
            var termInZip = item.zip.toLowerCase().indexOf(term) > -1;
            return termInShortName || termInZip;
          });
        } else {
          var propertyArray = dataArray.properties;
          if (propertyArray) {
            _.each(propertyArray, function(property) {
              return property.filter(function(item) {
                var termInShortName = item.nameShort.toLowerCase().indexOf(term) > -1;
                var termInZip = item.zip.toLowerCase().indexOf(term) > -1;
                return termInShortName || termInZip;
              });
            });
          }
        }
      }
    };
  });
