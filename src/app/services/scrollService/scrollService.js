'use strict';
/*
 * This service contains reusable methods for page scrolling
 */
angular.module('mobiusApp.services.scroll', [])
  .service( 'scrollService',  function($window, $document, $location, $state) {

    // scrollTo() with no params will default to top of content
    function scrollTo(target, offset) {
      //safari/chrome on mac don't like animating body,html
      var safari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
      var chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      var toAnimate = safari || chrome ? angular.element('body') : angular.element('html, body');

      //No scroll if home
      //If url has scrollTo and target is not set let controller handle scrolling when content has loaded
      if($state.current.name === 'home' || $location.search().scrollTo && !target && ($state.current.name === 'hotel' || $state.current.name === 'room')){
        angular.element('html, body').scrollTop(0);
        return;
      }

      $window._.defer(function () {
        //Default target to top of content
        var $item = angular.element('main');
        //If target check if it's a class if not make it an id (hash in url breaks)
        if(target){
          $item = target.indexOf('.') === -1 ? angular.element('#'+target) : angular.element(target);
        }

        if($item.length) {
          //Default offset to half of hero slider
          // TODO: Refactor, fix magic numbers
          var $offset = offset ? -(angular.element('#main-header').height() + angular.element('breadcrumbs').height() + offset) : -(angular.element('#main-header').height() + angular.element('hero-slider').height()/2 + 40);
          //scroll
          toAnimate.stop().animate({
            scrollTop: $item.offset().top + $offset
          }, 500);
        }
      });
    }

    function getHeaderHeight(hasHeroSlider){
      return angular.element('#main-header').height() + angular.element('breadcrumbs').height() + hasHeroSlider?angular.element('hero-slider').height():0;
    }

    function getScrollTop(){
      return ($window.pageYOffset || $document.scrollTop)  - ($document.clientTop || 0);
    }

    // Public methods
    return {
      scrollTo: scrollTo,
      getScrollTop: getScrollTop,
      getHeaderHeight: getHeaderHeight
    };
  });
