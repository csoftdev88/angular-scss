'use strict';
/*
 * This service sends tracking events to infiniti apeiron
 */
angular.module('mobiusApp.services.infinitiApeironService', []).service('infinitiApeironService', [
  'Settings', 'apiService', '$state', '_', '$rootScope', 'channelService', 'sessionDataService', 'userObject',
  '$window', 'user', 'cookieFactory', 'contentService', 'bookingService', 'locationService', '$q',
  function(Settings, apiService, $state, _, $rootScope, channelService, sessionDataService, userObject, $window,
           user, cookieFactory, contentService, bookingService, locationService, $q) {

    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    var enabled = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] && Settings.infinitiApeironTracking[env].enable;
    var endpoint = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].endpoint : null;
    var username = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].username : null;
    var password = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].password : null;
    var apeironId = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].id : null;
    var isSinglePageApp = Settings.infinitiApeironTracking && Settings.infinitiApeironTracking[env] ? Settings.infinitiApeironTracking[env].singlePageApp: false;
    var hospitalityEnabled = !!(enabled && Settings.hospitalityEvents && Settings.hospitalityEvents[env]);

    /**
     * FIXME: Duplicated code from the property service to avoid a circular dependency
     * The correct fix is to split the property service into 2 services instead
     * */
    function correctParams(params) {
      if (params && (!params.from || !params.to || !params.adults || !params.productGroupId)) {
        delete params.from;
        delete params.to;
        delete params.adults;
        delete params.children;
        delete params.productGroupId;
      }
      return params;
    }

    /**
     * FIXME: Duplicated code from the property service to avoid a circular dependency
     * The correct fix is to split the property service into 2 services instead
     * */
    function getAllProperties(params) {
      var q = $q.defer();
      apiService.getThrottled(apiService.getFullURL('properties.all'), correctParams(params)).then(function (propertyData) {

        //If thirdparties system is active and properties are restricted, filter the returned property data
        if ($rootScope.thirdparty && $rootScope.thirdparty.properties) {
          var thirdPartyPropertyCodes = $rootScope.thirdparty.properties;
          if (thirdPartyPropertyCodes.length) {
            var thirdPartyProperties = [];
            _.each(thirdPartyPropertyCodes, function (thirdPartyPropertyCode) {
              var property = _.find(propertyData, function (property) {
                return thirdPartyPropertyCode === property.code;
              });
              if (property) {
                thirdPartyProperties.push(property);
              }
            });
            propertyData = thirdPartyProperties;
          }
        }
        q.resolve(propertyData);
      });
      return q.promise;
    }

    /**
     * Main function used to submit an event to infiniti tracking script with a payload specified by properties
     * @param eventName
     * @param properties
     */
    function trackEvent(eventName, properties) {
      if (!enabled) {
        return;
      }
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
      if (!enabled) {
        return;
      }
      if (endpoint) {
        var postData = buildPurchaseData(reservationData, chainData, propertyData, trackingData, priceData, scopeData, stateParams, selectedRate);
        apiService.infinitiApeironPost(endpoint, postData, username, password).then(function() {}, function(err) {
          console.log('Infiniti apeiron purchase tracking error: ' + angular.toJson(err));
        });
      }
    }

    function trackCampaignDisplay(code) {
      trackEvent('campaign_display', {'campaignCode': code.toString()});
    }

    function trackCampaignPurchase(code) {
      trackEvent('campaign_purchase', {'campaignCode': code.toString()});
    }

    function trackPageView(path) {
      if (!enabled) {
        return;
      }
      var eventDetails = {
        'detail': {},
        'bubbles': true,
        'cancelable': true
      };
      eventDetails.detail.path = path;
      eventDetails.detail.url = window.location.origin + path;
      eventDetails.detail.title = document.title;
      var propertySlug = bookingService.getParams().propertySlug;
      eventDetails.detail.propertyCode = bookingService.getCodeFromSlug(propertySlug) || '';
      var event = new CustomEvent('infiniti.page.loaded', eventDetails);
      document.dispatchEvent(event);
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

    function trackSearchParams() {
      if (!hospitalityEnabled) {
        return;
      }
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
      $q.all([getAllProperties(), locationService.getRegions()])
        .then(function (data) {
          var properties = data[0];
          var regions = data[1];
          var property = _.findWhere(properties, {code: propertyCode});
          var region = null;
          if (property) {
            region = _.findWhere(regions, {code: property.regionCode});
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
      if (!hospitalityEnabled) {
        return;
      }
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
      if (!hospitalityEnabled) {
        return;
      }
      var urlParams = bookingService.getParams();
      var dates = bookingService.datesFromString(urlParams.dates);
      _.each(rates, function (rate) {
        var rateData = {
          type: 'rate',
          name: rate.name,
          category: category || '',
          roomCode: room.code,
          code: rate.code,
          cancelationAllowed: !!_.findWhere(rate.policies, {type: 'cancellation'}),
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

    // FIXME: this is duplicating most of what already gets sent as an ecommerce event......
    function trackBuy(trackingData, priceData, scopeData, stateParams) {
      if (!hospitalityEnabled) {
        return;
      }
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
          'roomCode': scopeData.allRooms[i].code,
          'rateCode': scopeData.allRooms[i]._selectedProduct.code,
          'dailyRate': (priceData.totalAfterTaxAfterPricingRules / lengthOfStay) / numRooms,
          'leadTime': leadTime,
          'lengthOfStay': lengthOfStay,
          'noOfOccupants': scopeData.moreRoomData[i].adults + scopeData.moreRoomData[i].children,
          'paymentType': trackingData.paymentInfo.paymentMethod,
          'points': null, // @todo As sandman does not have a loyalty program, we will just send null for now
          'policies': stripPurchasePolicies(scopeData.allRooms[i]._selectedProduct.policies)
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

      customerObject.infinitiId = user.getTrackingId() !== null ? user.getTrackingId().toString() : null;
      customerObject.id = user.getCustomerId() !== null ? user.getCustomerId().toString() : null;

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
            'revenue': ''
          }
        };
        rooms.push(room);
      });

      infinitiApeironData.items = rooms;

      var totalDiscount = -priceData.totalDiscount; //Discounts come through as negative values
      var totalPrice = priceData.breakdownTotalBaseAfterPricingRules;

      var discountCode = stateParams.promoCode ? stateParams.promoCode : null;
      discountCode = discountCode || stateParams.groupCode ? stateParams.groupCode : null;
      discountCode = discountCode || stateParams.corpCode ? stateParams.corpCode : null;

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

    function getUserTitle(titles, titleCode) {
      var userTitle = _.find(titles, function(title) {
        return title.id === titleCode;
      });
      return userTitle;
    }

    return {
      trackPurchase: trackPurchase,
      trackSearchParams: trackSearchParams,
      trackResults: trackResults,
      trackRates: trackRates,
      trackBuy: trackBuy,
      trackCampaignDisplay: trackCampaignDisplay,
      trackCampaignPurchase: trackCampaignPurchase,
      trackPageView: trackPageView,
      isSinglePageApp: isSinglePageApp
    };
  }
]);
