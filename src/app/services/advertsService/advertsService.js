'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.adverts', [])
  .service( 'advertsService',  function($state, $rootScope, $timeout, $window, contentService, _,
      bookingService) {

    function advertClick(link) {
      switch(link.type) {
      case 'news':
        navigateToState('news', link.code);

        break;
      case 'offers':
        contentService.getOffers().then(function (offers) {

          var offerCode = link.code.split('-')[0];
          var offerProperty = link.code.split('-')[1] && link.code.split('-')[1] !== 'CHAIN' ? link.code.split('-')[1] : null;

          var code = bookingService.getCodeFromSlug(offerCode);
          // TODO Use findWhere
          var selectedOfferIndex = _.findIndex(offers, {code: code});
          var offer = offers[selectedOfferIndex];
          navigateToState('offers', offer.meta.slug, offerProperty);

          if (offer) {
            $timeout(function () {
              // TODO: Check other code types
              $rootScope.$broadcast('BOOKING_BAR_PREFILL_DATA', {
                promoCode: offer.promoCode
              });
            }, 0);
          }
        });
        break;
      case 'about':
        navigateToState('aboutUs', link.code);
        break;
      default:
        $window.open(link.uri, '_blank');
      }
    }

    function navigateToState(stateName, code, propertyCode){
      // Checking if user is already on that state
      if($state.current.name === stateName && $state.params.code === code){
        return;
      }

      $state.go(stateName, {
        code: code,
        property: propertyCode
      });
    }

    // Public methods
    return {
      advertClick: advertClick
    };
  });
