'use strict';
/*
* This service for dataLayer/Google tag manager
*/
angular.module('mobiusApp.services.dataLayer', [])
.service( 'dataLayerService',  function($window, Settings, stateService) {
  function getDataLayer(){
    return $window.dataLayer;
  }

  function isDataLayerActive(){
    return Settings.API.ecommerceDataLayer.active && $window.dataLayer;
  }

  function setUserId(userId){
    if(!isDataLayerActive() || !Settings.API.ecommerceDataLayer.trackUserId){
      return;
    }

    getDataLayer().push({
      'userId' : userId,
      'event' : 'authentication'
    });
  }

  // Trackers
  // https://developers.google.com/tag-manager/enhanced-ecommerce#product-impressions
  function trackProductsImpressions(products){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'currencyCode': stateService.getCurrentCurrency().symbol,
      'ecommerce': {
        'impressions': products
      }
    });
  }

  function trackProductClick(product){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'event': 'productClick',
      'ecommerce': {
        'click': {
          'products': [product]
        }
      }
    });
  }

  function trackProductsDetailsView(products){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'ecommerce': {
        'detail': {
          'products': products
        }
      }
    });
  }

  function trackProductsCheckout(products){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'event': 'checkout',
      'ecommerce': {
        'checkout': {
          'products': products
        }
      }
    });
  }

  function trackProductsPurchase(products, actionField){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'ecommerce': {
        'purchase': {
          'actionField': actionField
        },
        'products': products
      }
    });
  }

  function trackReservationRefund(reservationCode){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'ecommerce': {
        'refund': {
          'actionField': {
            'id': reservationCode
          }
        }
      }
    });
  }

  // Public methods
  return {
    setUserId: setUserId,
    trackProductsImpressions: trackProductsImpressions,
    trackProductClick: trackProductClick,
    trackProductsDetailsView: trackProductsDetailsView,
    trackProductsCheckout: trackProductsCheckout,
    trackProductsPurchase: trackProductsPurchase,
    trackReservationRefund: trackReservationRefund
  };
});
