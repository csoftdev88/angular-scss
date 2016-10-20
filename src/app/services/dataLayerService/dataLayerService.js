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
    return Settings.googleTagManager.enable && $window.dataLayer;
  }

  function setUserId(userId){
    if(!isDataLayerActive() || !Settings.googleTagManager.trackUserId){
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
    //add position value to all product objects
    for (var p in products){
      products[p].position=(p*1+1);
    }

    getDataLayer().push({
      'currencyCode': stateService.getCurrentCurrency().code,
      'event': 'productImpressions',
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
      'event': 'productDetailsView',
      'ecommerce': {
        'detail': {
          'products': products
        }
      }
    });
  }

  function trackProductsCheckout(products, stepNum){
    if(!isDataLayerActive()){
      return;
    }
    getDataLayer().push({
      'event': 'checkout',
      'ecommerce': {
        'checkout': {
          'actionField': {'step': stepNum},
          'products': products
        }
      }
    });
  }

  function trackProductsPurchase(products, actionField, derbysoftInfo, stayLength, bookingWindow){
    if(!isDataLayerActive()){
      return;
    }

    // delete tax property from products array if present as not required at this step but used in
    for (var p in products){
      if(products[p].tax){
        delete products[p].tax;
      }
    }

    var dataLayerInfo = {
      'event': 'purchaseConfirmation',
      'ecommerce': {
        'purchase': {
          'actionField': actionField,
          'products': products,
          'stayLength': stayLength ? stayLength : null,
          'bookingWindow': bookingWindow ? bookingWindow : null
        }
      }
    };

    if(derbysoftInfo){
      dataLayerInfo.ecommerce.purchase.derbysoftInfo = derbysoftInfo;
    }

    console.log(dataLayerInfo);

    getDataLayer().push(dataLayerInfo);
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
