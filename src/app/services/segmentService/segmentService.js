'use strict';
/*
* Service for Segment event tracking
*/
angular.module('mobiusApp.services.segment', [])
.service('segmentService',  function($window, Settings) {
  function getSegment(){
    return $window.analytics;
  }

  function isSegmentActive(){
    return Settings.segment.enable && $window.analytics;
  }

  function identifyUser(userData){
    if(!isSegmentActive() || !Settings.segment.writeKey){
      return;
    }

    userData.name = userData.firstName + ' ' + userData.lastName;

    getSegment().identify(userData.id.toString(), userData);
  }

  /*function trackProductsPurchase(products, actionField, derbysoftInfo, stayLength, bookingWindow){
    if(!isSegmentActive()){
      return;
    }

    // delete tax property from products array if present as not required at this step but used in
    for (var p in products){
      if(products[p].tax){
        delete products[p].tax;
      }
    }

    var dataLayerInfo = {
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
  }*/

  // Public methods
  return {
    identifyUser: identifyUser
    //trackProductsPurchase: trackProductsPurchase
  };
});
