'use strict';

/**
 * Service to filter offers
 */
(function() {

  angular
    .module('mobiusApp.services.offers', [])
    .service('offers', Offers);

  function Offers(contentService, $log, _) {

    var self = this;

    self.getAvailableFeatured = function (max) {
      return contentService.getOffers()
        .then(function (offers) {
          //Remove offers that have expired
          var today = new Date();
          offers = _.reject(offers, function(offer) {
            return new Date(offer.expirationDate) < today;
          });
          // Only get featured offers
          offers = _.reject(offers, function (offer) {
            return offer.featured;
          });
          if (max) {
            return _.first(offers, max);
          }
          return offers;
        });
    };
  }

}());
