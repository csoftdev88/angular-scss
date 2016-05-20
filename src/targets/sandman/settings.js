'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 1,
  'authType': 'infiniti',
  'infiniti': {
    'enable': true,
    'development': 'http://prestige-test.suttonplace.com/track/content/infiniti.js',
    'integration': 'http://prestige-test.suttonplace.com/track/content/infiniti.js',
    'staging': 'http://prestige-test.suttonplace.com/track/content/infiniti.js',
    'live': 'http://prestige-test.suttonplace.com/track/content/infiniti.js'
  },
  'sentry': {
    'enable': true,
    'development': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'integration': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'staging': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
    'live': 'https://75b4292eef0c40b3aee999d89858367c@app.getsentry.com/53504'
  },
  'evolutionInfiniti': {
    'enable': false,
    'id': '',
    'bridge': '',
    'script': {
      'development': '',
      'integration': '',
      'staging': '',
      'live': '',
    }
  },
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
  'googleAnalytics': {
    'enable': false,
    'id': ''
  },
  'googleTagManager': {
    'enable': false,
    'trackUserId': true,
    'id': ''
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    'chainCode': 'SAN',
    'baseURL': {
      'development': 'http://test-services.suttonplace.com:3010/api/4.0/',
      'integration': 'http://test-services.suttonplace.com:3010/api/4.0/',
      'staging': 'http://staging.api.suttonplace.com:3010/api/4.0/',
      'live':  'https://api.suttonplace.com/api/4.0/'
    },
    'mobiusTracking': {
      'enable': true,
      'search': 'properties/track/search',
      'purchase': 'properties/track/purchase'
    },
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
      'cancelAnon': 'reservations/:reservationCode/actions/cancel?email=:reservationEmail',
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/',
      'action': 'reservations/:reservationCode/actions/:actionType',
      'anonCustomerProfile': 'customers/:customerId?email=:customerEmail&isAnon=true'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-chainId': '1',
      'Mobius-channelId': {
        'web': '6',
        'mobile': '23'
      }
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
      }
    },
    'rewards': {
      // NOTE: Inconsistent API
      'all': 'rewards',
      // + BUY(post)
      'my': 'customers/:customerId/rewards'
    },
    'promoCodes': {
      'promoCode': 'corpCode',
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
      'singleProperty': false,
      'facebookAppId': '',
      'disableMainHeaderStyle': true,
      'applyPropertyChainClassToBody': true
    },
    'adverts' : {
      'randomMainPageAdvertSize' : 'homepage-advert',
      'heroAdverts': 'hero-advert'
    },
    'loginDialog' : {
      'showLoginTitle' : false
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
      'showHotels': true,
      'showHotDeals': true,
      'showMeetingsBanquets': true,
      'showOffers': true,
      'showAbout': true,
      'showNews': false,
      'showContact': false,
      'offerSpecificToSelectedProperty': true,
      'maxOffersCount': 7,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': true,
      'standalone': true
    },
    // Social links
    'displaySocialLinks': true,
    'socialLinks': [
      {'network': 'blog', 'link': 'https://sandmanhotelgroup.wordpress.com/'},
      {'network': 'facebook', 'link': 'https://www.facebook.com/SandmanHotelGroup'},
      {'network': 'twitter', 'link': 'https://twitter.com/sandmanhotels'},
      {'network': 'instagram', 'link': 'https://www.instagram.com/sandmanhotels/'},
      {'network': 'google', 'link': 'https://plus.google.com/+SandmanHotelGroup'}
    ],
    'shareLinks': {
      'facebook': true,
      'twitter': true,
      'googleplus': true,
      'mail': true,
      'twitterUsername': 'SuttonPlaceHtl'
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
      'chainPrefix': 'Sutton Place Hotels',
      //List of rooms and their products
      'defaultNumberOfRooms': 2,
      'numberOfRoomsAddedOnMobile': 2,
      'rooms': {
        'sortRoomsByWeighting': true,
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        'showRoomCount': false,
        //Show room highlight text instead of description
        'showRoomHighlight': true,
        'displayRatesOnLoad': false,
        'displayAmenities': true,
        'displayRoomDetails': true,
        'roomDetailThumbnailSize':{
          'width': 150,
          'height': 150
        },
        'includeSlider': false,
        'includeTripAdvisorPreloader': true,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Book Now',
          'ratesPerRoomOnDesktop': 3,
          'ratesPerRoomOnMobile': 2,
          'showDescription': true,
          'showDescriptionToggle': false,
          'showNoRatesSubDescription': false,
          'showRateInfoIcon': true,
          'showRateInfoLink': false
        }

      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': true,
      'removeScrollToRoomsOnFinish': true,
      'headerPartial':{
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'partials':{
        'hotelHeader': false,
        'hotelDatesSelected': false,
        'hotelInfo': true,
        'hotelRooms': true,
        'hotelServices': true,
        'hotelLocation': true,
        'hotelOffers': true
      }
    },
    //rate lookup teasers
    'showHotelDetailsTestimonials': true,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonialsCarousel': true,
    'hotelDetailsTestimonialsCarouselDelay': 4000,
    'hotelDetailsTestimonials':
    [{
      'property': 'VAN',
      'review': '“My new favourite in Vancouver',
      'reviewer': {
        'name': 'Denise K',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450183019/SAN/rateLoading/denisek.jpg',
        'location': 'Toronto, Canada'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“Perfect in every way...service, location, comfort!!”',
      'reviewer': {
        'name': 'Karikins',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450183317/SAN/rateLoading/karinkins.jpg',
        'location': 'Kamloops, Canada'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“A high point of our two week trip”',
      'reviewer': {
        'name': 'Magnolia13',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450183173/SAN/rateLoading/magnolia13.jpg',
        'location': 'Thomasville, Georgia'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“A Lovely Downtown Hotel that shines with elegance and professionalism.”',
      'reviewer': {
        'name': 'CdnTrekkie',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450183317/SAN/rateLoading/cdntrekkie.jpg',
        'location': 'Vancouver, BC'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“Pretty smart! We dont like being too posh but felt quite comfortable here.”',
      'reviewer': {
        'name': 'John C',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450183317/SAN/rateLoading/johnc.jpg',
        'location': 'Jasper, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Great Hotel - Friendly, Helpful Staff”',
      'reviewer': {
        'name': 'Judy B',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450184767/SAN/rateLoading/judyb.jpg',
        'location': 'Penticton, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Wonderful Hotel!”',
      'reviewer': {
        'name': 'Melissa P',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450194394/SAN/rateLoading/Melissa_P.jpg',
        'location': 'Grande Prairie, Canada'
      },
      'stars': 5
    }, {
      'property': 'EDM',
      'review': '“Lovely place ”',
      'reviewer': {
        'name': 'Dan468',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450194584/SAN/rateLoading/dan468.jpg',
        'location': 'Vancouver, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Fabulous hotel!”',
      'reviewer': {
        'name': 'LaraKitty',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450194963/SAN/rateLoading/LaraKitty.jpg',
        'location': 'N/A'
      },
      'stars': 5
    }, {
      'property': 'EDM',
      'review': '“Just like coming home”',
      'reviewer': {
        'name': 'Timothy S',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195156/SAN/rateLoading/Timothy_S.jpg',
        'location': 'Whitecourt, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“A Perfect stay”',
      'reviewer': {
        'name': 'SammyT819',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195367/SAN/rateLoading/SammyT819.jpg',
        'location': 'Kelowna, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Awesome room and great location”',
      'reviewer': {
        'name': 'David G',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195480/SAN/rateLoading/David_G.jpg',
        'location': 'Orlando, Florida'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Exquisite Suites”',
      'reviewer': {
        'name': 'andyg_Can',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195582/SAN/rateLoading/andyg_Can.jpg',
        'location': 'Calgary, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Surreal”',
      'reviewer': {
        'name': 'PIYUSH J',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195804/SAN/rateLoading/PIYSH_J.jpg',
        'location': 'Amsterdam'
      },
      'stars': 5
      },
      {
        'property': 'REV',
        'review': '“Our two night stay turned into three...”',
        'reviewer':
        {
          'name': 'MTnLZ',
          'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/v1450195906/SAN/rateLoading/mtnlz.jpg',
          'location': 'NW Subs of IL'
        },
        'stars': 5
      }
    ],
    'roomDetails': {
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': true,
      //show room highlight before description
      'showRoomHighlight': true,
      'includeTripAdvisorPreloader': true,
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'thumbnails':{
          'width': 150,
          'height': 100
        },
        //displayPrice can be button or text
        'displayPrice': 'text'
      }
    },

    'reservations': {
      // Confirmation number display settings per hotel(code)
      'confirmationNumber': {
        'REV': {
          'displayOnListView': true,
          'displayOnDetailsView': true
        },
        'EDM': {
          'displayOnListView': true,
          'displayOnDetailsView': true
        },
        'VAN': {
          'displayOnListView': true,
          'displayOnDetailsView': true
        }
      },
      'headerPartial':{
        'display': false,
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
      'showBenefits': true
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
      'price': false
    },
    // List of currencies and their display symbols
    'currencies': {
      'default': 'GBP',

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
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      }
    },
    'profilePage':{
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'displaySummary': false,
      'displayMap': false,
      'allowPasswordChange': false
    },

    'languages': {
      'headerAlignment': 'right',
      'dropdown': true,
      'default': 'en-us',
      'en-us': {
        'shortName': 'EN',
        'name': 'English (US)',
        'decimalSeparator': '.',
        'groupSeparator': ',',
        'groupSize': 3,
        'neg': '-'
      },
      'en-ca': {
        'shortName': 'EN',
        'name': 'English (CAN)',
        'decimalSeparator': '.',
        'groupSeparator': ',',
        'groupSize': 3,
        'neg': '-'
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      "datePickerNumberOfMonths": 2,
      "datePickerHasCounter": true,
      "datePickerCounterIncludeDates": true,
      "datePickerCloseOnDatesSelected": true,
      "checkAvailabilityOnChange": false,
      "checkOfferAvailabilityOnChange": false,
      'hasMutiroomTab': true,
      'hasRatesSelection': true,
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
          'value': -15,
          'type': 'days'
        },
        'to': {
          // Extra day/month added to a date
          'value': 15,
          'type': 'days'
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
      'priceBreakdownExtended': true,
      //display hero slider on booking page
      'displayHeroSlider': false,
      //display advanced header
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      //Booking steps navigation
      'bookingStepsNav':{
        'display': false
      },
      //Prompt to ask user to login
      'loginCta':{
        'display': true
      },
      //Additional details screen
      'additionalDetails':{
        'departureTime': {
          'display': true
        },
        'tel2': {
          'display': true
        },
        'comments':{
          'display': true,
          'position': 'top'
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
      ]
    },

    // Widget names and their templates
    'templates': {
      'about-hotel': '<about-hotel></about-hotel>',
      'best-offers': '<best-offers></best-offers>',
      'best-hotels': '<best-hotels></best-hotels>',
      'hotels': '<hotels></hotels>',
      'room': '<room></room>',
      'room-aside': '<room-aside></room-aside>'
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
        'formGrid': 8,
        'hasContactDetails': true,
        'hasMap': false
      },
      'hotels': {
        'showRegionDescription': false
      },
      'hotelDetails':{
        'hasViewMore': true,
        'hasTitle': true
      },
      'userProfile':{
        'hasAvatar': true,
        'hasWelcomeMessage': false,
        'hasPrestigeAccount': true,
        'hasLoyaltyInfo': false,
        'displayPointsWithUsername': true
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': true,
        'displayStaticContent': false
      },
      'locationMap':{
        'displayMainTitle': false,
        'displayGoogleMapsLink': true,
        'displayIcons': true,
        'directionsLink':{
          'display': false,
          'link': ''
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
    'defaultCountryCode': 'ca',
    'preferredCountryCodes': 'ca,us,gb',
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
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/SAN/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/SAN/rooms_amenities/',
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
          key: 'Prestige and Loyalty',
          value: 'Prestige and Loyalty'
        },
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
