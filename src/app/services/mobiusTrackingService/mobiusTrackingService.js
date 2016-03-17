'use strict';
/*
 * This service handles session data to be sent in API headers
 */
angular.module('mobiusApp.services.mobiusTrackingService', [])
  .service( 'mobiusTrackingService',  function(Settings, userObject, sessionDataService, _, $rootScope) {

    console.log('mobiusTrackingService');
    var defaultData = {
        'channel': {
            'code': Settings.API.headers['Mobius-channelId'],
            'name': 'Channel_' + Settings.API.headers['Mobius-channelId']
        },
        'chain': {
            'code': Settings.API.chainCode,
            'name': ''
        },
        'customer': {
            'corporateCustomer': false,
            'email': null,
            'firstName': 'Anonymous',
            'gender': null,
            'lastName': 'Anonymous',
            'loyaltyMember': false,
            'phone': null,
            'uuid': null,
            'country': {
                'code': 'ZZ',
                'name': 'Unknown territory'
            }
        },
        'uuid': '',
        'noOfAdults': 0,
        'noOfChildren': 0,
        'groupCode': '',
        'corpCode': '',
        'promoCode': ''
    };


    function setDefaultData(bookingParams, chainData){

      var sessionCookie = sessionDataService.getCookie();

      if(userObject && userObject.id){
        //update customer data
        defaultData.customer.corporateCustomer = bookingParams.corpCode && bookingParams.corpCode !== '' ? true : false;
        defaultData.customer.email = userObject.email;
        defaultData.customer.firstName = userObject.firstName;
        defaultData.customer.lastName = userObject.lastName;
        defaultData.customer.gender = userObject.gender || null;
        defaultData.customer.loyaltyMember = Settings.authType === 'infiniti';
        defaultData.customer.phone = userObject.tel1;
        defaultData.customer.country.code = userObject.iso3;
        defaultData.customer.country.name = userObject.country;
        defaultData.customer.uuid = Settings.API.chainCode + '_' + userObject.id;
      }
      else{
        defaultData.customer.uuid = sessionCookie.sessionData.sessionId;
      }

      //uuid
      defaultData.uuid = sessionCookie.sessionData.sessionId;

      //chain
      defaultData.chain.code = chainData.code;
      defaultData.chain.name = chainData.nameShort;

      //booking params
      defaultData.noOfAdults = bookingParams.adults;
      defaultData.noOfChildren = bookingParams.children;
      defaultData.groupCode = bookingParams.groupCode || '';
      defaultData.corpCode = bookingParams.corpCode || '';
      defaultData.promoCode = bookingParams.promoCode || '';

    }
    

    function trackSearch(bookingParams, chainData, propertyData, products, room){
      if(!Settings.API.mobiusTracking.enable){
        return;
      }

      setDefaultData(bookingParams, chainData);

      var searchData = [];
      _.each(products, function(product){
        var productData = {
            'city': propertyData.nameShort,
            'product': {
              'code': product.code,
              'name': product.name
            },
            'room': {
              'code': room.code,
              'type': room.name
            },
            'price': {
              'currency': $rootScope.currencyCode,
              'totalPreTax': product.price.breakdowns[0].totalBase,
              'totalTax': product.price.breakdowns[0].totalAfterTax
            },
            'region': {
              'code': propertyData.regionCode,
              'name': ''
            },
            'province': {
              'code': '',
              'name': ''
            }
          };
          searchData.push(productData);
    
      });
      defaultData.results = searchData;

      console.log('trackPurchase: ' + angular.toJson(defaultData));

      /*
      apiService.post(apiService.getFullURL('mobiusTracking.search'), defaultData).then(function(){
        
      });
      */
    }

    function trackPurchase(bookingParams, chainData){
      if(!Settings.API.mobiusTracking.enable){
        return;
      }

      setDefaultData(bookingParams, chainData);
      /*
      apiService.post(apiService.getFullURL('mobiusTracking.purchase'), defaultData).then(function(){
        
      });
      */
      console.log('trackPurchase: ' + angular.toJson(defaultData));
    }

    // Public methods
    return {
      trackSearch: trackSearch,
      trackPurchase: trackPurchase
    };
  });
