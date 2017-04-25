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
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var apeironId = Settings.API.mobiusTracking && Settings.API.mobiusTracking[env] ? Settings.API.mobiusTracking[env].id : null;
    var searchEnabled = Settings.API.mobiusTracking && Settings.API.mobiusTracking[env] ? Settings.API.mobiusTracking[env].search.enable : null;
    var purchaseEnabled = Settings.API.mobiusTracking && Settings.API.mobiusTracking[env] ? Settings.API.mobiusTracking[env].purchase.enable : null;
    var mobiusTrackingUrl = Settings.API.mobiusTracking && Settings.API.mobiusTracking[env] ? Settings.API.mobiusTracking[env].url : null;

    var defaultData = {
      'installationId': apeironId,
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
        'uuid': 'unknown',
        'infinitiId': null,
        'country': {
          'code': 'ZZ',
          'name': 'Unknown territory'
        }
      },
      'uuid': 'unknown',
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
      },
      'timestamp': $window.moment().utc().format(),
      'userTimestamp': $window.moment().format()
    };

    function setDefaultData(bookingParams, chainData, propertyData, rateFilter) {
      var sessionCookie = sessionDataService.getCookie();
      if (userObject) {
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
        if(userObject.id){ //If we have a userObject id, set this as the customer infinitiId value
          defaultData.customer.infinitiId = userObject.id.toString();
        }
      }
      //uuid
      defaultData.customer.uuid = sessionCookie.sessionData.sessionId;
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
      defaultData.checkIn = bookingParams.from;
      defaultData.checkOut = bookingParams.to;
      defaultData.lengthOfStay = $window.moment(defaultData.checkOut).diff($window.moment(defaultData.checkIn), 'days');
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

      //rate filter
      defaultData.rateFilter = rateFilter && rateFilter.name && rateFilter.code ? rateFilter : {
        'code': 'Default',
        'name': 'Default'
      };
    }

    function trackSearch(bookingParams, chainData, propertyData, products, room, rateFilter) {
      if (!searchEnabled || $state.includes('reservation') || !products.length) {
        return;
      }
      //set default data
      setDefaultData(bookingParams, chainData, propertyData, rateFilter);
      //copy default data
      var postData = angular.copy(defaultData);
      //property star rating
      postData.starRating = propertyData.rating;
      postData.isPurchase = false;
      var searchData = [];

      _.each(products, function (product) {
        //Remove policy description and showWarning as these are not needed
        _.each(product.policies, function (policy) {
          policy.description = undefined;
          policy.showWarning = undefined;
        });

        var productData = {
          'code': product.code,
          'name': product.name,
          'room': {
            'code': room.code,
            'type': room.name
          },
          'price': {
            'currency': $rootScope.currencyCode,
            'totalPreTax': product.price.breakdowns[0].totalBaseAfterPricingRules,
            'totalTax': product.price.breakdowns[0].totalAfterTax
          },
          'policies': product.policies,
          'rateType': product.code
        };
        searchData.push(productData);
      });
      postData.products = searchData;

      //Loop through each room then each night
      /*postData.nights = [];
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
      postData.nights.push(nightObj);*/
      apiService.mobiusTrackingPost(mobiusTrackingUrl, postData).then(function () {
      }, function (err) {
        console.log('Mobius search tracking error: ' + angular.toJson(err));
      });
    }
    function trackPurchase(bookingParams, chainData, propertyData, products, rooms, reservationData, rateFilter) {
      if (!purchaseEnabled) {
        return;
      }

      userObject = _.extend(_.clone(userObject || {}), {
        email: reservationData.guestEmail,
        firstName: reservationData.guestFirstName,
        lastName: reservationData.guestLastName,
        tel1: reservationData.guestPhone,
        iso3: reservationData.guestCountry.code,
        country: reservationData.guestCountry.name
      });
      //set default data
      setDefaultData(bookingParams, chainData, propertyData, rateFilter);
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

      var productArray = [];
      _.each(products, function (product) {
        //Remove policy description and showWarning as these are not needed
        _.each(product.policies, function (policy) {
          policy.description = undefined;
          policy.showWarning = undefined;
        });

        var productData = {
          'code': product.code,
          'name': product.name,
          'room': {
            'code': product.room.code,
            'type': product.room.name
          },
          'price': {
            'currency': $rootScope.currencyCode,
            'totalPreTax': product.priceDetail.totalBaseAfterPricingRules,
            'totalTax': product.priceDetail.totalTax
          },
          'policies': product.policies,
          'rateType': product.code
        };
        productArray.push(productData);
      });
      postData.products = productArray;

      //payment details
      postData.paymentType = reservationData.paymentInfo.paymentMethod === 'cc' ? reservationData.paymentInfo.ccPayment.typeCode : reservationData.paymentInfo.paymentMethod;

      postData.isPurchase = true;

      //console.log('trackPurchase: ' + angular.toJson(postData));
      apiService.mobiusTrackingPost(mobiusTrackingUrl, postData).then(function () {
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
