'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 6,
  'authType': 'mobius',
  'loyaltyProgramEnabled': false,
  'infiniti': {
    'enable': false,
    'development': '',
    'integration': '',
    'staging': '',
    'uat':'',
    'live': ''
  },
  'sentry': {
    'enable': true,
    'development': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'integration': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'staging': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'uat': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'live': 'https://75b4292eef0c40b3aee999d89858367c@app.getsentry.com/53504'
  },
  'evolutionInfiniti': {
    'enable': false,
    'id': '8a56624d-08ff-4188-bef8-f4d32d95b6fb',
    'bridge': 'obsolete_sso',
    'script': {
      'development': 'https://storage.googleapis.com/infiniti-evolution-development/infiniti.evolution.js',
      'integration': 'https://storage.googleapis.com/infiniti-evolution-development/infiniti.evolution.js',
      'staging': 'https://storage.googleapis.com/infiniti-evolution/infiniti.evolution.js',
      'live': 'https://storage.googleapis.com/infiniti-evolution/infiniti.evolution.js'
    }
  },
  'infinitiEcommerceTracking': {
    'enable': false,
    'infinitiId': '',
    'endpoint': {
      'development': '',
      'integration': '',
      'staging': '',
      'uat': '',
      'live': ''
    }
  },
  'googleAnalytics': {
    'enable': false,
    'id': ''
  },
  'googleTagManager': {
    'enable': false,
    'trackUserId': true,
    'id': ''
  },
  'hotjar': {
    'enable': false,
    'id': '0'
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    'chainCode': 'NAT',
    'trackUsage': true,
    'baseURL': {
      'development': '//integration-www-national.mobiusbookingengine.com/api/4.0/',
      'integration': '//integration-www-national.mobiusbookingengine.com/api/4.0/',
      'staging': '//staging-www-national.mobiusbookingengine.com/api/4.0/',
      'uat': '/api/4.0/',
      'live': 'https://national.mobiusbookingengine.com/api/4.0/'
    },
    'mobiusTracking': {
      'search': {
        'enable':false,
        'url':'properties/track/search'
      },
      'purchase': {
        'enable':false,
        'url':'properties/track/purchase'
      }
    },
    'contents': {
      'contents': 'contents',
      'about': 'contents/about',
      'static': 'contents/static',
      'news': 'contents/news',
      'offers': 'contents/offers',
      'adverts': {
        'adverts': 'contents/teasers',
        'random': 'contents/teasers/random'
      }
    },
    'chain': {
      'get': 'chains/:chainCode/',
      'all': 'chains'
    },
    'generics': {
      'currencies': 'generics/currencies',
      'languages': 'generics/languages',
      'titles': 'generics/titles',
      'contactmethods': 'generics/contactmethods',
      'countries': 'generics/locales'
    },
    'filters': {
      'products': 'filters/products',
      'rooms': 'filters/rooms'
    },
    'forms': {
      'contact' : 'forms/contact',
      'contactSubmissions': 'forms/contact/submissions'
    },
    'properties': {
      'all': 'properties',
      'details': 'properties/:propertyCode',
      'availability': 'properties/:propertyCode/availabilities',
      'room': {
        'all': 'properties/:propertyCode/rooms',
        'details': 'properties/:propertyCode/rooms/:roomTypeCode',
        'product': {
          'all': 'properties/:propertyCode/rooms/:roomTypeCode/products',
          'addons': 'properties/:propertyCode/rooms/:roomTypeCode/products/:productCode/addons/'
        }
      }
    },
    'locations': {
      'regions': 'regions/',
      'region': 'regions/:regionCode',
      'locations': 'locations',
      'location': 'locations/:locationCode'
    },
    'customers': {
      'customer': 'customers/:customerId',
      'login':  'customers/actions/login',
      'logout':  'customers/actions/logout',
      'forgotPassword':  'customers/actions/forgotPassword',
      'changePassword':  'customers/actions/changePassword',
      'register':  'customers/',
      'transactions': 'customers/:customerId/transactions'
    },
    // NOTE: Loyalties API will change - check apiary specs
    'loyalties': {
      'all': 'customers/:customerId/loyalty'
    },
    'reservations': {
      'new': 'reservations',
      'modify': 'reservations/:reservationCode',
      'detail': 'reservations/:reservationCode',
      'addons': 'reservations/:reservationCode/addons/',
      'availableAddons': 'addons',
      'cancel': 'reservations/:reservationCode/actions/cancel',
      'cancelAnon': 'reservations/:reservationCode/actions/cancel?email=:email',
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/',
      'action': 'reservations/:reservationCode/actions/:actionType',
      'anonCustomerProfile': 'customers/:customerId?email=:customerEmail&isAnon=true'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-tenantId': '1',
      'Mobius-channelId': [{
        'name': 'mobileWeb',
        'channelID': 23,
        'contentLength': 'short'
      }, {
        'name': 'web',
        'channelID': 6,
        'contentLength': 'long'
      }, {
        'name': 'meta',
        'channelID': 24,
        'contentLength': 'long'
      }]
    },
    'sessionData': {
      'includeInApiCalls': true,
      'cookieName': 'mobiusSessionData',
      'httpHeaderFieldName': 'sessionData',
      //cookie expiry in minutes
      'expiry': 15,
      'data':{
        'infinitiSessionId': null,
        'customerId': null,
        'channel': null,
        'sessionId': null
      },
      'channelIdCookie' : 'ChannelID'
    },
    'rewards': {
      // NOTE: Inconsistent API
      'all': 'rewards',
      // + BUY(post)
      'my': 'customers/:customerId/rewards'
    },
    'promoCodes': {
      'promoCode': 'promoCode',
      'groupCode': 'groupCode',
      'corpCode': 'corpCode'
    }
  },
  'UI': {
    'chains': ['NAT'],
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'generics': {
      'singleProperty': true,
      'defaultPropertyCode': 'GHNL',
      'facebookAppId': '1694770414076502',
      'disableMainHeaderStyle': true,
      'longDateFormat': 'Do MMMM YYYY',
      'applyChainClassToBody': false,
      'orderPropertiesByChain': false,
      'header': {
        'logoLink': 'http://www.grandhotel-national.com'
      }  
    },
    'contents':{
      'displayContentImageInHeroSlider': false
    },
    'adverts' : {
      'randomMainPageAdvertSize' : 'homepage-advert',
      'heroAdverts': 'hero-advert'
    },
    'loginDialog' : {
      'showLoginTitle' : true
    },
    'heroSlider': {
      // All timing settings (autoplayDelay, animationDuration)
      // are specified in ms.

      // Use 0 value to disable automatic slide animation
      'autoplayDelay': 5000,
      'animationDuration': 800,
      'preloadImages': true
    },
    // Menu settings - showing/hidding menu items
    'menu': {
      'showHotels': false,
      'hotelMenuContent': {
        'service': 'propertyService',
        'method': 'getAll',
        'detailState': 'hotel',
        'listState': 'hotels',
        'paramName': 'propertySlug'
      },
      'showRegionsMegaMenu': false,
      'showOffers': false,
      'showAbout': false,
      'showNews': false,
      'showContact': false,
      'offerlimitedToChainWide': false,
      'offersKeepProperty': true,
      'offerSpecificToSelectedProperty': false,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': false,
      'standalone': false,
      'externalRegionLinks':[]
    },
    // Social links
    'displaySocialLinks': false,
    'socialLinks': [
      {'network': 'facebook', 'link': 'https://www.facebook.com/LaValHotel/',},
      {'network': 'google', 'link': 'https://plus.google.com/108804943223603854860/posts'}
    ],
    'shareLinks': {
      'facebook': true,
      'twitter': true,
      'googleplus': false,
      'mail': false,
      'twitterUsername': 'HotelNationalLU'
    },
    // NOTE: This is a temporary solution. Real images will
    // be provided by the PmobAI.
    'heroStaticContent': {
      'default': [
        {
          'bannerSize': 'hero-advert',
          'uri': '/static/images/hero-image-1.jpg',
          'alt': 'picture1'
        }
      ]
    },
    'hotelDetails': {
      'chainPrefix': 'Hotel',
      'breadcrumbs': {
        'hotels': true,
        'location': false
      },
      //List of rooms and their products
      'defaultNumberOfRooms': 999,
      'numberOfRoomsAddedOnMobile': 2,
      'rooms': {
        'hideRoomsWithNoAvailability': true,
        'sortRoomsByWeighting': true,
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        'showRoomCount': false,
        //Show room highlight text instead of description
        'showRoomHighlight': false,
        'desktopDisplayRatesOnLoad': true,
        'displayAmenities': false,
        'displayRoomDetails': false,
        'displayRoomSubtitle': false,
        'roomDetailThumbnailSize':{
          'width': 266,
          'height': 156
        },
        'includeSlider': true,
        'sliderHasThumbnails': false,
        'includeTripAdvisorPreloader': false,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Book Now',
          'ratesPerRoomOnDesktop': 20,
          'ratesPerRoomOnMobile': 2,
          'showTagline': false,
          'showDescription': true,
          'showDescriptionToggle': true,
          'showNoRatesSubDescription': true,
          'showRateInfoIcon': false,
          'showRateInfoLink': true,
          'rateInfoIsTabbed': false
        },
        'hideSelectDatesMessage': true
      },
      'offers': {
        'toState': 'propertyOffers'
      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': false,
      'removeScrollToRoomsOnFinish': false,
      'displayAmenitiesInHotelInfo': false,
      'headerPartial':{
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'partials':{
        'hotelHeader': true,
        'hotelDatesSelected': true,
        'hotelInfo': false,
        'hotelRooms': true,
        'hotelServices': false,
        'hotelLocation': false,
        'hotelOffers': false
      }
    },
    //rate lookup teasers
    'showHotelDetailsTestimonials': false,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonials':
    [
    //{
    //  'property': 'VAN',
    //  'review': '“My new favourite in Vancouver',
    //  'reviewer': {
    //    'name': 'Denise K',
    //    'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183019/SAN/rateLoading/denisek.jpg',
    //    'location': 'Toronto, Canada'
    //  },
    //  'stars': 5
    //}
    ],

    'roomDetails': {
      'displayRoomSubtitle': false,
      'hasBreadcrumbsSecondaryNav': false,
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': false,
      //show room highlight before description
      'showRoomHighlight': false,
      'includeTripAdvisorPreloader': false,
      'rateInfoIsTabbed': false,
      'hideProductsNotAvailable': true,
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'useThumbnails': true,
        'thumbnails':{
          'width': 264,
          'height': 183
        },
        //displayPrice can be button or text
        'displayPrice': 'button'
      }
    },

    'reservations': {
      //override per hotel confirmation number per hotel
      'displayConfirmationNumberOnAllHotels': false,
      //confirmation label display
      'displayConfirmationNumberLabel': true,
      // Confirmation number display settings per hotel(code)
      'confirmationNumber': {
        'LBH': {
          displayOnListView: true,
          displayOnDetailsView: true
        }
      },
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'confirmationPageSharing': {
        'socialSharing': true,
        'passbook': false,
        'print': true
      },
      'showGuestName': true,
      'displayNewsletterCtaOnReservationDetail': false,
      'reservationDetailPriceBreakdownExtended': false,
      'hideHeroSliderOnReservations': true,
      'displayBreadcrumbsOnReservationDetail': true,
      'displayCancelConfirmedModal': true,
      'disableAddons': true,
      'showNotificationsTop':true
    },

    'aboutHotel': {
      'showBenefits': false
    },
    'aboutChain': {
      'offersLimit': 999
    },
    // toggle filters on hotels page
    'hotelFilters': [
      {
        'type': 'sort',
        'enable': true,
        'displayInSidebar': false,
        'accordion': false
      },
      {
        'type': 'stars',
        'enable': true,
        'minStars': 3,
        'maxStars': 5,
        'displayStarsOnHotels': true,
        'accordion': false
      },
      {
        'type': 'tripAdvisor',
        'enable': true,
        'minTaRating': 3,
        'maxTaRating': 5,
        'accordion': false
      },
      {
        'type': 'rates',
        'enable': true,
        'accordion': false
      },
      {
        'type': 'price',
        'enable': true,
        'accordion': false
      },
      {
        'type': 'chain',
        'enable': false,
        'accordion': false
      },
      {
        'type': 'tags',
        'enable': false,
        'filters': [
          {
            'name': 'airport',
            'tags': ['airportHotel'],
            'checked': false
          },
          {
            'name': 'city',
            'tags': ['cityHotel'],
            'checked': false
          }
        ],
        'accordion': false
      },
      {
        'type': 'reset',
        'enable': true,
        'accordion': false
      }
    ],
    // List of currencies and their display symbols
    'currencies': {
      'default': 'CHF',

      'CHF': {
        'code': 'CHF',
        'symbol': 'CHF',
        'format': '{{symbol}} {{amount}}'
      },

      'GBP': {
        'code': 'GBP',
        'symbol': '£',
        'format': '{{symbol}}{{amount}}'
      },

      'USD': {
        'code': 'USD',
        'symbol': '$',
        'format': '{{symbol}}{{amount}}'
      },

      'EUR': {
        'code': 'EUR',
        'symbol': '€',
        'format': '{{symbol}}{{amount}}'
      },

      'CAD': {
        'code': 'CAD',
        'symbol': '$',
        'format': '{{symbol}}{{amount}}'
      }

    },

    'offers':{
      'discountCodeCookieExpiryDays': 5,
      'displayPageHeading': false,
      'includeOfferAvailabilityPropertyDropdown': false,
      'displayOfferImageInHeroSlider': false,
      //if number of words greater than [key], wrap the first [value] words in span for styling
      'offersThumbnailsTitlePattern':{
        '0': 1,
        '3': 2
      }
    },

    'registerPage':{
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      }
    },
    'profilePage':{
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'displaySummary': true,
      'displayMap': true,
      'allowPasswordChange': false
    },

    'languages': {
      'headerAlignment': 'left',
      'dropdown': false,
      'default': 'en',
      'en': {
        'shortName': 'EN',
        'name': 'English',
        'decimalSeparator': '.',
        'groupSeparator': ',',
        'groupSize': 3,
        'neg': '-'
      },
      'de': {
        'shortName': 'DE',
        'name': 'German',
        'decimalSeparator': '.',
        'groupSeparator': "'",
        'groupSize': 3,
        'neg': '-'
      },
      'fr': {
        'shortName': 'FR',
        'name': 'French',
        'decimalSeparator': '.',
        'groupSeparator': ',',
        'groupSize': 3,
        'neg': '-'
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      "datePickerNumberOfMonths": 1,
      "datePickerHasCounter": true,
      "datePickerHasTitle": false,
      "datePickerCounterIncludeDates": false,
      "datePickerCloseOnDatesSelected": false,
      "datePickerDefaultToToday": true,
      "checkAvailabilityOnChange": false,
      "checkOfferAvailabilityOnChange": false,
      "displayPropertiesMegamenu": false,
      'hasMutiroomTab': false,
      'hasRatesSelection': false,
      'timezone':'Europe/Zurich',
      //searchOffset stops user from searching availability past a certain date (today + searchOffset.days)
      'searchOffset' :{
        'enable': true,
        'days': 730
      },
      // Suggest MRB when number of adults is higher
      // than this value and server returns no products
      'maxAdultsForSingleRoomBooking': 3,
      'includeAllPropertyOption': true,
      'includeRegions': true,
      'includeLocations': false,
      'includeRegionsOnMobile': false,
      'includeLocationsOnMobile': false,
      'adults': {
        'min': 1,
        'max': 8
      },
      'children': {
        'min': 0,
        'max': 8
      },
      'defaultAdultCount': 2,
      'maxRooms': 4,
      'availability': {
        // Date range modification rules
        'from': {
          // Extra day/month added to a date
          'value': -3,
          'type': 'month'
        },
        'to': {
          // Extra day/month added to a date
          'value': 3,
          'type': 'month'
        }
      }
    },

    'booking': {
      // Card types and validation expressions
      'cardTypes': {
        'visa': {
          'name': 'Visa',
          'code': 'VI',
          'icon': 'visa',
          'regex': /^4[0-9]{12}(?:[0-9]{3})?$/
        },
        'master': {
          'name': 'MasterCard',
          'code': 'MC',
          'icon': 'master',
          'regex': /^5[1-5][0-9]{14}$/
        },
        'amex': {
          'name': 'American Express',
          'code': 'AX',
          'icon': 'amex',
          'regex': /^3[47][0-9]{13}$/
        }
      },
      //Is billing state a required field?
      'billingStateRequired': false,
      //price breakdown
      'priceBreakdownExtended': false,
      //display hero slider on booking page
      'displayHeroSlider': true,
      //display advanced header
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      //Booking steps navigation
      'bookingStepsNav':{
        'display': true
      },
      //Default value for newsletter opt-in checkbox
      'newsLetterOptedIn': true,
      //Prompt to ask user to login
      'loginCta':{
        'display': false
      },
      'loginCtaTop':{
        'display': true
      },
      //Reverse the same address checkbox logic
      'billingAddress': {
        'reverseCheckboxLogic':true
      },
      //Additional details screen
      'additionalDetails':{
        'departureTime': {
          'display': false
        },
        'tel2': {
          'display': false
        },
        'comments':{
          'display': true,
          'position': 'bottom'
        },
        'optedInDefault': true,
        'timeFormat': 'HH:mm'
      },
      'termsAndConditionsLink':'http://www.grandhotel-national.com/en/corporate/general-terms-conditions',
      'displayStaticFeesTooltip': false
    },
    'myAccount' : {
      'displaySettings' : {
        'profile': true,
        'tier': true,
        'badges': false,
        'rewards': true,
        'loyalities': false,
        'description': false
      }
    },
    // States layout
    'layout': {
      'home': [
        'about-hotel'
      ],
      'hotels': [
        'hotels'
      ],
      'room': [
        'room',
        'room-aside'
      ],
      'contacts': [
        'hotel-location'
      ]
    },

    // Widget names and their templates
    'templates': {
      'about-hotel': '<about-hotel></about-hotel>',
      'best-offers': '<best-offers></best-offers>',
      'best-hotels': '<best-hotels></best-hotels>',
      'hotels': '<hotels></hotels>',
      'room': '<room></room>',
      'room-aside': '<room-aside></room-aside>',
      'hotel-location': '<hotel-location></hotel-location>'
    },

    // Responsive design breakpoints
    'screenTypes': {
      'tablet': {
        'maxWidth': 1024
      },
      'mobile': {
        'maxWidth': 768
      }
    },

    'viewsSettings':{
      'contacts': {
        'formGrid': 12,
        'contactDetailsGrid': 4,
        'hasContactDetails': false,
        'hasMap': true,
        'hasDescription': true,
        'includePhoneField': false
      },
      'hotels': {
        'showRegionDescription': false,
        'showLocationDescription': false,
        'displayHotelRegionName': false,
        'displayHotelsCount': false
      },
      'hotelDetails':{
        'hasViewMore': false,
        'hasTitle': false,
        'hotelInfo': {
          'descriptionGrid': 8,
          'sidebarGrid': 4
        }
      },
      'roomDetails':{
        'showAmenitiesTop': true
      },
      'userProfile':{
        'hasAvatar': false,
        'hasWelcomeMessage': true,
        'hasPrestigeAccount': false,
        'hasRewards': true,
        'prestigeIsInfiniti': false,
        'infinitiPrestigeUrl': 'https://prestige.suttonplace.com',
        'hasTierInfo': true
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': false,
        'displayPropertyTitle': false,
        'displayStaticContent': true
      },
      'locationMap':{
        'displayMainTitle': true,
        'displayGoogleMapsLink': false,
        'displayIcons': false,
        'directionsLink':{
          'display': true,
          'link': 'http://www.grandhotel-national.com/media/39232/route-map.pdf'
        },
        'hideContactDetails': true
      }
    },

    // Policy codes from the API and their title translates
    'policies': {
      'cancellation': {
        'title':'Cancellation',
        'code':'24HR'
      },
      'checkInOut': {
        'title':'Check-In-Out',
        'code':'10AM4PM'
      },
      'extraGuest': {
        'title':'Extra Guest',
        'code':'20CADMORE'
      },
      'family': {
        'title':'Family',
        'code':'DEFAULT'
      },
      'guarantee': {
        'title':'Guarantee',
        'code':'CCGOVID'
      },
      'noShow': {
        'title':'No Show',
        'code':'DEFAULT'
      },
      'pet': {
        'title':'Pet',
        'code':'DEFAULT'
      }
    },
    'defaultCountryCode': 'ch',
    'preferredCountryCodes': 'ch,ca,us,gb',
    'arrivalMethods': [
      {
        apiValue: 'Car',
        display: '_car_'
      },
      {
        apiValue: 'Bus',
        display: '_bus_'
      },
      {
        apiValue: 'Train',
        display: '_train_'
      },
      {
        apiValue: 'Plane',
        display: '_plane_'
      },
      {
        apiValue: 'Boat',
        display: '_boat_'
      },
      {
        apiValue: 'Other',
        display: '_other_'
      }
    ],
    localTimeUpdates: {
      format: 'h.mm A',
      interval: 1000*60 // every minute
    },
    'imageCarousel': {
      minImages: 6
    },

    // Date formatting rules for reservations
    'checkInDateFormats': {
      'defaultFormat': 'MMM YYYY',
      'rules': [
        {
          // It shows the day (day name) if the
          // check in date is within the next 7 days
          max: 8 * 86400000,
          // Only for future dates
          min: 0,
          format: 'ddd'
        },
        {
          // If the check in date is between 8 and 90 days
          // it shows the numeric date and the month (ie 5 Aug)
          min: 8 * 86400000,
          max: 90 * 86400000,
          format: 'DD MMM'
        },
        {
          // If it's 90 days away it shows the month and year
          min: 90 * 86400000,
          format: 'MMM YYYY'
        }
      ]
    },
    'cloudinary': {
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/Mobius/NAT/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1458826808/Mobius/NAT/',
      'suffix': '.png'
    },
    // See: http://openweathermap.org/wiki/API/Weather_Condition_Codes
    'weatherTypes': {
      'cloudy': [ 802, 803, 804, 701, 711, 721, 731, 741],
      'heavy-rain': [502, 503, 504, 511, 521, 522],
      'light-rain': [300, 301, 302, 310, 311, 312, 321, 500, 501, 520],
      'snow': [600, 601, 602, 611, 621, 903],
      'sun': [800, 904],
      'sunny-cloudy': [801],
      'thunder': [200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 906],
      'wind': [900, 902, 905],
      'wind-rain': [901]
    },
    'forms': {
      'contactSubjects': [
        {
          key: 'My Reservation',
          value: 'My Reservation'
        },
        {
          key: 'Customer Feedback',
          value: 'Customer Feedback'
        },
        {
          key: 'Technical Issues',
          value: 'Technical Issues'
        },
        {
          key: 'Event Inquiry',
          value: 'Event Inquiry'
        },
        {
          key: 'General',
          value: 'General'
        }
      ]
    },
    // Form prefill default delay
    'autofillSync': {
      'delay': 500
    },
    //Footer: type: advanced or simple (advanced for national for example)
    'footer':{
      'displaySitemap': false,
      'type': 'advanced',
      'advanced': {
        'logo':{
          'src': '/static/images/hotelFooterLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      }
    }
  }
});
