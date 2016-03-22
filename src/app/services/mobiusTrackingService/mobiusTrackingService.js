'use strict';
/*
 * This service handles mobius rate search and product purchase tracking
 */
angular.module('mobiusApp.services.mobiusTrackingService', [])
  .service( 'mobiusTrackingService',  function(Settings, userObject, sessionDataService, _, $rootScope, apiService, $state) {

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
            'email': '',
            'firstName': 'Anonymous',
            'gender': '',
            'lastName': 'Anonymous',
            'loyaltyMember': false,
            'phone': '',
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
        defaultData.customer.gender = userObject.gender || '';
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
      defaultData.noOfAdults = parseInt(bookingParams.adults, 10);
      defaultData.noOfChildren = parseInt(bookingParams.children, 10);
      defaultData.groupCode = bookingParams.groupCode || '';
      defaultData.corpCode = bookingParams.corpCode || '';
      defaultData.promoCode = bookingParams.promoCode || '';

    }
    

    function trackSearch(bookingParams, chainData, propertyData, products, room, rateSorting){

      if(!Settings.API.mobiusTracking.enable || $state.includes('reservation')){
        return;
      }

      //set default data
      setDefaultData(bookingParams, chainData);

      //copy default data
      var postData = angular.copy(defaultData);

      //property star rating
      postData.starRating = propertyData.rating;

      //rate filter
      postData.rateFilter = rateSorting.name || '';

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
      postData.results = searchData;
      
      apiService.post(apiService.getFullURL('mobiusTracking.search'), postData).then(function(){
      }, function(err){
        console.log('Mobius search tracking error: ' + angular.toJson(err));
      });
      
    }

    function trackPurchase(bookingParams, chainData, propertyData, products, rooms, reservationData, priceData){
      
      if(!Settings.API.mobiusTracking.enable){
        return;
      }

      //set default data
      setDefaultData(bookingParams, chainData);

      //copy default data
      var postData = angular.copy(defaultData);

      //property star rating
      postData.starRating = propertyData.rating;

      //Policies
      var policies = [];
      _.each(rooms[0]._selectedProduct.policies, function(val, key) {
        var policy = {
          'type': key,
          'value': val
        };
        policies.push(policy);
      });

      //product
      postData.checkIn = bookingParams.from;
      postData.checkOut = bookingParams.to;
      postData.product = {
        'code': products[0].code,
        'name': products[0].name,
        'rateType': products[0].category,
        'policies': policies
      };

      //payment details
      postData.payment = {
        'type': reservationData.paymentInfo.paymentMethod === 'cc' ? reservationData.paymentInfo.ccPayment.typeCode : reservationData.paymentInfo.paymentMethod,
        'currency': $rootScope.currencyCode,
        'totalPreTax': priceData.beforeTax,
        'totalTax': priceData.afterTax
      };
      
      //Loop through each room then each night
      postData.nights = [];
      var nightObj = {};
      _.each(rooms, function(room){

        _.each(room._selectedProduct.price.breakdowns, function(night){
          nightObj = {
            'date': night.date,
            'rate': {
              'currency': $rootScope.currencyCode,
              'amount': night.totalAfterTax
            },
            'room': {
              'code': room.code,
              'type': room.name
            }
          };
        });
      });
      postData.nights.push(nightObj);

      apiService.post(apiService.getFullURL('mobiusTracking.purchase'), postData).then(function(){
      }, function(err){
        console.log('Mobius purchase tracking error: ' + angular.toJson(err));
      });
      
      
    }

    // Public methods
    return {
      trackSearch: trackSearch,
      trackPurchase: trackPurchase
    };
  });
