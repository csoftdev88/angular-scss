'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 1,
  'authType': 'keystone',
  'loyaltyProgramEnabled': false,
  'newUrlStructure': true,
  'sandmanFrenchOverride': true,
  'inputValidationPattern':/^[\u0020-\u02AF\r\n]+$/i, //Using http://jrgraphix.net/research/unicode_blocks.php Allowed characters from Basic Latin to IPA Extensions
  'showEUCookieDisclaimer':true,
  'enableHotDeals':true,
  'keystone': {
    'development': 'http://localhost:8080/status.0.0.1.js',
    'integration': 'https://scripts.infiniti.io/sandman/status.js',
    'staging': 'https://scripts.infiniti.io/sandman/status.js',
    'live': 'https://scripts.infiniti.io/sandman/status.js'
  },
  'infiniti': {
    'enable': false,
    'local': 'http://integration-sandman.infiniti.io/track/content/infiniti.js',
    'development': 'http://integration-sandman.infiniti.io/track/content/infiniti.js',
    'integration': 'http://integration-sandman.infiniti.io/track/content/infiniti.js',
    'staging': 'http://staging-infiniti-sandman.mobiusbookingengine.com/track/content/infiniti.js',
    'live': '//infiniti.sandmanhotels.com/track/content/infiniti.js'
  },
  'sentry': {
    'enable': true,
    'local': 'https://630800a427394993b60f97aa3f0f2d4f@app.getsentry.com/53500',
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
      'local': '',
      'development': '',
      'integration': '',
      'staging': '',
      'uat':'',
      'live': '',
    }
  },
  'infinitiEcommerceTracking': {
    'enable': false,
    'infinitiId': '',
    'endpoint': {
      'local': '',
      'development': '',
      'integration': '',
      'staging': '',
      'uat':'',
      'live': ''
    }
  },
  'hospitalityEvents': {
    'development': {
      'enable': false
    },
    'integration': {
      'enable': false
    },
    'staging': {
      'enable': false
    },
    'live': {
      'enable': false
    }
  },
  'infinitiApeironTracking': {
    'local': {
      'enable':false,
      'endpoint':'https://webservice.infiniti.io/infiniti-ingester/ecommerce',
      'scriptUrl':'apeiron.infiniti.io/infiniti-tracking/1.0.5-rc3/infiniti.min.js',
      'id':'sandmanuk-local',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'development': {
      'enable':false,
      'endpoint':'https://webservice.infiniti.io/infiniti-ingester/ecommerce',
      'scriptUrl':'apeiron.infiniti.io/infiniti-tracking/1.0.5-rc3/infiniti.min.js',
      'id':'sandmanuk-development',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'integration': {
      'enable':false,
      'endpoint':'https://webservice.infiniti.io/infiniti-ingester/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/infiniti-tracking/1.0.5-rc3/infiniti.min.js',
      'id':'sandmanuk-integration',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'staging': {
      'enable':false,
      'endpoint':'https://webservice.infiniti.io/infiniti-ingester/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/infiniti-tracking/1.0.5-rc3/infiniti.min.js',
      'id':'sandmanuk-staging',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'live': {
      'enable':false,
      'endpoint':'https://webservice.mobiuswebservices.com/infiniti_ingest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/infiniti-tracking/1.0.5-rc3/infiniti.min.js',
      'id':'sandmanuk-live',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'singlePageApp': true
    }
  },
  'derbysoftTracking' : {
    'enable': false,
    'accountCode':'2p'
  },
  // Will need new IDs
  'googleAnalytics': {
    'enable': false,
    'id': ''
  },
  // Will need new IDs
  'googleTagManager': {
    'enable': false,
    'trackUserId': true,
    'id': 'GTM-56G27K'
  },
  'hotjar': {
    'enable': false,
    'id': '294639'
  },
  'rumScript': {
    'enable': false,
    'id': '5910613c8a112b33c9d2e6c7'
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    'chainCode': 'SIGUK',
    'trackUsage': true,
    'languageInPath': true,
    'baseURL': {
      'local': '//localhost:3010/api/4.0/',
      'development': '//integration-www-sandman.mobiusbookingengine.com/api/4.0/',
      'integration': '//integration-www-sandman.mobiusbookingengine.com/api/4.0/',
      'staging': '//staging-www-sandman.mobiusbookingengine.com/api/4.0/',
      'uat': '/api/4.0/',
      'live': 'https://www.sandmanhotels.com/api/4.0/'
    },
    'mobiusTracking': {
      'local': {
        'id': 'sandmanuk-local',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'development': {
        'id': 'sandmanuk-development',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'integration': {
        'id': 'sandmanuk-integration',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://wxi3vsykv4.execute-api.us-west-2.amazonaws.com/int/event/create'
      },
      'staging': {
        'id': 'sandmanuk-staging',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'live': {
        'id': 'sandmanuk-live',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://80ha7ieaqj.execute-api.us-east-2.amazonaws.com/stag/event/create'
      }
    },
    'track404s': {
      'enable':true,
      'url':'https://errors.2pvservices.com/status'
    },
    'campaigns':'campaigns',
    'retention':'retention',
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
      'availabilityOverview': 'properties/:propertyCode/availabilityOverview',
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
    // Is this obsolete? i.e can this be deleted for KEYSTONE tenants?
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
      'new': 'reservations?propertyCode=:property&roomCode=:rooms',
      'modify': 'reservations/:reservationCode',
      'detail': 'reservations/:reservationCode',
      'addons': 'reservations/:reservationCode/addons/',
      'availableAddons': 'addons',
      'inclusionsAsAddons': true,
      'cancel': 'reservations/:reservationCode/actions/cancel',
      'cancelAnon': 'reservations/:reservationCode/actions/cancel?email=:email',
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/',
      'action': 'reservations/:reservationCode/actions/:actionType',
      'anonCustomerProfile': 'customers/:customerId?email=:customerEmail&isAnon=true',
      'checkVoucher': 'voucher',
      'upgradeRoom': 'upgrades/:upgradeGuid'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-tenantId': '1',
      'Mobius-chainId': '3',
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
    },
    'thirdparties': {
      'get': 'thirdparties/:code'
    }
  },
  'UI': {
    'campaigns': {
      display:true
    },
    'alternateBookingFlow': {
      'enabled': true
    },
    'instagramFeed': {
      'images': [
        { url: '/static/images/lbe/insta-1.png'},
        { url: '/static/images/lbe/insta-2.png'},
        { url: '/static/images/lbe/insta-3.png'},
        { url: '/static/images/lbe/insta-4.png'},
        { url: '/static/images/lbe/insta-5.png'}
      ]
    },
    'previousSearches': {
      'enable':true,
      'searchDataCookieName':'MobiusPreviousSearchData',
      'searchDataCookieExpiry':259200, //180 days
      'searchDisplayCookieName':'MobiusPreviousSearchDisplay',
      'searchInSessionCookieName':'MobiusSearchInSession',
      'maxSearches':3
    },
    'membersRate': {
      'defaultSize': 'large'
    },
    'funnelRetention':{
      'enable':false,
      'cookieName': 'MobiusFunnelRetention',
      'inactivityPeriod':30000, //The time limit that when reached denotes that a session is inactive (Milliseconds)
      'inactivityPeriodInterval':1000, //The interval at which inactivity checks are made (Milliseconds)
      'displayExitModal':false
    },
    'highlight': {
      'imageUrl': '/static/images/lbe/sun.png'
    },
    'chains': ['SIGUK'],
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'datepicker': {
      'showToday': false,
      'dateFormat': 'MMM Do'
    },
    'infoBar': {
      'showForSingleBookings': false
    },
    'generics': {
      'singleProperty': false,
      'facebookAppId': '',
      'disableMainHeaderStyle': true,
      'applyChainClassToBody': true,
      'orderPropertiesByChain': true,
      'longDateFormat': 'Do MMM YYYY'
    },
    'contents':{
      'displayContentImageInHeroSlider': true
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
      'preloadImages': true,
      'slideWidth': 1250,
      'slideHeight': 393
    },
    'userMessages': {
      'image': {
        'display': false,
        'url': ''
      }
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
      'showHotDeals': false,
      'showMeetingsBanquets': true,
      'showOffers': true,
      'showAbout': true,
      'showNews': false,
      'showContact': true,
      'offerlimitedToChainWide': true,
      'offersKeepProperty': false,
      'offerSpecificToSelectedProperty': false,
      'maxOffersCount': 4,
      'maxAboutCount': 5,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': true,
      'standalone': true,
      'externalRegionLinks':[]
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
      'chainPrefix': 'Sandman Hotels UK',
      'breadcrumbs': {
        'hotels': false,
        'location': true
      },
      'scrollToRates': 20,
      //List of rooms and their products
      'defaultNumberOfRooms': 2,
      'defaultNumberOfRoomsMobile':10,
      'numberOfRoomsAddedOnMobile': 2,
      //Allow subpages to redirect if specified in admin
      'subPageRedirects': true,
      'rooms': {
        'hideRoomsWithNoAvailability': true,
        'sortRoomsByWeighting': true,
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        'showRoomCount': true,
        //Show room highlight text instead of description
        'showRoomHighlight': true,
        'desktopDisplayRatesOnLoad': false,
        'mobileHideRates':true,
        'displayAmenities': true,
        'displayRoomDetails': true,
        'displayRoomSubtitle': true,
        'hideShowInfoIcon': true,
        'roomDetailThumbnailSize':{
          'width': 150,
          'height': 150
        },
        'includeSlider': true,
        'sliderHasThumbnails': true,
        'includeTripAdvisorPreloader': false,
        'roomsAsLinks': true,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Select', //This config value doesn't appear to be used anywhere, but will retain for now anyway.
          'ratesPerRoomOnDesktop': 3,
          'ratesPerRoomOnMobile': 2,
          'showTagline': true,
          'showDescription': true,
          'showDescriptionToggle': false,
          'showNoRatesSubDescription': false,
          'showRateInfoIcon': true,
          'showRateInfoLink': false,
          'rateInfoIsTabbed': true,
          'displayOtaRates': true,
          'highlightFirstRate': true,
          'showSlashThrough': true,
          'showInclusions': false
        },
        'upsells': {
          'display': false
        },
        'alternativeDisplays': {
          'dates':{
            'enable':true,
            'flexiRange':3, //The +/- range for alt dates. i.e. 3 returns 3 days before and 3 days after (7 in total)
          },
          'properties':{
            'enable':true
          }
        },
        'restrictAmenities':true //Only display amenities with an asterix at the beginning of the name
      },
      'offers': {
        'toState': 'propertyHotDeals',
        'singleOfferMobile':true //Only display one offer on mobile view
      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': true,
      'removeScrollToRoomsOnFinish': true,
      'displayAmenitiesInHotelInfo': true,
      'findOutMoreLinksBottomMobile':true, //Positions the find out more section to the bottom of the page on mobile
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
        'hotelServices': false,
        'hotelRooms': false,
        'hotelRoomsCompare': true,
        'hotelLocation': true,
        'hotelOffers': true,
        'hotelReadMoreMobile': true
      },
      'bookingStatistics':{
        'display': true,
        'displayDelay':5000,
        'displayTime':2000000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
      },
      'restrictAmenities':true, //Only display amenities that's name begins with asterix
      'hideViewMoreImagesMobile':true, //Hide the view more images on mobile
      'shortenDescriptionMobile':true //Shorten the description with read more on mobile
    },
    //rate lookup teasers
    'showHotelDetailsTestimonials': true,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonialsCarousel': true,
    'hotelDetailsTestimonialsCarouselDelay': 4000,
    'hotelDetailsTestimonials':[],
    'roomDetails': {
      'displayRoomSubtitle': true,
      'hasBreadcrumbsSecondaryNav': true,
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': true,
      //show room highlight before description
      'showRoomHighlight': true,
      'includeTripAdvisorPreloader': false,
      'rateInfoIsTabbed': true,
      'showLocalInfo': true,
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'useThumbnails': false,
        'hide': true,
        'thumbnails':{
          'width': 150,
          'height': 100
        },
        //displayPrice can be button or text
        'displayPrice': 'text'
      },
      'bookingStatistics':{
        'display':true,
        'displayDelay':5000,
        'displayTime':20000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
      },
      'showSlashThrough': true,
      'showMetaView': true,
      'upsells': {
        'display': false
      },
      'displayAltProduct':false,
      'showProductImage':true,
      'ratesAsLinks':false,
      'productImages': {
        'height':125,
        'width':145
      },
      'restrictAmenities':true
    },

    'reservations': {
      //override per hotel confirmation number per hotel
      'displayConfirmationNumberOnAllHotels': true,
      //confirmation label display
      'displayConfirmationNumberLabel': true,
      // Confirmation number display settings per hotel(code)
      // Leaving as is - unused
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
      },
      'displayNewsletterCtaOnReservationDetail': true,
      'reservationDetailPriceBreakdownExtended': true,
      'displayAddonVoucherEntry': true,
      'displayAddonComments': false,
      'hideHeroSliderOnReservations':true
    },

    'aboutHotel': {
      'showBenefits': true
    },
    'aboutChain': {
      'offersLimit': 999
    },
    // toggle filters on hotels page
    'hotelFilters': [
      {
        'type': 'sort',
        'enable': true,
        'displayInSidebar': true,
        'accordion': false
      },
      {
        'type': 'tripAdvisor',
        'enable': true,
        'minTaRating': 2,
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
        'enable': true,
        'accordion': false
      },
      {
        'type': 'tags',
        'enable': true,
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
        'type': 'stars',
        'enable': true,
        'minStars': 3,
        'maxStars': 5,
        'displayStarsOnHotels': false,
        'accordion': true
      },
      {
        'type': 'reset',
        'enable': false,
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
        'symbol': 'CAD',
        'format': '{{amount}} {{symbol}}',
        'shortSymbol': '$',
        'shortFormat': '{{symbol}}{{amount}}',
      }
    },

    'offers':{
      'discountCodeCookieExpiryDays': 5,
      'displayPageHeading': true,
      'includeOfferAvailabilityPropertyDropdown': true,
      'displayOfferImageInHeroSlider': false,
      'height': 200,
      'width': 307,
      'scrollToBreadcrumbs': true,
      //if number of words greater than [key], wrap the first [value] words in span for styling
      'offersThumbnailsTitlePattern':{
        '0': 1,
        '3': 2
      }
    },
    'regions':{
      'bookingStatistics':{
        'display':true,
        'displayDelay':5000,
        'displayTime':10000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
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

    'aboutUs': {
      'scrollToBreadcrumbs': true
    },

    'languages': {
      'headerAlignment': 'left',
      'dropdown': false,
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
      },
      'fr': {
        'shortName': 'FR',
        'name': 'French',
        'decimalSeparator': '.',
        'groupSeparator': '\u00a0',
        'groupSize': 3,
        'neg': '-'
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      'datePickerNumberOfMonths': 2,
      'datePickerHasCounter': true,
      'datePickerHasTitle': false,
      'datePickerCounterIncludeDates': true,
      'datePickerCloseOnDatesSelected': false,
      // 'defaultRegion':'UK',
      'checkAvailabilityOnChange': false,
      'checkOfferAvailabilityOnChange': false,
      'displayPropertiesMegamenu': true,
      'displaySelectAllHotelsAction':false,
      'hasMultiroomTab': false,
      'hasRatesSelection': true,
      'timezone':'Europe/London',
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
      'availabilityOverview': {
        'display':true
      },
      'flexibleDates': {
        'enable':true
      },
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
      },
      'mobileTopRight':true, //Displays the booking book now button in top right
      'prefillGrowlAlert':true, //When enabled will display a growl alert if code field is prefilled
      'keepPrefillStyle':true //By default prefill style is hidden after 1 second. When enabled this will prevent it from being hidden.
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
      'emailOptinUnderOverview': true,
      'voucherInBillingSection': true,
      //Is billing state a required field?
      'billingStateRequired': true,
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
        'display': true,
        'showInReservationWidget': true
      },
      //Default value for newsletter opt-in checkbox
      'newsLetterOptedIn': false,
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
        },
        'email2':{
          'display': true
        },
        'email3':{
          'display': true
        }
      },
      'vouchers' : {
        'enable':true
      },
      'reservationAssurance': {
        display: false,
        payment: true,
        price: true,
        security: true
      }
    },
    'myAccount' : {
      'displaySettings' : {
        'profile': true,
        'tier': false,
        'badges': false,
        'rewards': false,
        'loyalities': false,
        'description': true
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
        'formGrid': 12,
        'contactDetailsGrid': 12,
        'hasContactDetails': true,
        'hasMap': false,
        'hasDescription': false,
        'includePhoneField': true,
        'showStaticContactInfo': true
      },
      'hotels': {
        'showRegionDescription': false,
        'showLocationDescription': true,
        'displayHotelRegionName': true,
        'displayMap': true,
        'displayHotelsCount': true,
        'defaultViewMode': 'list',
        'displayCompare': true,
        'bookingStatistics':{
          'display':true,
          'displayDelay':3000,
          'displayTime':10000, //The length that you wish the alerts to appear for
          'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
        }
      },
      'hotelDetails':{
        'hasViewMore': true,
        'hasTitle': true,
        'scrollToOffset': 50,
        'showSubNav': false,
        'hotelInfo': {
          'descriptionGrid': 7,
          'sidebarGrid': 5
        }
      },
      'roomDetails':{
        'hasViewMore': true,
        'showInclusions': false,
        'showTagline': true,
        'roomInfo': {
          'descriptionGrid': 7,
          'sidebarGrid': 5
        }
      },
      'userProfile':{
        'hasAvatar': true,
        'hasWelcomeMessage': false,
        'hasPrestigeAccount': false,
        'hasRewards': false,
        'prestigeIsInfiniti': false,
        'infinitiPrestigeUrl': 'https://prestige.suttonplace.com',
        'hasLoyaltyInfo': false,
        'displayPointsWithUsername': true
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': true,
        'displayPropertyTitle': true,
        'displayStaticContent': false,
        'propertyHotDealsShowTitle': true
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
      format: 'h:mm A',
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
          format: 'Do MMM'
        },
        {
          // If it's 90 days away it shows the month and year
          min: 90 * 86400000,
          format: 'MMM YYYY'
        }
      ]
    },
    'cloudinary': {
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/{chainCode}/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/{chainCode}/room_amenities/',
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
    },
    'otaRates': [
      {
        'name': 'expedia',
        'logo': '/static/images/expedia_logo.png'
      },
      {
        'name': 'bookingcom',
        'logo': '/static/images/bookingcom_logo.png'
      },
      {
        'name': 'priceline',
        'logo': '/static/images/priceline_logo.png'
      }
    ],
    'thirdparties': {
      'enable': true,
      'menu': {
        'showHotels': false,
        'showRegionsMegaMenu': true,
        'showHotDeals': false,
        'showMeetingsBanquets': false,
        'showOffers': false,
        'showAbout': true,
        'showNews': false,
        'showContact': false
      }
    }
  }
});
