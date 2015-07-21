'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.scroll', [])
  .service( 'scrollService',  function($window, $location, $state) {

    // scrollTo() with no params will default to breadcrumbs
    var scrollTo = function(target, offset) {

      if($state.current.name === 'home'){
        angular.element('html, body').scrollTop(0);
        return;
      }

      $window._.defer(function () {
        var $item = target ? angular.element(target) : angular.element('breadcrumbs');

        //TODO make it so we can add scrollTo param to url and scroll to it when data is loaded
        if($location.search().scrollTo){
          //offset = -20;
          //$item = $location.search().scrollTo.indexOf('.') === -1 ? angular.element('#' + $location.search().scrollTo) : angular.element($location.search().scrollTo);
        }

        if($item.length) {
          offset = offset || -angular.element('#main-header').height();
          angular.element('html, body').stop().animate({
            scrollTop: $item.offset().top + offset
          }, 1000);
        }

        /*
        angular.element($window).bind('scroll', function() {
          angular.element('html, body').finish();
        });
*/

      });
    };

    // Public methods
    return {
      scrollTo: scrollTo
    };

  });
