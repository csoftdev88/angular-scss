'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 9,
  'authType': 'mobius',
  'loyaltyProgramEnabled': false,
  'infiniti': {
    'enable': false,
    'development': '',
    'integration': '',
    'staging': '',
    'uat': '',
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
      'uat': 'https://storage.googleapis.com/infiniti-evolution/infiniti.evolution.js',
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
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    'chainCode': 'LIND',
    'baseURL': {
      'development': '//integration-www-lindner.mobiusbookingengine.com/api/4.0/',
      'integration': '//integration-www-lindner.mobiusbookingengine.com/api/4.0/',
      'staging': '//staging-www-lindner.mobiusbookingengine.com/api/4.0/',
      'uat': '/api/4.0/',
      'live':  'http://lindner.mobiuswebservices.com/api/4.0/'
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
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/',
      'action': 'reservations/:reservationCode/actions/:actionType',
      'anonCustomerProfile': 'customers/:customerId?email=:customerEmail&isAnon=true'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-chainId': '2',
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
      'promoCode': 'corpCode',
      'groupCode': 'groupCode',
      'corpCode': 'corpCode'
    }
  },
  'UI': {
    'chains': ['LIND'],
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'generics': {
      'singleProperty': false,
      'facebookAppId': '',
      'loyaltyProgramEnabled': false,
      'disableMainHeaderStyle': true,
      'longDateFormat': 'Do MMM YYYY',
      'showAltNav': false,
      'applyChainClassToBody': false,
      'orderPropertiesByChain': false
    },
    'contents':{
      'displayContentImageInHeroSlider': false
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
      'hotelMenuContent': {
        'service': 'propertyService',
        'method': 'getAll',
        'detailState': 'hotel',
        'listState': 'hotels',
        'paramName': 'propertySlug'
      },
      'showRegionsMegaMenu': false,
      'showOffers': true,
      'showAbout': true,
      'showNews': false,
      'showContact': true,
      'offerlimitedToChainWide': false,
      'offersKeepProperty': true,
      'offerSpecificToSelectedProperty': true,
      'maxOffersCount': 7,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': true,
      'standalone': false,
      'externalRegionLinks':[]
    },
    // Social links
    'displaySocialLinks': true,
    'socialLinks': [
      {'network': 'facebook', 'link': 'https://www.facebook.com/LindnerHotels'},
      {'network': 'twitter', 'link': 'https://twitter.com/Lindner_Hotels'},
      {'network': 'instagram', 'link': 'https://instagram.com/lindnerhotels/'},
      {'network': 'xing', 'link': 'https://www.xing.com/company/lindnerhotels'},
      {'network': 'linkedin', 'link': 'https://www.linkedin.com/company/lindner-hotels-&-resorts'},
      {'network': 'google', 'link': 'https://plus.google.com/+lindnerhotels/posts'}
    ],
    'shareLinks': {
      'facebook': true,
      'twitter': true,
      'googleplus': true,
      'mail': true,
      'twitterUsername': ''
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
      'chainPrefix': '',
      'breadcrumbs': {
        'hotels': true,
        'location': false
      },
      //List of rooms and their products
      'defaultNumberOfRooms': 2,
      'numberOfRoomsAddedOnMobile': 2,
      'rooms': {
        'hideRoomsWithNoAvailability': true,
        'sortRoomsByWeighting': false,
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        'showRoomCount': true,
        //Show room highlight text instead of description
        'showRoomHighlight': false,
        'displayRatesOnLoad': false,
        'displayAmenities': true,
        'displayRoomDetails': true,
        'displayRoomSubtitle': false,
        'rateInfoIsTabbed': false,
        'roomDetailThumbnailSize':{
          'width': 150,
          'height': 150
        },
        'includeSlider': false,
        'sliderHasThumbnails': false,
        'includeTripAdvisorPreloader': false,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Book Now',
          'ratesPerRoomOnDesktop': 20,
          'ratesPerRoomOnMobile': 2,
          'showTagline': false,
          'showDescription': true,
          'showDescriptionToggle': false,
          'showNoRatesSubDescription': false,
          'showRateInfoIcon': true,
          'showRateInfoLink': false,
          'rateInfoIsTabbed': false
        }

      },
      'offers': {
        'toState': 'propertyOffers'
      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': true,
      'removeScrollToRoomsOnFinish': false,
      'displayAmenitiesInHotelInfo': false,
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
    'showHotelDetailsTestimonials': false,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonials':
    [{
      'property': 'VAN',
      'review': '“My new favourite in Vancouver',
      'reviewer': {
        'name': 'Denise K',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183019/SAN/rateLoading/denisek.jpg',
        'location': 'Toronto, Canada'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“Perfect in every way...service, location, comfort!!”',
      'reviewer': {
        'name': 'Karikins',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183317/SAN/rateLoading/karinkins.jpg',
        'location': 'Kamloops, Canada'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“A high point of our two week trip”',
      'reviewer': {
        'name': 'Magnolia13',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183173/SAN/rateLoading/magnolia13.jpg',
        'location': 'Thomasville, Georgia'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“A Lovely Downtown Hotel that shines with elegance and professionalism.”',
      'reviewer': {
        'name': 'CdnTrekkie',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183317/SAN/rateLoading/cdntrekkie.jpg',
        'location': 'Vancouver, BC'
      },
      'stars': 5
    }, {
      'property': 'VAN',
      'review': '“Pretty smart! We dont like being too posh but felt quite comfortable here.”',
      'reviewer': {
        'name': 'John C',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183317/SAN/rateLoading/johnc.jpg',
        'location': 'Jasper, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Great Hotel - Friendly, Helpful Staff”',
      'reviewer': {
        'name': 'Judy B',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450184767/SAN/rateLoading/judyb.jpg',
        'location': 'Penticton, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Wonderful Hotel!”',
      'reviewer': {
        'name': 'Melissa P',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450194394/SAN/rateLoading/Melissa_P.jpg',
        'location': 'Grande Prairie, Canada'
      },
      'stars': 5
    }, {
      'property': 'EDM',
      'review': '“Lovely place ”',
      'reviewer': {
        'name': 'Dan468',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450194584/SAN/rateLoading/dan468.jpg',
        'location': 'Vancouver, Canada'
      },
      'stars': 4
    }, {
      'property': 'EDM',
      'review': '“Fabulous hotel!”',
      'reviewer': {
        'name': 'LaraKitty',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450194963/SAN/rateLoading/LaraKitty.jpg',
        'location': 'N/A'
      },
      'stars': 5
    }, {
      'property': 'EDM',
      'review': '“Just like coming home”',
      'reviewer': {
        'name': 'Timothy S',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195156/SAN/rateLoading/Timothy_S.jpg',
        'location': 'Whitecourt, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“A Perfect stay”',
      'reviewer': {
        'name': 'SammyT819',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195367/SAN/rateLoading/SammyT819.jpg',
        'location': 'Kelowna, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Awesome room and great location”',
      'reviewer': {
        'name': 'David G',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195480/SAN/rateLoading/David_G.jpg',
        'location': 'Orlando, Florida'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Exquisite Suites”',
      'reviewer': {
        'name': 'andyg_Can',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195582/SAN/rateLoading/andyg_Can.jpg',
        'location': 'Calgary, Canada'
      },
      'stars': 5
    }, {
      'property': 'REV',
      'review': '“Surreal”',
      'reviewer': {
        'name': 'PIYUSH J',
        'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195804/SAN/rateLoading/PIYSH_J.jpg',
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
          'avatar': 'http://res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450195906/SAN/rateLoading/mtnlz.jpg',
          'location': 'NW Subs of IL'
        },
        'stars': 5
      }
    ],

    'roomDetails': {
      'displayRoomSubtitle': false,
      'hasBreadcrumbsSecondaryNav': false,
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': true,
      //show room highlight before description
      'showRoomHighlight': false,
      'includeTripAdvisorPreloader': true,
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'useThumbnails': true,
        'thumbnails':{
          'width': 150,
          'height': 100
        },
        //displayPrice can be button or text
        'displayPrice': 'text'
      }
    },

    'reservations': {
      //override per hotel confirmation number per hotel
      'displayConfirmationNumberOnAllHotels': false,
      //confirmation label display
      'displayConfirmationNumberLabel': true,
      // Confirmation number display settings per hotel(code)
      'confirmationNumber': {
        'REV': {
          displayOnListView: true,
          displayOnDetailsView: true
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
      },
      'displayNewsletterCtaOnReservationDetail': false,
      'reservationDetailPriceBreakdownExtended': false
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
      'de': {
        'shortName': 'DE',
        'name': 'German',
        'decimalSeparator': ',',
        'groupSeparator': '\u00a0',
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
      "checkAvailabilityOnChange": false,
      "checkOfferAvailabilityOnChange": false,
      "displayPropertiesMegamenu": false,
      'hasMutiroomTab': true,
      'hasRatesSelection': false,
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
        },
        'discover': {
          'name': 'Discover',
          'code': 'DS',
          'icon': 'discover',
          'regex': /^6(?:011|5[0-9]{2})[0-9]{3,}$/
        }
      },
      //Is billing state a required field?
      'billingStateRequired': true,
      //price breakdown
      'priceBreakdownExtended': false,
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
      //Default value for newsletter opt-in checkbox
      'newsLetterOptedIn': true,
      //Prompt to ask user to login
      'loginCta':{
        'display': true
      },
      //Reverse the same address checkbox logic
      'billingAddress': {
        'reverseCheckboxLogic':true
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
        },
        'optedInDefault': true
      }
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
        'contactDetailsGrid': 4,
        'hasContactDetails': true,
        'hasMap': false,
        'hasDescription': true,
        'includePhoneField': false
      },
      'hotels': {
        'showRegionDescription': true,
        'showLocationDescription': false,
        'displayHotelRegionName': false,
        'displayHotelsCount': false
      },
      'hotelDetails':{
        'hasViewMore': true,
        'hasTitle': true,
        'hotelInfo': {
          'descriptionGrid': 8,
          'sidebarGrid': 4
        }
      },
      'userProfile':{
        'hasAvatar': true,
        'hasWelcomeMessage': false,
        'hasPrestigeAccount': false,
        'hasRewards': true,
        'prestigeIsInfiniti': false,
        'infinitiPrestigeUrl': 'https://prestige.suttonplace.com',
        'hasLoyaltyInfo': true,
        'displayPointsWithUsername': false
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': true,
        'displayPropertyTitle': false,
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
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/Mobius/LIND/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/Mobius/LIND/rooms_amenities/',
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
      'displaySitemap': true,
      'type': 'simple',
      'advanced': {
        'logo':{
          'src': '/static/images/hotelFooterLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      }
    }
  }
});
