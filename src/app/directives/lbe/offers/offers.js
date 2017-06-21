'use strict';

/**
 * Directive to encapsulate the loyalty questions widget used in the LBE
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.offers', ['mobiusApp.services.offers'])
    .directive('offers', ['Settings', '$log', 'offers', '$state', Offers]);

  function Offers(Settings, $log, offers, $state) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/offers/offers.html',
      link: function (scope) {
        var config = Settings.UI.offersWidget;
        if (!config) {
          $log.warn('No config for the questionnaire was provided!');
        }
        scope.offers = [];
        offers.getAvailableFeatured(config.numOffers)
          .then(function (offers) {
            scope.offers = offers;
          });

        scope.gotoOffer = function (offer) {
          $state.go('offers', { code: offer.meta.slug });
        };
      }
    };
  }
}());

