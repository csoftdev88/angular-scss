'use strict';

/**
 * Filter for passing a URL through as a trusted resource
 */
angular
  .module('mobiusApp.filters.trustAsUrl', [])
  .filter('trustAsUrl' , function($sce) {
    return function (recordingUrl) {
      return $sce.trustAsResourceUrl(recordingUrl);
    };
  });
