'use strict';
/*
 * This service contains reusable methods for page scrolling
 */
angular.module('mobiusApp.services.scroll', [])
  .service( 'scrollService',  function($window, $location, $state) {

    // scrollTo() with no params will default to breadcrumbs
    var scrollTo = function(target, offset) {

      //No scroll if home
      //If url has scrollTo and target is not set let controller handle scrolling when content has loaded
      if($state.current.name === 'home' || $location.search().scrollTo && !target && ($state.current.name === 'hotels' || $state.current.name === 'hotel' || $state.current.name === 'room')){
        angular.element('html, body').scrollTop(0);
        return;
      }

      $window._.defer(function () {

        //Default target to breadcrumbs
        var $item = angular.element('breadcrumbs');
        //If target check if it's a class if not make it an id (hash in url breaks)
        if(target){
          $item = target.indexOf('.') === -1 ? angular.element('#'+target) : angular.element(target);
        }

        if($item.length) {
          //Default offset to half of hero slider
          offset = -(angular.element('#main-header').height() + angular.element('breadcrumbs').height() + offset) || -(angular.element('#main-header').height() + angular.element('hero-slider').height()/2);
          //scroll
          angular.element('html, body').stop().animate({
            scrollTop: $item.offset().top + offset
          }, 500);
        }

      });
    };

    // Public methods
    return {
      scrollTo: scrollTo
    };

  });
