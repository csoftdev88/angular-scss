'use strict';
/*
 * This service handles mobius rate search and product purchase tracking
 */
angular.module('mobiusApp.services.mobiusTrackingService', []).service('mobiusTrackingService', [
  'Settings',
  'userObject',
  'sessionDataService',
  '$window',
  '$rootScope',
  'apiService',
  '$state',
  'channelService',
  '_',
  function (Settings, userObject, sessionDataService, $window, $rootScope, apiService, $state, channelService, _) {
    var defaultData = {
        'channel': {
          'code': _.isString(channelService.getChannel().channelID) ? channelService.getChannel().channelID : channelService.getChannel().channelID.toString(),
          'name': 'Channel_' + channelService.getChannel().name
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
        'promoCode': '',
        'region': {
          'name': '',
          'code': ''
        },
        'property': {
          'name': '',
          'code': ''
        },
        'province': {
          'name': '',
          'code': ''
        }
      };
    function setDefaultData(bookingParams, chainData, propertyData) {
      var sessionCookie = sessionDataService.getCookie();
      if (userObject && userObject.id) {
        //update customer data
        defaultData.customer.corporateCustomer = bookingParams.corpCode && bookingParams.corpCode !== '' ? true : false;
        defaultData.customer.email = userObject.email;
        defaultData.customer.firstName = userObject.firstName || '';
        defaultData.customer.lastName = userObject.lastName || '';
        defaultData.customer.gender = userObject.gender || '';
        defaultData.customer.loyaltyMember = Settings.authType === 'infiniti';
        defaultData.customer.phone = userObject.tel1 || '';
        defaultData.customer.country.code = userObject.iso3 || '';
        defaultData.customer.country.name = userObject.country || '';
        defaultData.customer.uuid = _.isString(userObject.id) ? userObject.id : userObject.id.toString();
      } else {
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
      // This works at least for Sutton
      var localeData = propertyData.locale.split('-');
      //region
      defaultData.region = {
        code: propertyData.regionCode,
        name: localeData[1].trim()
      };
      //province
      //TODO: API needs to return province code, for now we use name toUpperCase as needed by tracking
      defaultData.province = {
        code: localeData[1].trim().split(' ').join('').toUpperCase(),
        name: localeData[1].trim()
      };
      //property
      defaultData.property = {
        code: propertyData.code,
        name: propertyData.nameShort
      };
    }
    function trackSearch(bookingParams, chainData, propertyData, products, room, rateSorting) {
      if (!Settings.API.mobiusTracking.search.enable || $state.includes('reservation') || !products.length) {
        return;
      }
      //set default data
      setDefaultData(bookingParams, chainData, propertyData);
      //copy default data
      var postData = angular.copy(defaultData);
      //property star rating
      postData.starRating = propertyData.rating;
      //rate filter
      postData.rateFilter = rateSorting.name || '';
      var searchData = [];
      //TODO: API needs to return province code, for now we use name toUpperCase as needed by tracking
      var localeData = propertyData.locale.split('-');
      _.each(products, function (product) {
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
              'totalPreTax': product.price.breakdowns[0].totalBaseAfterPricingRules,
              'totalTax': product.price.breakdowns[0].totalAfterTax
            },
            'region': {
              'code': propertyData.regionCode,
              'name': localeData[0].trim()
            },
            'province': {
              'code': localeData[1].trim().split(' ').join('').toUpperCase(),
              'name': localeData[1].trim()
            }
          };
        searchData.push(productData);
      });
      postData.results = searchData;
      //Loop through each room then each night
      postData.nights = [];
      var nightObj = {};
      _.each(products, function (product) {
        _.each(product.price.breakdowns, function (night) {
          nightObj = {
            'date': _.isNumber(night.date) ? new Date(night.date).toISOString() : night.date,
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
      apiService.post(apiService.getFullURL('mobiusTracking.search.url'), postData).then(function () {
      }, function (err) {
        console.log('Mobius search tracking error: ' + angular.toJson(err));
      });
    }
    function trackPurchase(bookingParams, chainData, propertyData, products, rooms, reservationData, priceData) {
      if (!Settings.API.mobiusTracking.purchase.enable) {
        return;
      }
      userObject = _.extend(_.clone(userObject || {}), {
        email: reservationData.guestEmail,
        firstName: reservationData.guestFirstName,
        lastName: reservationData.guestLastName,
        tel1: reservationData.guestPhone,
        iso3: reservationData.guestCountry.code,
        country: reservationData.guestCountry.name,
        id: sessionDataService.getCookie().sessionData.sessionId
      });
      //set default data
      setDefaultData(bookingParams, chainData, propertyData);
      //copy default data
      var postData = angular.copy(defaultData);
      //overriding bookingParams num adults/children
      postData.noOfAdults = 0;
      postData.noOfChildren = 0;
      _.each(reservationData.rooms, function (room) {
        postData.noOfAdults += room.adults;
        postData.noOfChildren += room.children;
      });
      //property star rating
      postData.starRating = propertyData.rating;
      //Policies
      var policies = [];
      _.each(rooms, function (room) {
        _.each(room._selectedProduct.policies, function (val, key) {
          var policy = {
              'type': key
            };
          policies.push(policy);
        });
      });
      //product
      postData.checkIn = bookingParams.from;
      postData.checkOut = bookingParams.to;
      postData.product = {
        'code': '',
        'name': '',
        'rateType': '',
        'policies': policies
      };
      _.each(products, function (product, index) {
        postData.product.code = postData.product.code + (index === 0 ? product.code : ',' + product.code);
        postData.product.name = postData.product.name + (index === 0 ? product.name : ',' + product.name);
        postData.product.rateType = postData.product.rateType + (index === 0 ? product.category : ',' + product.category);
      });
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
      _.each(rooms, function (room) {
        _.each(room._selectedProduct.price.breakdowns, function (night) {
          nightObj = {
            'date': _.isNumber(night.date) ? new Date(night.date).toISOString() : night.date,
            'rate': {
              'currency': $rootScope.currencyCode,
              'amount': night.totalAfterTax
            },
            'room': {
              'code': room.code,
              'type': room.name
            }
          };
          postData.nights.push(nightObj);
        });
      });
      //console.log('trackPurchase: ' + angular.toJson(postData));
      apiService.post(apiService.getFullURL('mobiusTracking.purchase.url'), postData).then(function () {
      }, function (err) {
        console.log('Mobius purchase tracking error: ' + angular.toJson(err));
      });
    }
    // Public methods
    return {
      trackSearch: trackSearch,
      trackPurchase: trackPurchase
    };
  }
]);
