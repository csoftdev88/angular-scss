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
  function trackProductsImpressions(products, stayLength, bookingWindow){
    if(!isDataLayerActive()){
      return;
    }
    //add position value to all product objects
    for (var p in products){
      products[p].position=(p*1+1);
    }

    getDataLayer().push({
      'event': 'productImpressions',
      'stayLength': stayLength ? stayLength : null,
      'bookingWindow':bookingWindow,
      'ecommerce': {
        'currencyCode': stateService.getCurrentCurrency().code,
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

  function trackAddToCart(product, upsellAccepted, stayLength, bookingWindow){
    if(!isDataLayerActive()){
      return;
    }
    getDataLayer().push({
      'event': 'addToCart',
      'stayLength': stayLength ? stayLength : null,
      'bookingWindow':bookingWindow,
      'ecommerce': {
        'currencyCode': stateService.getCurrentCurrency().code,
        'add': {
          'actionField': {
            'upsellAccepted':upsellAccepted
          },
          'products': [product]
        }
      }
    });
  }

  function trackProductsDetailsView(products, stayLength, bookingWindow){
    if(!isDataLayerActive()){
      return;
    }
    getDataLayer().push({
      'event': 'productDetails',
      'stayLength': stayLength ? stayLength : null,
      'bookingWindow':bookingWindow,
      'ecommerce': {
        'detail': {
          'products': products
        }
      }
    });
  }

  function trackProductsCheckout(products, actionField, stayLength, bookingWindow){
    if(!isDataLayerActive()){
      return;
    }
    getDataLayer().push({
      'event': 'checkout',
      'stayLength': stayLength ? stayLength : null,
      'bookingWindow':bookingWindow,
      'ecommerce': {
        'checkout': {
          'actionField': actionField,
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
      'event':'productPurchase',
      'stayLength': stayLength ? stayLength : null,
      'bookingWindow':bookingWindow,
      'ecommerce': {
        'purchase': {
          'actionField': actionField,
          'products': products
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
      'event': 'productRefund',
      'ecommerce': {
        'refund': {
          'actionField': {
            'id': reservationCode
          }
        }
      }
    });
  }

  function trackAltDisplayNotification(displayType) {
    if (!isDataLayerActive()) {
      return;
    }
    getDataLayer().push({
      'altDisplayType': displayType,
      'event': 'Alternative Display Notification'
    });
  }

  function trackAltDisplayLoad(displayType) {
    if (!isDataLayerActive()) {
      return;
    }
    getDataLayer().push({
      'altDisplayType': displayType,
      'event': 'Alternative Display Load'
    });
  }

  function trackAltDisplaySelect(displayType, date, propertyCode, productCode, price, priceDifference, stayLength) {
    if (!isDataLayerActive()) {
      return;
    }
    getDataLayer().push({
      'altDisplayType': displayType,
      'altDisplayDate': date ? date : null,
      'altDisplayProperty': propertyCode ? propertyCode : null,
      'altDisplayProduct': productCode ? productCode : null,
      'altDisplayPrice': price ? price : null,
      'altDisplayPriceDifference': priceDifference ? priceDifference : null,
      'event': 'Alternative Display Select',
      'stayLength': stayLength ? stayLength : null
    });
  }

  // Public methods
  return {
    setUserId: setUserId,
    trackProductsImpressions: trackProductsImpressions,
    trackProductClick: trackProductClick,
    trackAddToCart: trackAddToCart,
    trackProductsDetailsView: trackProductsDetailsView,
    trackProductsCheckout: trackProductsCheckout,
    trackProductsPurchase: trackProductsPurchase,
    trackReservationRefund: trackReservationRefund,
    trackAltDisplayNotification: trackAltDisplayNotification,
    trackAltDisplayLoad: trackAltDisplayLoad,
    trackAltDisplaySelect: trackAltDisplaySelect
  };
});
