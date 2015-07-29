'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.adverts', [])
  .service( 'advertsService',  function($state, $rootScope, $timeout, contentService, _,
      bookingService) {

    var advertClick = function (link) {
      switch(link.type) {
      case 'news':
        $state.go('news', {
          code: link.code
        });
        break;
      case 'offers':
        contentService.getOffers().then(function (offers) {
          var code = bookingService.getCodeFromSlug(link.code);
          var selectedOfferIndex = _.findIndex(offers, {code: code});
          var offer = offers[selectedOfferIndex];
          $state.go('offers', {
            code: link.code
          });
          if (offer) {
            $timeout(function () {
              $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
                promoCode: offer.promoCode
              });
            }, 0);
          }
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
