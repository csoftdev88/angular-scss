'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  //check with backend what the defaultProductRateId value is
  'defaultProductRateId': 1,
  //authType can be "infiniti" or "mobius", infiniti is used if current tenant has loyalty program
  'authType': 'mobius',
  //If authType is "infiniti", infiniti must be enabled and environment urls must be set
  'infiniti': {
    'enable': false,
    'development': '',
    'integration': '',
    'staging': '',
    'live': ''
  },
  //Sentry error log, should always be enabled and urls remain the same regardless of client so leave as is
  'sentry': {
    'enable': true,
    'development': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'integration': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'staging': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'live': 'https://75b4292eef0c40b3aee999d89858367c@app.getsentry.com/53504'
  },
  //temporary as still in development, meant to replace current inifniti
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
  //Infiniti e-coomerce tracking - Only if authType === infiniti - get endpoint from PM
  'infinitiEcommerceTracking': {
    'enable': false,
    'infinitiId': '',
    'endpoint': {
      'development': '',
      'integration': '',
      'staging': '',
      'live': ''
    }
  },
  //Google analytics, enable and set id per client's needs
  'googleAnalytics': {
    'enable': false,
    'id': ''
  },
  //Google Tag Manager, enable and set id per client's needs
  'googleTagManager': {
    'enable': false,
    'trackUserId': true,
    'id': ''
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    //Client chainCode, for example "SAN" for Sutton, check with admin for relevant client chainCode
    'chainCode': '',
    //API base url, check with WS devs for relevant url and environment variations
    'baseURL': {
      'development': '',
      'integration': '',
      'staging': '',
      'live':  ''
    },
    //Mobius product search/purchase tracking, check if enabled
    'mobiusTracking': {
      'enable': false,
      'search': 'properties/track/search',
      'purchase': 'properties/track/purchase'
    },
    //All API endpoints, leave as is
    'contents': {
      'contents': 'contents',
      'about': 'contents/about',
      'news': 'contents/news',
      'offers': 'contents/offers',
      'adverts': {
        'adverts': 'contents/teasers',
        'random': 'contents/teasers/random'
      }
    },
    'chain': {
      'get': 'chains/:chainCode/'
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
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/',
      'action': 'reservations/:reservationCode/actions/:actionType',
      'anonCustomerProfile': 'customers/:customerId?email=:customerEmail&isAnon=true'
    },
    //API request headers, check with PM for tenant values
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-chainId': '1',
      'Mobius-channelId': {
        'web': '6',
        'mobile': '23'
      }
    },
    'sessionData': {
      'includeInApiCalls': false,
      'cookieName': 'mobiusSessionData',
      'httpHeaderFieldName': 'sessionData',
      //cookie expiry in minutes
      'expiry': 15,
      'data':{
        'infinitiSessionId': null,
        'customerId': null,
        'channel': null,
        'sessionId': null
      }
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
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'generics': {
      //Set to true if only 1 property to bypass hotels overview page
      'singleProperty': true,
      //facebook app id required for facebook sharing
      'facebookAppId': '',
      //refer to directive for functionality and check with designers for headers styles
      'disableMainHeaderStyle': true
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
      'showOffers': false,
      'showAbout': false,
      'showNews': false,
      'showContact': false,
      'offerSpecificToSelectedProperty': false,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': false,
      //standlone means below the main-nav
      'standalone': false
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
    //TODO: remove this
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
      //List of rooms and their products
      'defaultNumberOfRooms': 999,
      'numberOfRoomsAddedOnMobile': 2,
      'rooms': {
        'sortRoomsByWeighting': false,
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        'showRoomCount': false,
        //Show room highlight text instead of description
        'showRoomHighlight': false,
        'displayRatesOnLoad': true,
        'displayAmenities': false,
        'displayRoomDetails': false,
        'roomDetailThumbnailSize':{
          'width': 266,
          'height': 156
        },
        'includeSlider': true,
        'includeTripAdvisorPreloader': false,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Book Now',
          'ratesPerRoomOnDesktop': 20,
          'ratesPerRoomOnMobile': 2,
          'showDescription': true,
          'showDescriptionToggle': true,
          'showNoRatesSubDescription': true,
          'showRateInfoIcon': false,
          'showRateInfoLink': true
        }

      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': false,
      'removeScrollToRoomsOnFinish': false,
      'headerPartial':{
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      //hotel detail page partials and their order
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
    //rate lookup teasers - used a preloader when loading rates
    'showHotelDetailsTestimonials': false,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonials': 
    [
    //{
    //  'property': 'VAN',
    //  'review': '“My new favourite in Vancouver',
    //  'reviewer': {
    //    'name': 'Denise K',
    //    'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/v1450183019/SAN/rateLoading/denisek.jpg',
    //    'location': 'Toronto, Canada'
    //  },
    //  'stars': 5
    //}
    ],

    'roomDetails': {
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': false,
      //show room highlight before description
      'showRoomHighlight': false,
      'includeTripAdvisorPreloader': false,
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'thumbnails':{
          'width': 264,
          'height': 183
        },
        //displayPrice can be button or text
        'displayPrice': 'button'
      }
    },

    'reservations': {
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
        'passbook': true,
        'print': true
      }
    },

    'aboutHotel': {
      'showBenefits': false
    },
    // toggle filters on hotels page
    'hotelFilters': {
      'stars': true,
      'minStars': 3,
      'maxStars': 5,
      'tripAdvisor': true,
      'minTaRating': 3,
      'maxTaRating': 5,
      'rates': true,
      'price': true
    },
    // List of currencies and their display symbols - check /generics/currencies/ endpoint for supported currencies
    'currencies': {
      'default': 'CHF',

      'CHF': {
        'code': 'CHF',
        'symbol': 'CHF',
        'format': '{{amount}}{{symbol}}'
      },

      'GBP': {
        'code': 'GBP',
        'symbol': '£',
        'format': '{{symbol}} {{amount}}'
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
      'discountCodeCookieExpiryDays': 5
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
        'decimalSeparator': ',',
        'groupSeparator': '\u00a0',
        'groupSize': 3,
        'neg': '-'
      },
      'fr': {
        'shortName': 'FR',
        'name': 'French',
        'decimalSeparator': '',
        'groupSeparator': '\u00a0',
        'groupSize': 3,
        'neg': '-'
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      //Number of months displayed at once in date picker
      "datePickerNumberOfMonths": 1,
      //Display number of nights selected in date picker
      "datePickerHasCounter": true,
      //display arrival/departures dates alongside number of nights in date picker
      "datePickerCounterIncludeDates": false,
      //close date picker when departure date is selected
      "datePickerCloseOnDatesSelected": false,
      "checkAvailabilityOnChange": false,
      "checkOfferAvailabilityOnChange": false,
      'hasMutiroomTab': false,
      //Adds a rates dropdown in booking widget used to update productGroupId in booking params
      'hasRatesSelection': false,
      // Suggest MRB when number of adults is higher
      // than this value and server returns no products
      'maxAdultsForSingleRoomBooking': 3,
      'includeAllPropertyOption': true,
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
        },
        'discover': {
          'name': 'Discover',
          'code': 'DS',
          'icon': 'discover',
          'regex': /^6(?:011|5[0-9]{2})[0-9]{3,}$/
        }
      },
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
      //Prompt to ask user to login
      'loginCta':{
        'display': false
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
        }
      }
    },
    'myAccount' : {
      'displaySettings' : {
        'profile': true,
        'badges': false,
        'rewards': true,
        'loyalities': false
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
        'hasContactDetails': false,
        'hasMap': true
      },
      'hotels': {
        'showRegionDescription': false
      },
      'hotelDetails':{
        'hasViewMore': false,
        'hasTitle': false,
        'hotelInfo': {
          'descriptionGrid': 8,
          'sidebarGrid': 4
        }
      },
      'userProfile':{
        'hasAvatar': false,
        'hasWelcomeMessage': true,
        'hasPrestigeAccount': false,
        'hasLoyaltyInfo': true,
        'displayPointsWithUsername': false
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': false,
        'displayPropertyTitle': false,
        'displayRoomTitle': false,
        'displayStaticContent': true
      },
      'locationMap':{
        'displayMainTitle': true,
        'displayGoogleMapsLink': false,
        'displayIcons': false,
        'directionsLink':{
          'display': true,
          'link': 'http://www.grandhotel-national.com/media/39232/route-map.pdf'
        }
      }
    },

    // Policy codes from the API and their title translates
    'policies': {
      'cancellation': 'Cancellation',
      'checkInOut': 'Check-In-Out',
      'extraGuest': 'Extra Guest',
      'family': 'Family',
      'guarantee': 'Guarantee',
      'noShow': 'No Show',
      'pet': 'Pet'
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
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/Mobius/NAT/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/v1458826808/Mobius/NAT/',
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
