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
    return Settings.API.useEcommerceDataLayer && $window.dataLayer;
  }

  function setUserId(userId){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      'userId' : userId,
      'event' : 'authentication'
    });
  }

  // Trackers
  // https://developers.google.com/tag-manager/enhanced-ecommerce#product-impressions
  function trackProductImpressions(products){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      currencyCode: stateService.getCurrentCurrency().symbol,
      ecommerce: {
        impressions: products
      }
    });
  }

  function trackProductClick(product){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      event: 'productClick',
      ecommerce: {
        click: {
          products: [product]
        }
      }
    });
  }

  function trackProductsDetailsView(products){
    if(!isDataLayerActive()){
      return;
    }

    getDataLayer().push({
      ecommerce: {
        detail: {
          products: products
        }
      }
    });
  }

  // Public methods
  return {
    setUserId: setUserId,
    trackProductImpressions: trackProductImpressions,
    trackProductClick: trackProductClick,
    trackProductsDetailsView: trackProductsDetailsView
  };
});
