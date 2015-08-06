'use strict';
/*
 * This service contains reusable methods for adverts
 */
angular.module('mobiusApp.services.adverts', [])
  .service( 'advertsService',  function($state, $rootScope, $timeout, contentService, _,
      bookingService) {

    function advertClick(link) {
      switch(link.type) {
      case 'news':
        navigateToState('news', link.code);

        break;
      case 'offers':
        contentService.getOffers().then(function (offers) {
          var code = bookingService.getCodeFromSlug(link.code);
          var selectedOfferIndex = _.findIndex(offers, {code: code});
          var offer = offers[selectedOfferIndex];
          navigateToState('offers',link.code);

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
        navigateToState('aboutUs', link.code);
        break;
      default:
        window.open(link.uri, '_blank');
      }
    }

    function navigateToState(stateName, code){
      // Checking if user is already on that state
      if($state.current.name === stateName && $state.params.code === code){
        return;
      }

      $state.go(stateName, {
        code: code
      });
    }

    // Public methods
    return {
      advertClick: advertClick
    };
  });
