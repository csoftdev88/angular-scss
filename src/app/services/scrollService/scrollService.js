'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.scroll', [])
  .service( 'scrollService',  function($window) {

    // scrollTo() with no params with default to breadcrumbs
    var scrollTo = function(target, offset) {

      $window._.defer(function () {
        var $item = target ? angular.element(target) : angular.element('breadcrumbs');
        console.log('scrollService : ' + $item.length);
        if($item.length) {
          offset = offset || -angular.element('#main-header').height();
          angular.element('html, body').animate({
            scrollTop: $item.offset().top + offset
          }, 600);
        }
      });
    };

    // Public methods
    return {
      scrollTo: scrollTo
    };

  });
