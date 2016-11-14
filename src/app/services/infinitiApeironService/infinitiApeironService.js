'use strict';
/*
 * This service sends tracking events to infiniti apeiron
 */
angular.module('mobiusApp.services.infinitiApeironService', []).service('infinitiApeironService', [
  'Settings', 'apiService','$state','_','$rootScope','channelService','sessionDataService','userObject', '$window', 'user', 'cookieFactory',
  function (Settings, apiService, $state, _, $rootScope, channelService, sessionDataService, userObject, $window, user, cookieFactory) {
    /*var defaultData = {
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
    };*/
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var endpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].endpoint : null;
    var username = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].username : null;
    var password = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].password : null;
    var apeironId = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].id : null;

    function trackPurchase(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams){
      if(endpoint)
      {
        var postData = buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams);
        apiService.infinitiApeironPost(endpoint, postData, username, password).then(function () {
        }, function (err) {
          console.log('Infiniti apeiron purchase tracking error: ' + angular.toJson(err));
        });
      }
    }

    function trackSearch(chainData, propertyData, trackingData, scopeData, stateParams) {
      if(endpoint)
      {
        var postData = buildSearchData(chainData, propertyData, trackingData, scopeData, stateParams);
        console.log(postData);
        /*apiService.infinitiApeironPost(endpoint, postData, username, password).then(function () {
        }, function (err) {
          console.log('Infiniti apeiron search tracking error: ' + angular.toJson(err));
        });*/
      }
    }

    function buildGenericData(chainData, propertyData, trackingData, scopeData, stateParams){
      var dateNow = new Date();
      var trackingDate = dateNow.toISOString();
      var anonymousId = cookieFactory('ajs_anonymous_id');
      anonymousId = anonymousId ? anonymousId.split('%22').join('') : null;

      var sessionCookie = sessionDataService.getCookie();

      var customerObject = {
        'title': getUserTitle(scopeData).name,
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
        'country': getUserCountry(scopeData).code,
        'gender':userObject.gender || '',
        'isCorporateCustomer': stateParams.corpCode && stateParams.corpCode !== '' ? true : false,
        'isLoyaltyMember': Settings.authType === 'infiniti',
        'uuid': sessionCookie.sessionData.sessionId
      };

      customerObject.infinitiId = cookieFactory('CustomerID') ? cookieFactory('CustomerID') : 0;
      customerObject.id = user.getCustomerId() !== null ? user.getCustomerId().toString() : null;

      var genericInfinitiApeironData = {
        'installationId': apeironId,
        'utcTimestamp': $window.moment.utc(trackingDate).toISOString().valueOf(), //'2016-10-06T09:12:34Z'
        'userTimestamp': trackingDate, //2016-10-06T09:12:34+0200
        'anonymousId': anonymousId, // '57ebdc7d-1f0b-4b9b-8fdc-1c1b1d234b1a' ajs_anonyomous_id cookie removing encoded quotes
        'customer': customerObject,
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

    function buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams){
      var infinitiApeironData = buildGenericData(chainData, propertyData, trackingData, priceData, scopeData, stateParams);
      var sessionCookie = sessionDataService.getCookie();
      var bookedDate = stateParams.dates.split('_');
      var fromDate = null;
      var toDate = null;
      if (bookedDate.length) {
        fromDate = bookedDate[0];
        toDate = bookedDate[1];
      }

      var rooms = [];
      _.each(scopeData.allRooms, function(roomData,index) {

        var roomPolicies = [];
        _.each(roomData._selectedProduct.policies, function (val, key) {
          var policy = {
              'type': key
            };
          roomPolicies.push(policy);
        });

        var localeData = propertyData.locale.split('-');

        var room = {
          'id': roomData._selectedProduct.productPropertyRoomTypeId,
          'code': roomData.code,
          'transaction' : {
            'id': reservationData[0].reservationCode
          },
          'quantity':1,
          'discountAmount':0,
          'discountPercent':0,
          'totalRevenue':roomData._selectedProduct.price.totalBaseAfterPricingRules,
          'totalPrice':roomData._selectedProduct.price.totalAfterTaxAfterPricingRules,
          'totalTax':roomData._selectedProduct.price.taxDetails.totalTax + roomData._selectedProduct.price.totalAdditionalFees,
          'dateFrom': $window.moment(fromDate).toISOString(),
          'dateTo': $window.moment(toDate).toISOString(),
          'isPreorder':false,
          'metaData': {
            'adults':scopeData.moreRoomData[index].adults,
            'children':scopeData.moreRoomData[index].children,
            'rate':roomData._selectedProduct.code,
            'starRating':propertyData.rating,
            'groupCode':stateParams.groupCode ? stateParams.groupCode : null,
            'promoCode':stateParams.promoCode ? stateParams.promoCode : null,
            'corpCode':stateParams.corpCode ? stateParams.corpCode : null,
            'policies':roomPolicies,
            'region': {
              'code': propertyData.regionCode,
              'name': localeData[1].trim()
            },
            'location':{
              'code':propertyData.locationCode,
              'name':propertyData.city
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
            'tax':'',
            'revenue':'',
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
          'transactionType':'purchase',
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

      return infinitiApeironData;
    }

    function buildSearchData(chainData, propertyData, trackingData, scopeData, stateParams){
      var infinitiApeironData = buildGenericData(chainData, propertyData, trackingData, scopeData, stateParams);
      return infinitiApeironData;
    }

    function getUserTitle(scopeData){
      var userTitle = _.find(scopeData.profileTitles, function(title) {
        return title.id === scopeData.userDetails.title;
      });
      return userTitle;
    }

    function getUserCountry(scopeData){
      var userCountry = _.find(scopeData.profileCountries, function(country) {
        return country.id === scopeData.userDetails.localeCode;
      });
      return userCountry;
    }

    /*function buildOldSearchData(bookingParams, chainData, propertyData, products, room, rateSorting) {
      if ($state.includes('reservation') || !products.length) {
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

      return postData;
    }

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
    }*/

    return {
      trackPurchase: trackPurchase,
      trackSearch: trackSearch
    };
  }
]);
