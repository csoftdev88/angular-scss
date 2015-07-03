'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.adverts', [])
  .service( 'advertsService',  function($state) {

    var advertClick = function (link) {
      switch(link.type) {
      case 'news':
        $state.go('news', {
          code: link.code
        });
        break;
      case 'offers':
        $state.go('offers', {
          code: link.code
        });
        break;
      case 'about':
        $state.go('aboutUs', {
          code: link.code
        });
        break;
      default:
        window.open(link.uri, '_blank');
      }
    };

    // Public methods
    return {
      advertClick: advertClick
    };
  });
