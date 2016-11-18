'use strict';
/*
 * This service sends tracking events to infiniti apeiron
 */
angular.module('mobiusApp.services.infinitiApeironService', []).service('infinitiApeironService', [
  'Settings', 'apiService', '$state', '_', '$rootScope', 'channelService', 'sessionDataService', 'userObject', '$window', 'user', 'cookieFactory', 'contentService',
  function(Settings, apiService, $state, _, $rootScope, channelService, sessionDataService, userObject, $window, user, cookieFactory, contentService) {

    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var endpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].endpoint : null;
    var username = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].username : null;
    var password = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].password : null;
    var apeironId = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].id : null;

    function trackPurchase(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate) {
      if (endpoint) {
        var postData = buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate);
        apiService.infinitiApeironPost(endpoint, postData, username, password).then(function() {}, function(err) {
          console.log('Infiniti apeiron purchase tracking error: ' + angular.toJson(err));
        });
      }
    }

    function trackSearch(chainData, propertyData, stateParams, order, products, room, selectedRate) {
      if (endpoint) {
        contentService.getCountries().then(function(countries) {
          contentService.getTitles().then(function(titles) {
            var postData = buildSearchData(chainData, propertyData, stateParams, order, products, room, selectedRate, countries, titles);
            apiService.infinitiApeironPost(endpoint, postData, username, password).then(function() {}, function(err) {
              console.log('Infiniti apeiron search tracking error: ' + angular.toJson(err));
            });
          });
        });
      }
    }

    function buildGenericData(chainData) {
      var dateNow = new Date();
      var trackingDate = dateNow.toISOString();
      var anonymousId = cookieFactory('ajs_anonymous_id');
      anonymousId = anonymousId ? anonymousId.split('%22').join('') : null;

      var genericInfinitiApeironData = {
        'installationId': apeironId,
        'utcTimestamp': $window.moment.utc(trackingDate).toISOString().valueOf(), //'2016-10-06T09:12:34Z'
        'userTimestamp': trackingDate, //2016-10-06T09:12:34+0200
        'anonymousId': anonymousId, // '57ebdc7d-1f0b-4b9b-8fdc-1c1b1d234b1a' ajs_anonyomous_id cookie removing encoded quotes
        'shipTo': {
          'title': '',
          'firstName': '',
          'lastName': '',
          'email': '',
          'telephone': '',
          'address1': '',
          'address2': '',
          'address3': '',
          'town': '',
          'state': '',
          'postcode': '',
          'country': ''
        },
        'metaData': {
          'channel': {
            'code': _.isString(channelService.getChannel().channelID) ? channelService.getChannel().channelID : channelService.getChannel().channelID.toString(),
            'name': 'Channel_' + channelService.getChannel().name
          },
          'chain': {
            'code': chainData.code,
            'name': chainData.nameShort
          }
        }
      };

      return genericInfinitiApeironData;
    }

    function buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate) {
      var infinitiApeironData = buildGenericData(chainData);
      var sessionCookie = sessionDataService.getCookie();
      var bookedDate = stateParams.dates.split('_');
      var fromDate = null;
      var toDate = null;
      if (bookedDate.length) {
        fromDate = bookedDate[0];
        toDate = bookedDate[1];
      }

      var customerObject = {
        'title': getUserTitle(scopeData.profileTitles, scopeData.userDetails.title).name,
        'firstName': trackingData.guestFirstName,
        'lastName': trackingData.guestLastName,
        'email': trackingData.guestEmail,
        'telephone': trackingData.guestPhone,
        'address1': trackingData.guestAddress,
        'address2': '',
        'address3': '',
        'town': trackingData.guestCity,
        'state': trackingData.guestStateProvince,
        'postcode': trackingData.guestZip,
        'country': getUserCountry(scopeData.profileCountries, scopeData.userDetails.localeCode).code,
        'gender': userObject.gender || '',
        'isCorporateCustomer': stateParams.corpCode && stateParams.corpCode !== '' ? true : false,
        'isLoyaltyMember': Settings.authType === 'infiniti',
        'uuid': sessionCookie.sessionData.sessionId
      };

      customerObject.infinitiId = cookieFactory('CustomerID') ? cookieFactory('CustomerID') : 0;
      customerObject.id = user.getCustomerId() !== null ? user.getCustomerId().toString() : null;

      infinitiApeironData.customer = customerObject;

      var rooms = [];
      _.each(scopeData.allRooms, function(roomData, index) {

        var roomPolicies = [];
        _.each(roomData._selectedProduct.policies, function(val, key) {
          var policy = {
            'type': key
          };
          roomPolicies.push(policy);
        });

        var localeData = propertyData.locale.split('-');

        var room = {
          'id': roomData._selectedProduct.productPropertyRoomTypeId,
          'code': roomData.code,
          'transaction': {
            'id': reservationData[0].reservationCode
          },
          'quantity': 1,
          'discountAmount': 0,
          'discountPercent': 0,
          'totalRevenue': roomData._selectedProduct.price.totalBaseAfterPricingRules,
          'totalPrice': roomData._selectedProduct.price.totalAfterTaxAfterPricingRules,
          'totalTax': roomData._selectedProduct.price.taxDetails.totalTax + roomData._selectedProduct.price.totalAdditionalFees,
          'dateFrom': $window.moment(fromDate).toISOString(),
          'dateTo': $window.moment(toDate).toISOString(),
          'isPreorder': false,
          'metaData': {
            'adults': scopeData.moreRoomData[index].adults,
            'children': scopeData.moreRoomData[index].children,
            'rate': roomData._selectedProduct.code,
            'starRating': propertyData.rating,
            'groupCode': stateParams.groupCode ? stateParams.groupCode : null,
            'promoCode': stateParams.promoCode ? stateParams.promoCode : null,
            'corpCode': stateParams.corpCode ? stateParams.corpCode : null,
            'policies': roomPolicies,
            'region': {
              'code': propertyData.regionCode,
              'name': localeData[1].trim()
            },
            'location': {
              'code': propertyData.locationCode,
              'name': propertyData.city
            },
            'province': {
              'code': localeData[1].trim().split(' ').join('').toUpperCase(),
              'name': localeData[1].trim()
            },
            'property': {
              'code': propertyData.code,
              'name': propertyData.nameShort
            }
          },
          'product': {
            'id': roomData._selectedProduct.code,
            'name': roomData._selectedProduct.name,
            'category': roomData.name,
            'sku': roomData._selectedProduct.productPropertyRoomTypeId,
            'price': roomData._selectedProduct.price.totalAfterTaxAfterPricingRules,
            'priceBeforeTax': roomData._selectedProduct.price.totalBaseAfterPricingRules,
            'tax': '',
            'revenue': '',
          }
        };
        rooms.push(room);
      });

      infinitiApeironData.items = rooms;

      var totalDiscount = priceData.totalDiscount * -1; //Discounts come through as negative values
      var totalPrice = priceData.breakdownTotalBaseAfterPricingRules;

      var discountCode = stateParams.promoCode ? stateParams.promoCode : null;
      discountCode = stateParams.groupCode ? stateParams.groupCode : null;
      discountCode = stateParams.corpCode ? stateParams.corpCode : null;

      infinitiApeironData.transaction = {
        'transactionType': 'purchase',
        'id': reservationData[0].reservationCode,
        'uuid': sessionCookie.sessionData.sessionId,
        'totalRevenue': totalPrice, // ADD FEES
        'totalPrice': priceData.totalAfterTaxAfterPricingRules,
        'totalTax': priceData.totalTax, //ADD FEES TO THIS
        'shipping': null,
        'shippingDuration': null,
        'shippingOption': null,
        'shippingIsSplit': null,
        'currencyCode': Settings.UI.currencies.default,
        'totalItems': scopeData.allRooms.length,
        'discountAmount': totalDiscount,
        'discountPercent': (totalDiscount / totalPrice) * 100,
        'discountCode': discountCode,
        'discountCampaign': null,
        'discountType': ['flat'], //look into this
        'isGift': false,
        'source': 'Online',
        'subsource': '',
        'paymentType': trackingData.paymentInfo.paymentMethod === 'cc' ? trackingData.paymentInfo.ccPayment.typeCode : trackingData.paymentInfo.paymentMethod
      };

      if(selectedRate && selectedRate.code && selectedRate.name)
      {
        infinitiApeironData.metaData.rateFilter = {
          'code':selectedRate.code,
          'name':selectedRate.name
        };
      }

      return infinitiApeironData;
    }

    function buildSearchData(chainData, propertyData, stateParams, order, products, room, selectedRate, countries, titles) {
      var bookedDate = stateParams.dates.split('_');
      var fromDate = null;
      var toDate = null;
      if (bookedDate.length) {
        fromDate = bookedDate[0];
        toDate = bookedDate[1];
      }
      var infinitiApeironData = buildGenericData(chainData);
      infinitiApeironData.metaData.rateOrder = order.name || '';
      if(selectedRate && selectedRate.code && selectedRate.name)
      {
        infinitiApeironData.metaData.rateFilter = {
          'code':selectedRate.code,
          'name':selectedRate.name
        };
      }
      else {
        infinitiApeironData.metaData.rateFilter = null;
      }
      infinitiApeironData.metaData.starRating = propertyData.rating || '';

      var sessionCookie = sessionDataService.getCookie();

      var customerObject = {};

      if (userObject && userObject.id) {
        var userCountry = getUserCountry(countries, userObject.localeCode);
        var userTitle = getUserTitle(titles, userObject.title);

        customerObject = {
          'firstName': userObject.firstName,
          'lastName': userObject.lastName,
          'title': userTitle ? userTitle.name : null,
          'email': userObject.email,
          'telephone': userObject.tel1,
          'address1': userObject.address1,
          'address2': userObject.address2,
          'address3': userObject.address3,
          'town': userObject.city,
          'state': userObject.state,
          'postcode': userObject.zip,
          'country': userCountry ? userCountry.code : null,
          'gender': userObject.gender || '',
          'isCorporateCustomer': stateParams.corpCode && stateParams.corpCode !== '' ? true : false,
          'isLoyaltyMember': Settings.authType === 'infiniti',
          'uuid': sessionCookie.sessionData.sessionId
        };
      }

      customerObject.infinitiId = cookieFactory('CustomerID') ? cookieFactory('CustomerID') : 0;
      customerObject.id = user.getCustomerId() !== null ? user.getCustomerId().toString() : null;

      infinitiApeironData.customer = customerObject;

      var results = [];
      _.each(products, function(product) {

        var productPolicies = [];
        _.each(product.policies, function(val, key) {
          var policy = {
            'type': key
          };
          productPolicies.push(policy);
        });

        var nights = [];
        _.each(product.price.breakdowns, function(breakdown) {
          var night = {
            'date':$window.moment(breakdown.date).toISOString(),
            'totalRevenue': breakdown.totalBaseAfterPricingRules,
            'totalPrice': breakdown.totalAfterTaxAfterPricingRules,
            'totalTax': breakdown.totalTax + breakdown.totalFees,
          };
          nights.push(night);
        });

        var localeData = propertyData.locale.split('-');

        var result = {
          'id': product.productPropertyRoomTypeId,
          'transaction': {
            'id': null
          },
          'code': room.code,
          'quantity': 1,
          'discountAmount': 0,
          'discountPercent': 0,
          'totalRevenue': product.price.totalBaseAfterPricingRules,
          'totalPrice': product.price.totalAfterTaxAfterPricingRules,
          'totalTax': product.price.taxDetails.totalTax + product.price.totalAdditionalFees,
          'dateFrom': $window.moment(fromDate).toISOString(),
          'dateTo': $window.moment(toDate).toISOString(),
          'isPreorder': false,
          'metaData': {
            'adults': stateParams.adults,
            'children': stateParams.children,
            'rate': product.code,
            'starRating': propertyData.rating,
            'groupCode': stateParams.groupCode ? stateParams.groupCode : null,
            'promoCode': stateParams.promoCode ? stateParams.promoCode : null,
            'corpCode': stateParams.corpCode ? stateParams.corpCode : null,
            'policies': productPolicies,
            'region': {
              'code': propertyData.regionCode,
              'name': localeData[1].trim()
            },
            'location': {
              'code': propertyData.locationCode,
              'name': propertyData.city
            },
            'province': {
              'code': localeData[1].trim().split(' ').join('').toUpperCase(),
              'name': localeData[1].trim()
            },
            'property': {
              'code': propertyData.code,
              'name': propertyData.nameShort
            },
            'nights': nights
          },
          'product': {
            'id': product.code,
            'name': product.name,
            'category': room.name,
            'sku': product.productPropertyRoomTypeId,
            'price': product.price.totalAfterTaxAfterPricingRules,
            'priceBeforeTax': product.price.totalBaseAfterPricingRules,
            'tax': '',
            'revenue': '',
          }
        };
        results.push(result);
      });

      var discountCode = stateParams.promoCode ? stateParams.promoCode : null;
      discountCode = stateParams.groupCode ? stateParams.groupCode : null;
      discountCode = stateParams.corpCode ? stateParams.corpCode : null;

      infinitiApeironData.transaction = {
        'transactionType': 'search',
        'id': null,
        'uuid': sessionCookie.sessionData.sessionId,
        'totalRevenue': null,
        'totalPrice': null,
        'totalTax': null,
        'shipping': null,
        'shippingDuration': null,
        'shippingOption': null,
        'shippingIsSplit': null,
        'currencyCode': Settings.UI.currencies.default,
        'totalItems': 1,
        'discountAmount': null,
        'discountPercent': null,
        'discountCode': discountCode,
        'discountCampaign': null,
        'discountType': ['flat'], //look into this
        'isGift': false,
        'source': 'Online',
        'subsource': '',
        'paymentType': null
      };

      infinitiApeironData.items = results;

      return infinitiApeironData;
    }

    function getUserTitle(titles, titleCode) {
      var userTitle = _.find(titles, function(title) {
        return title.id === titleCode;
      });
      return userTitle;
    }

    function getUserCountry(countries, countryCode) {
      var userCountry = _.find(countries, function(country) {
        return country.id === countryCode;
      });
      return userCountry;
    }

    return {
      trackPurchase: trackPurchase,
      trackSearch: trackSearch
    };
  }
]);
