'use strict';
/*
 * This service sends tracking events to infiniti apeiron
 */
angular.module('mobiusApp.services.infinitiApeironService', []).service('infinitiApeironService', [
  'Settings', 'apiService', '$state', '_', '$rootScope', 'channelService', 'sessionDataService', 'userObject',
  '$window', 'user', 'cookieFactory', 'contentService', 'bookingService', 'propertyService', 'locationService', '$q',
  function(Settings, apiService, $state, _, $rootScope, channelService, sessionDataService, userObject, $window,
           user, cookieFactory, contentService, bookingService, propertyService, locationService, $q) {

    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var endpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].endpoint : null;
    var duplicationEndpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].duplicationEndpoint : null;
    var shouldDuplicate = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].enableDuplication : false;
    var username = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].username : null;
    var password = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].password : null;
    var apeironId = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].id : null;
    var isSinglePageApp = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].singlePageApp: false;

    /**
     * Main function used to submit an event to infiniti tracking script with a payload specified by properties
     * @param eventName
     * @param properties
     */
    function trackEvent(eventName, properties){
      var eventDetails = {
        'bubbles': true,
        'cancelable': true,
        'detail':{}
      };
      eventDetails.detail.eventName = eventName;
      eventDetails.detail.properties = properties;
      var event = new CustomEvent('infiniti.event.track', eventDetails);
      document.dispatchEvent(event);
    }

    function trackPurchase(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate) {
      if (endpoint) {
        var postData = buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate);
        apiService.infinitiApeironPost(endpoint, postData, username, password).then(function() {}, function(err) {
          console.log('Infiniti apeiron purchase tracking error: ' + angular.toJson(err));
        });
        if (shouldDuplicate) {
          //POST every purchase event to duplication end-point
          apiService.infinitiApeironPost(duplicationEndpoint, postData, username, password).then(function() {}, function(err) {
            console.log('Infiniti apeiron duplication endpoint purchase tracking error: ' + angular.toJson(err));
          });
        }
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
            if (shouldDuplicate) {
              //POST every track search event to duplication end-point
              apiService.infinitiApeironPost(duplicationEndpoint, postData, username, password).then(function() {}, function(err) {
                console.log('Infiniti apeiron duplication endpoint search tracking error: ' + angular.toJson(err));
              });
            }
          });
        });
      }
    }

    function trackCampaignDisplay(code){
      trackEvent('campaign_display', {'campaignCode': code.toString()});
    }

    function trackCampaignPurchase(code){
      trackEvent('campaign_purchase', {'campaignCode': code.toString()});
    }

    function trackPageView(path){
      var eventDetails = {
  			'detail':{},
  			'bubbles': true,
  			'cancelable': true
  		};
      eventDetails.detail.path = path;
      eventDetails.detail.url = window.location.origin + path;
      eventDetails.detail.title = document.title;
      var event = new CustomEvent('infiniti.page.loaded', eventDetails);
      document.dispatchEvent(event);
    }

    function trackPage(path){
      var eventDetails = {};
      eventDetails.path = path;
      eventDetails.url = window.location.origin + path;
      eventDetails.title = document.title;
      eventDetails.type = 'page';
      eventDetails.tags = [];
      var propertySlug = bookingService.getParams().propertySlug;
      eventDetails.propertyCode = bookingService.getCodeFromSlug(propertySlug) || '';
      trackEvent('hi_page', eventDetails);
    }

    function mapRoomsForInfiniti(rooms) {
      return _.map(rooms, function (room) {
        return {
          noOfAdults: parseInt(room.adults),
          noOfChildren: parseInt(room.children)
        };
      });
    }

    function mapPropertyForInfiniti(region, property) {
      var locationData = {
        code: region.code,
        name: region.nameShort
      };

      return {
        code: property.code,
        name: property.nameShort,
        province: locationData,
        region: locationData
      };
    }

    function trackSearchParams(){
      var urlParams = bookingService.getParams();
      var dates = bookingService.datesFromString(urlParams.dates);
      // Don't track searches without dates
      if (!dates) {
        return;
      }
      var rooms = bookingService.getMultiRoomData();
      var propertySlug = bookingService.getParams().propertySlug;
      var propertyCode = null;
      if (propertySlug) {
         propertyCode = bookingService.getCodeFromSlug(propertySlug);
      }

      // Get all properties and regions over a specific one by code as they would have likely been cached by now
      $q.all([propertyService.getAll(), locationService.getRegions()])
        .then(function (data) {
          var properties = data[0];
          var regions = data[1];
          var property = _.findWhere(properties, { code: propertyCode });
          var region = null;
          if (property) {
            region = _.findWhere(regions, { code: property.regionCode });
          }
          // Parse the encoded JSON with the room information
          rooms = mapRoomsForInfiniti(rooms);
          // If there is no multi room data, assume single room booking and get values from url params
          if (rooms.length === 0) {
            rooms = mapRoomsForInfiniti([{
              adults: urlParams.adults,
              children: urlParams.children
            }]);
          }

          var searchData = {
            type: 'search_parameters',
            checkIn: dates.from || '',
            checkOut: dates.to || '',
            corpCode: urlParams.corpCode || '',
            groupCode: urlParams.groupCode || '',
            rooms: rooms,
            promoCode: urlParams.promoCode || '',
            property: property && region ? mapPropertyForInfiniti(region, property) : {}
          };
          trackEvent('hi_search_parameters', searchData);
        });
    }

    function trackResults(rooms) {
      var urlParams = bookingService.getParams();
      _.each(rooms, function (room) {
        var resultData = {
          type: 'result',
          roomName: room.name,
          roomCode: room.code,
          fromPrice: room.priceFrom,
          propCode: bookingService.getCodeFromSlug(urlParams.propertySlug),
          tags: []
        };
        trackEvent('hi_result', resultData);
      });
    }

    function trackRates(rates, otaRate, room, category) {
      var urlParams = bookingService.getParams();
      var dates = bookingService.datesFromString(urlParams.dates);
      _.each(rates, function (rate) {
        var rateData = {
          type: 'rate',
          name: rate.name,
          category: category || '',
          roomCode: room.code,
          code: rate.code,
          cancelationAllowed: !! _.findWhere(rate.policies, { type: 'cancellation' }),
          breakfastIncluded: false, // cant do this at the moment
          memberRate: rate.memberOnly,
          loyaltyRate: rate.allowPointsBooking,
          hiddenRate: rate.productHidden,
          strikeThrough: rate.price.formatting === 'slashthrough',
          comparisonRate: otaRate,
          pricePerNight: rate.price.totalBaseAfterPricingRules,
          pricePerStay: rate.price.totalBaseAfterPricingRules * diffDates(dates.to, dates.from),
          taxShown: false, // we never show tax,
          tags: []
        };
        trackEvent('hi_rate', rateData);
      });
    }

    function diffDates(to, from) {
      to = new Date(to);
      from = new Date(from);
      var timeDiff = Math.abs(to.getTime() - from.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    function stripPurchasePolicies(policies) {
      return _.map(policies, function (policy) {
        return {
          type: policy.type,
          value: policy.value
        };
      });
    }

    function trackBuy(trackingData, priceData, scopeData, stateParams) {
      var roomData = bookingService.getMultiRoomData(stateParams.rooms);
      var dates = bookingService.datesFromString(stateParams.dates);
      var lengthOfStay = diffDates(dates.to, dates.from);
      var leadTime = diffDates(dates.from, new Date().toDateString());
      var purchaseData = {};
      var numRooms = roomData ? roomData.length : 1;
      if (numRooms === 0) {
        numRooms++;
      }

      for (var i = 0; i < numRooms; i++) {
        purchaseData = {
          type: 'purchase',
          "roomCode": scopeData.allRooms[i].code,
          "rateCode": scopeData.allRooms[i]._selectedProduct.code,
          "dailyRate": (priceData.totalAfterTaxAfterPricingRules / lengthOfStay) / numRooms,
          "leadTime": leadTime,
          "lengthOfStay": lengthOfStay,
          "noOfOccupants": scopeData.moreRoomData[i].adults + scopeData.moreRoomData[i].children,
          "paymentType": trackingData.paymentInfo.paymentMethod,
          "points": null, // @todo As sandman does not have a loyalty program, we will just send null for now
          "policies": stripPurchasePolicies(scopeData.allRooms[i]._selectedProduct.policies)
        };
        trackEvent('hi_purchase', purchaseData);
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
      var bookedDate = stateParams.dates ? stateParams.dates.split('_') : null;
      var fromDate = null;
      var toDate = null;
      if (bookedDate && bookedDate.length) {
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
        'country': scopeData.userDetails.localeCode,
        'gender': userObject.gender || '',
        'isCorporateCustomer': stateParams.corpCode && stateParams.corpCode !== '' ? true : false,
        'isLoyaltyMember': Settings.authType === 'infiniti',
        'uuid': sessionCookie.sessionData.sessionId
      };

      customerObject.infinitiId = cookieFactory('CustomerID') ? cookieFactory('CustomerID') : 0;
      customerObject.id = user.getTrackingId() !== null ? user.getTrackingId().toString() : null;

      infinitiApeironData.customer = customerObject;

      var rooms = [];
      _.each(scopeData.allRooms, function(roomData, index) {

        var roomPolicies = [];
        _.each(roomData._selectedProduct.policies, function(policy) {
          var policyObj = {
            'type':policy.type,
            'value':policy.value
          };
          roomPolicies.push(policyObj);
        });

        var localeData = propertyData.locale;
        var localeArray = localeData ? propertyData.locale.split('-') : null;
        if(localeArray && localeArray.length > 1)
        {
          localeData = localeArray[1].trim();
        }

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
              'name': localeData
            },
            'location': {
              'code': propertyData.locationCode,
              'name': propertyData.city
            },
            'province': {
              'code': localeData.split(' ').join('').toUpperCase(),
              'name': localeData
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
        'shipping': 'NONE', //This must be a string to pass infiniti purchase event validation
        'shippingDuration': null,
        'shippingOption': 'NONE', //This must be a string to pass infiniti purchase event validation
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
      var bookedDate = stateParams.dates ? stateParams.dates.split('_') : null;
      var fromDate = null;
      var toDate = null;
      if (bookedDate && bookedDate.length) {
        fromDate = bookedDate[0];
        toDate = bookedDate[1];
      }
      var infinitiApeironData = buildGenericData(chainData);
      infinitiApeironData.metaData.rateOrder = order && order.name ? order.name : 'default';
      if(selectedRate && selectedRate.code && selectedRate.name)
      {
        infinitiApeironData.metaData.rateFilter = {
          'code':selectedRate.code,
          'id':selectedRate.id,
          'name':selectedRate.name
        };
      }
      else {
        infinitiApeironData.metaData.rateFilter = 'default';
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
      customerObject.id = user.getTrackingId() !== null ? user.getTrackingId().toString() : null;

      infinitiApeironData.customer = customerObject;

      var results = [];
      _.each(products, function(product) {

        var productPolicies = [];
        _.each(product.policies, function(policy) {
          var policyObj = {
            'type':policy.type,
            'value':policy.value
          };
          productPolicies.push(policyObj);
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

        var localeData = propertyData.locale;
        var localeArray = localeData ? propertyData.locale.split('-') : null;
        if(localeArray && localeArray.length > 1)
        {
          localeData = localeArray[1].trim();
        }

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
              'name': localeData
            },
            'location': {
              'code': propertyData.locationCode,
              'name': propertyData.city
            },
            'province': {
              'code': localeData,
              'name': localeData
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
        'id': 'search',
        'uuid': sessionCookie.sessionData.sessionId,
        'totalRevenue': null,
        'totalPrice': null,
        'totalTax': null,
        'shipping': 'NONE', //This must be a string to pass infiniti purchase event validation
        'shippingDuration': null,
        'shippingOption': 'NONE', //This must be a string to pass infiniti purchase event validation
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
        return country.code === countryCode;
      });
      return userCountry;
    }

    return {
      trackPurchase: trackPurchase,
      trackSearch: trackSearch,
      trackSearchParams: trackSearchParams,
      trackResults: trackResults,
      trackRates: trackRates,
      trackBuy: trackBuy,
      trackPage: trackPage,
      trackCampaignDisplay: trackCampaignDisplay,
      trackCampaignPurchase: trackCampaignPurchase,
      trackPageView: trackPageView,
      isSinglePageApp: isSinglePageApp
    };
  }
]);
