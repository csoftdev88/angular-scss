'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.scroll', [])
  .service( 'scrollService',  function($window, $location, $state) {

    // scrollTo() with no params will default to breadcrumbs
    var scrollTo = function(target, offset) {

      console.log('$state.current.name: ' + $state.current.name);

      if($state.current.name === 'home'){
        angular.element('html, body').scrollTop(0);
        return;
      }

      $window._.defer(function () {
        var $item = target ? angular.element(target) : angular.element('breadcrumbs');
        $item = $location.search().scrollTo ? $location.search().scrollTo : $item;
        if($item.length) {
          offset = offset || -angular.element('#main-header').height();
          angular.element('html, body').stop().animate({
            scrollTop: $item.offset().top + offset
          }, 1000);
        }
      });
    };

    // Public methods
    return {
      scrollTo: scrollTo
    };

  });
