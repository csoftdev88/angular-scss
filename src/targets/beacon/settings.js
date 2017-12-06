'use strict';

angular.module('mobiusApp.config', ['mobiusApp.dynamicMessages'])

.constant('Settings', {
  'forceCustomHeroContent': true,
  'customHeroContent': [
    {
      uri: '/static/images/carousel/slider-1.jpg',
      title: 'Lowest Rates!',
      subtitle: 'Excelsior Members Receive a 10% Discount.'
    },
    {
      uri: '/static/images/carousel/slider-2.jpg',
      title: 'Get Rewarded',
      subtitle: 'Members Get Early Check In & Late Checkout Guaranteed!'
    },
    {
      uri: '/static/images/carousel/slider-3.jpg',
      title: 'Free Beverages',
      subtitle: 'Members receive free complimentary refreshments'
    },
    {
      uri: '/static/images/carousel/slider-4.jpg',
      title: 'Lowest Rates!',
      subtitle: 'Excelsior Members Receive a 10% Discount.'
    },
    {
      uri: '/static/images/carousel/slider-5.jpg',
      title: 'Get Rewarded',
      subtitle: 'Members Get Early Check In & Late Checkout Guaranteed!'
    }
  ],
  'customPreviewImages': [
    {uri: '/static/images/carousel/hotel-1.jpg'},
    {uri: '/static/images/carousel/hotel-2.jpg'},
    {uri: '/static/images/carousel/hotel-3.jpg'}
  ],
  'autoPopulateDates': true,
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 1,
  'authType': 'mobius',
  'engine': 'loyalty',
  'loyaltyProgramEnabled': true,
  'newUrlStructure': true,
  'sandmanFrenchOverride': false,
  'inputValidationPattern':/^[\u0020-\u02AF\r\n]+$/i, //Using http://jrgraphix.net/research/unicode_blocks.php Allowed characters from Basic Latin to IPA Extensions
  'showEUCookieDisclaimer':true,
  'enableHotDeals':true,
  'infiniti': {
    'enable': false,
    'development': 'http://integration-sandman.infiniti.io/track/content/infiniti.js',
    'integration': 'http://integration-sandman.infiniti.io/track/content/infiniti.js',
    'staging': 'http://staging-infiniti-sandman.mobiusbookingengine.com/track/content/infiniti.js',
    'uat': '/infiniti/track/content/infiniti.js',
    'live': '//infiniti.sandmanhotels.com/track/content/infiniti.js'
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
    'id': '',
    'bridge': '',
    'script': {
      'development': '',
      'integration': '',
      'staging': '',
      'uat':'',
      'live': ''
    }
  },
  'infinitiEcommerceTracking': {
    'enable': false,
    'infinitiId': '',
    'endpoint': {
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
    'development': {
      'enable':false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.31/infiniti-track2.min.js',
      'id':'excelsior-development',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'integration': {
      'enable':false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.31/infiniti-track2.min.js',
      'id':'excelsior-integration',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'staging': {
      'enable':false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.31/infiniti-track2.min.js',
      'id':'excelsior-staging',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'uat': {
      'enable': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.31/infiniti-track2.min.js',
      'id':'excelsior-staging',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'live': {
      'enable': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.31/infiniti-track2.min.js',
      'id':'excelsior-live',
      'username': 'sandman',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    }
  },
  'derbysoftTracking' : {
    'enable': false,
    'accountCode':'2p'
  },
  'googleAnalytics': {
    'enable': false,
    'id': ''
  },
  'googleTagManager': {
    'enable': true,
    'trackUserId': true,
    'id': 'GTM-T6VB8R8'
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
    'chainCode': 'EXC',
    'trackUsage': true,
    'languageInPath': true,
    'baseURL': {
      'development': '//integration-www-excelsior.mobiusbookingengine.com/api/4.0/',
      'integration': '//integration-www-excelsior.mobiusbookingengine.com/api/4.0/',
      'staging': '//integration-www-excelsior.mobiusbookingengine.com/api/4.0/',
      'uat': '/api/4.0/',
      'live': 'https://excelsior.mobiusbookingengine.com/api/4.0/'
    },
    'mobiusTracking': {
      'development': {
        'id': 'excelsior-development',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'integration': {
        'id': 'excelsior-integration',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'staging': {
        'id': 'excelsior-staging',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'uat': {
        'id': 'excelsior-uat',
        'search': {
          'enable': false
        },
        'purchase': {
          'enable': false
        },
        'url':'https://xjm5u7ejh8.execute-api.us-west-1.amazonaws.com/dev/event/create'
      },
      'live': {
        'id': 'excelsior-live',
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
      'enable': true,
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
      },
      'polls': {
        'index': 'contents/polls/:pollId',
        'all': 'contents/polls',
        'answer': 'contents/polls/:pollId'
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
      'Mobius-tenantId': '6',
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
    'partials': {
      'menu': 'layouts/lbe/menu.html',
      'header': 'layouts/lbe/header.html',
      'footer': 'layouts/lbe/footer.html'
    },
    'currencyList': {
      'showFlags': true
    },
    'contactList': {
      'tel3': '1-212-685-1100 EXT 1308'
    },
    'recommendation': {
      'avatarUrl': '/static/images/lbe/avatar@3x.png',
      'text': '“20% off and a room upgrade, what more could I ask for!”',
      'name': 'Laura Sandoval',
      'city': 'New York'
    },
    'recommendationCarousel': [
      {
        'avatarUrl': '/static/images/lbe/testimonial-profile-3_preview.png',
        'text': '“Best Value Upper West Side and Super Location”',
        'name': 'William B',
        'namePrefix': "W",
        'city': 'Manhattan Beach, California'
      },
      {
        'avatarUrl': '/static/images/lbe/testimonial-profile-1_preview.png',
        'text': '“A beautiful hotel in the heart of the Upper West Side”',
        'name': 'Sue M',
        'namePrefix': "S",
        'city': 'St. Catharines, Canada'
      },
      {
        'avatarUrl': '/static/images/lbe/testimonial-profile-2_preview.png',
        'text': '“Wonderful and the value cannot be beat!”',
        'name': 'Molly Y',
        'namePrefix': 'M',
        'city': 'Raleigh, North Carolina'
      }
    ],
    'recommendationCarouselInterval': 10000, // 0 disable carousel auto rotation
    'homePage': {
      'showOffer': true
    },
    'hotelIntro': {
      'title': 'What to expect when you visit',
      'highlight': 'Committed to the idea that a life well-traveled is defined by a personal connection to the people, culture and lifestyles of the places we visit, the Excelsior Hotel offers discerning guests an authentic, residence-style experience in the heart of New York City’s Upper West Side.',
      'description': 'To complement our fashionable surroundings, we’ve designed a delightfully affordable pied-a-terre distinguished by relaxed yet sophisticated ambiance and unpretentious style. The Excelsior is located within a beautifully restored landmark building, infusing classic design and architecture with contemporary comfort. In addition to swanky, Art Deco-inspired rooms, the hotel features a fitness center, Boardroom and Calle Ocho restaurant, which brings guests and neighborhood residents together for signature Latin fare and a locally famous weekend brunch complete with unlimited complimentary sangria.'
    },
    'datepicker': {
      'showToday': false,
      'dateFormat': 'DD. MMM YYYY'
    },
    'questionnaire': {},
    'bookingBar': {
      'maxAdults': 8,
      'maxChildren': 8,
      'dateFormat': 'dd MM yy',
      'defaultSize': 'large',
      'useTommorowDefault': true
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
    'tagline': {
      'showLogo': true
    },
    'highlight': {
      'imageUrl': '/static/images/sun.png'
    },
    'previousSearches': {
      'enable':true,
      'searchDataCookieName':'MobiusPreviousSearchData',
      'searchDataCookieExpiry':259200, //180 days
      'searchDisplayCookieName':'MobiusPreviousSearchDisplay',
      'searchInSessionCookieName':'MobiusSearchInSession',
      'maxSearches':3
    },
    'funnelRetention':{
      'enable':false,
      'cookieName': 'MobiusFunnelRetention',
      'inactivityPeriod':30000, //The time limit that when reached denotes that a session is inactive (Milliseconds)
      'inactivityPeriodInterval':1000, //The interval at which inactivity checks are made (Milliseconds)
      'displayExitModal':false
    },
    'chains': ['EXC'],
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'generics': {
      'singleProperty': true,
      'defaultPropertyCode': 'EXC',
      'facebookAppId': '',
      'disableMainHeaderStyle': true,
      'applyChainClassToBody': true,
      'orderPropertiesByChain': true,
      'longDateFormat': 'Do MMM YYYY',
      'dontRedirectSinglePropertyHome': true,
      'header': {
        'logoLink': 'https://gooole.com',
        'logoText': 'Excelsior Hotels',
        'telephone': '+49 211 54259 0',
        'loginAsLink': true,
        'hideMobileHeader': true,
        'mainMenuAsOverlay': true
      }
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
      'slideWidth': 1440,
      'slideHeight': 490
    },
    'userMessages': {
      'image': {
        'display': false,
        'url': ''
      }
    },
    // Menu settings - showing/hidding menu items
    'menu': {
      'showHotels': false,
      'hotelMenuContent': {
        'service': 'locationService',
        'method': 'getRegions',
        'detailState': 'regions',
        'listState': 'regions',
        'paramName': 'regionSlug'
      },
      'showRegionsMegaMenu': true,
      'showHotDeals': true,
      'showMeetingsBanquets': true,
      'showOffers': true,
      'showAbout': true,
      'showNews': false,
      'showContact': false,
      'offerlimitedToChainWide': true,
      'offersKeepProperty': false,
      'offerSpecificToSelectedProperty': false,
      'maxOffersCount': 4,
      'maxAboutCount': 5,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': true,
      'standalone': true,
      'externalRegionLinks':[
        {
          'title': 'United Kingdom',
          'url': 'http://www.sandmansignature.co.uk/'
        }
      ]
    },
    // Social links
    'displaySocialLinks': true,
    'socialLinks': [
      {'network': 'blog', 'link': ''},
      {'network': 'facebook', 'link': 'https://www.facebook.com/excelsiornyc'},
      {'network': 'twitter', 'link': 'https://twitter.com/excelsiornyc'},
      {'network': 'instagram', 'link': ''},
      {'network': 'google', 'link': ''}
    ],
    'socialLinksNew': {
      'facebook': 'https://www.facebook.com/excelsiornyc',
      'twitter': 'https://twitter.com/excelsiornyc',
      'instagram': '',
      'linkedIn': '',
      'youtube': ''
    },
    'shareLinks': {
      'facebook': true,
      'twitter': true,
      'googleplus': false,
      'mail': true,
      'twitterUsername': 'stgileshotels'
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
      'chainPrefix': 'Sandman Hotels',
      'breadcrumbs': {
        'hotels': false,
        'location': true
      },
      'scrollToRates': 360,
      //List of rooms and their products
      'defaultNumberOfRooms': 5,
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
        'desktopDisplayRatesOnLoad': true,
        'mobileHideRates': false,
        'displayAmenities': true,
        'displayRoomDetails': true,
        'displayRoomSubtitle': true,
        'hideShowInfoIcon': true,
        'displayEarnedPointsBelowDescription': true,
        'roomDetailThumbnailSize':{
          'width': 150,
          'height': 150
        },
        'includeSlider': true,
        'sliderHasThumbnails': true,
        'includeTripAdvisorPreloader': false,
        'roomsAsLinks': false,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Select', //This config value doesn't appear to be used anywhere, but will retain for now anyway.
          'ratesPerRoomOnDesktop': 3,
          'ratesPerRoomOnMobile': 3,
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
          'display': true
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
      'showLocalInfo': false,
      'removeScrollToRoomsOnFinish': true,
      'displayAmenitiesInHotelInfo': true,
      'findOutMoreLinksBottomMobile':false, //Positions the find out more section to the bottom of the page on mobile
      'headerPartial':{
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'partials':{
        'hotelDescription': false,
        'hotelBookingBar': true,
        'hotelHeader': false,
        'hotelDatesSelected': false,
        'hotelServices': false,
        'hotelInfo': true,
        'hotelRooms': false,
        'hotelRoomsCompare': true,
        'hotelOffers': true,
        'hotelLocation': true,
        'hotelReadMoreMobile': false
      },
      'bookingStatistics':{
        'display': false,
        'displayDelay':5000,
        'displayTime':2000000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
      },
      'restrictAmenities':true, //Only display amenities that's name begins with asterix
      'hideViewMoreImagesMobile': false, //Hide the view more images on mobile
      'shortenDescriptionMobile':true //Shorten the description with read more on mobile
    },
    //rate lookup teasers
    'showHotelDetailsTestimonials': true,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonialsCarousel': true,
    'hotelDetailsTestimonialsCarouselDelay': 4000,
    'hotelDetailsTestimonials': [{
      'property': 'CCC',
      'review': 'This hotel was in a great location and had amazing views of the city. Customer service was also very helpful. This hotel had everything we needed for a great stay in New York City',
      'reviewer': {
        'name': 'Brenda M.',
        'avatar': '//res.cloudinary.com/dmh2cjswj/image/upload/q_auto,f_auto/v1450183019/SAN/rateLoading/denisek.jpg',
        'location': 'Toronto, Canada'
      },
      'stars': 5
    }],
    'roomDetails': {
      'displayRoomSubtitle': true,
      'hasBreadcrumbsSecondaryNav': false,
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': false,
      'showDescriptionBottom': false,
      'displayBookingBar': true,
      //show room highlight before description
      'showRoomHighlight': true,
      'includeTripAdvisorPreloader': false,
      'rateInfoIsTabbed': true,
      'showLocalInfo': false,
      'headerPartial':{
        'display': true,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'useThumbnails': true,
        'hide': false,
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
        'display': true
      },
      'displayAltProduct':true,
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
      'displayPropertyNameInDetails':true,
      'displayNewsletterCtaOnReservationDetail': false,
      'displayConfirmationNumberInDetails':true,
      'displayBookingDateInDetails': true,
      'displayActionsInDetails':true,
      'displayPoliciesInDetails':true,
      'displayVideo': true,
      'hideHeader':true,
      'videoUrl': 'https://www.youtube.com/embed/xKRmh7AmOfI?rel=0',
      'useBackground': true,
      'useSingleRowData': true,
      'useSidetable': false,
      'displayInstagramFeed': false,
      'modifyButtonsAfterDetails':false,
      'reservationDetailPriceBreakdownExtended': true,
      'displayAddonVoucherEntry': false,
      'displayAddonComments': false,
      'hideBreadcrumbs': true,
      'hideHeroSliderOnReservations': true,
      'largeRoomImage': true
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
      'default': 'USD',

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
    'offersWidget': {
      'numOffers': 6
    },
    'offers':{
      'discountCodeCookieExpiryDays': 5,
      'displayPageHeading': true,
      'includeOfferAvailabilityPropertyDropdown': true,
      'displayOfferImageInHeroSlider': true,
      'height': 200,
      'width': 307,
      'scrollToBreadcrumbs': false,
      'noScrollToOfferDetail': true,
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
      },
      'defaultOptInNewsletter': true
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
      'defaultRegion':'BC',
      'checkAvailabilityOnChange': false,
      'checkOfferAvailabilityOnChange': false,
      'displayPropertiesMegamenu': true,
      'displaySelectAllHotelsAction':false,
      'hasMultiroomTab': false,
      'hasRatesSelection': false,
      'timezone':'America/Vancouver',
      //searchOffset stops user from searching availability past a certain date (today + searchOffset.days)
      'searchOffset' :{
        'enable': true,
        'days': 730
      },
      // Suggest MRB when number of adults is higher
      // than this value and server returns no products
      'maxAdultsForSingleRoomBooking': 3,
      'includeAllPropertyOption': true,
      'includeRegions': false,
      'includeLocations': true,
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
        'display': true
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
      'detailsBeforeForm': true,
      //Is billing state a required field?
      'billingStateRequired': true,
      //price breakdown
      'priceBreakdownExtended': true,
      //display hero slider on booking page
      'displayHeroSlider': false,
      'policiesLinkBottom': true,
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
        'showInReservationWidget': false
      },
      //Default value for newsletter opt-in checkbox
      'newsLetterOptedIn': true,
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
        'enable':false
      },
      'reservationAssurance': {
        display: false,
        payment: false,
        price: false,
        security: false
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
        'about',
        'questionnaire',
        'testimonial',
        'offers',
        'instagram-feed',
        'hotel-info'
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
      'about': '<tagline ng-if="auth.isLoggedIn()" showLogo="true" text="Become a Excelsior Insider - Sign Up now and benefit immediately… It’s that simple."></tagline>',
      'questionnaire': '<questionnaire ng-if="auth.isLoggedIn()"></questionnaire>',
      'testimonial': '<recommendation></recommendation>',
      'offers': '<offers></offers>',
      'instagram-feed': '<instagram-feed></instagram-feed>',
      'hotel-info': '<hotel-intro></hotel-intro>',
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
      'prestige': {
        'hideHero': true,
        'hideBreadCrumbs': true,
        'useBackground': true
      },
      'rewards': {
        'hideHero': true,
        'hideBreadCrumbs': true,
        'useBackground': true,
        'showPointsInBanner': true
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
        'hideBreadcrumbs': true,
        'scrollToOffsetDesktop': 200,
        'hasViewMore': true,
        'hasTitle': false,
        'showSubNav': false,
        'showIncentiveNotifications': true,
        'incentiveNotifications': [
          {
            'svg': '<svg xmlns="http://www.w3.org/2000/svg" width="81" height="109" viewBox="0 0 81 109">\n' +
            '  <g fill="#FFF" fill-opacity=".8" transform="translate(.26 .893)">\n' +
            '    <path d="M79.3989105 47.4641206L74.1587749 40.4351908C73.8298961 39.9837917 73.8079709 39.3604309 74.1368497 38.9090318L79.267359 31.8156165C79.7277893 31.1707605 79.5085368 30.2679622 78.8069287 29.9025439L70.9796132 25.7969611C70.4753324 25.5390187 70.1903041 24.9801435 70.2999303 24.4212684L71.7689223 15.8446844C71.9004738 15.0708573 71.308492 14.3400206 70.4972576 14.3185254L61.6394552 13.953107C61.0693987 13.9316118 60.5651178 13.5446982 60.4116411 13.0073183L57.9560127 4.6241911C57.7367601 3.87185917 56.8816753 3.46345041 56.1362166 3.78587838L47.9800224 7.22511005C47.4538163 7.44006202 46.8399092 7.31109084 46.4452546 6.90268208L40.5254362.4326275C39.9773049-.147742844 39.0564442-.147742844 38.5083129.454122698L32.6761955 7.01015807C32.3034662 7.44006202 31.6895591 7.56903321 31.163353 7.35408123L22.9633082 4.04382075C22.2178496 3.74288798 21.38469 4.15129674 21.1654375 4.90362867L18.8194353 13.2867559C18.6659586 13.8241358 18.183603 14.2110494 17.6135464 14.2540398L8.75574402 14.7484293C7.94450965 14.7914197 7.37445306 15.5222564 7.50600458 16.2960836L9.10654808 24.8511723C9.21617435 25.4100475 8.93114605 25.9689226 8.44879048 26.226865L.687250771 30.4399238C-.0143573384 30.8268374-.211684619 31.7296357.248745703 32.3529964L5.48888127 39.3819261C5.81776007 39.8333253 5.83968532 40.456686 5.51080652 40.9080852L.380297223 48.0015005C-.0801330986 48.6463565.139119435 49.5491548.840727544 49.9145731L8.66804301 54.0201559C9.17232384 54.2780983 9.45735213 54.8369735 9.34772587 55.3958486L7.87873389 63.9724326C7.74718237 64.7462597 8.33916421 65.4770964 9.15039859 65.4985916L18.008201 65.86401C18.5782576 65.8855052 19.0825384 66.2724188 19.2360152 66.8097987L21.7135688 75.1714307C21.9328213 75.9237626 22.7879062 76.3321714 23.5333648 76.0097434L31.6895591 72.5705117C32.2157652 72.3555598 32.8296723 72.484531 33.2243268 72.8929397L39.1441452 79.3629943C39.6922766 79.9433646 40.6131372 79.9433646 41.1612686 79.3414991L46.993386 72.7854637C47.3661153 72.3555598 47.9800224 72.2265886 48.5062285 72.4415406L56.7062732 75.751801C57.4517318 76.0527338 58.2848915 75.6443251 58.504144 74.8919931L60.8501461 66.5088659C61.0036229 65.971486 61.4859785 65.5845724 62.0560351 65.541582L70.9138374 65.0471925C71.7250718 65.0042021 72.2951284 64.2733653 72.1635769 63.4995382L70.5630334 54.9444494C70.4534071 54.3855743 70.7384354 53.8266992 71.220791 53.5687568L78.9823307 49.355698C79.6839388 49.0117748 79.8812661 48.1089765 79.3989105 47.4641206zM39.8457534 63.5210334C26.580975 63.5210334 15.7718251 52.9239008 15.7718251 39.9193061 15.7718251 26.9147113 26.580975 16.3175788 39.8457534 16.3175788 53.1105317 16.3175788 63.9196816 26.9147113 63.9196816 39.9193061 63.9196816 52.945396 53.1105317 63.5210334 39.8457534 63.5210334zM60.9302099 79.7956218C59.6635285 81.1001172 57.8945425 81.8739704 55.9945204 81.8739704 55.317501 81.8739704 54.6404817 81.7634199 54.007141 81.5865392L48.3725928 79.8619521 44.0265653 83.8859887C43.87369 84.0186492 43.742654 84.1513098 43.5897786 84.2618602L50.5783655 106.195071C50.8185982 106.968924 51.8013683 107.145805 52.3036729 106.504612L57.3922378 99.8936947C57.6324704 99.5620433 58.0692571 99.4293828 58.4405258 99.5399332L66.3682041 101.883603C67.1325808 102.104704 67.8314395 101.375071 67.5912068 100.623328L60.9302099 79.7956218zM29.7883896 79.861898L24.1538414 81.5850792C23.4986614 81.7839078 22.8434814 81.8722761 22.166462 81.8722761 20.2664399 81.8722761 18.5192932 81.0990538 17.2307725 79.7956218L10.5697756 100.628441C10.3295429 101.401664 11.0284016 102.10861 11.7927783 101.887689L19.7204566 99.5459299C20.1135646 99.4354695 20.5285119 99.5680219 20.7687446 99.8994029L25.8573095 106.504931C26.3377748 107.145601 27.3423842 106.968864 27.5826168 106.195642L34.5712038 84.2803114C34.4183284 84.1698511 34.2654531 84.0372987 34.1344171 83.9047463L29.7883896 79.861898z"/>\n' +
            '    <path d="M52.4569953,33.6497378 L43.9454561,33.0368857 L40.7382094,25.1923782 C40.1419905,23.721533 38.0243853,23.721533 37.4281663,25.1923782 L34.2209197,33.0368857 L25.7093804,33.6497378 C24.1057571,33.7723082 23.4684196,35.7538635 24.6814167,36.7752838 L31.1987064,42.2500963 L29.1633384,50.4827434 C28.7727122,52.0353022 30.4791319,53.2610065 31.8360439,52.4234419 L39.0729082,47.9496212 L46.3097725,52.4234419 C47.6666846,53.2610065 49.3731043,52.0353022 48.9824781,50.4827434 L46.94711,42.2500963 L53.4643997,36.7752838 C54.6979562,35.7538635 54.0606187,33.7723082 52.4569953,33.6497378 Z"/>\n' +
            '  </g>\n' +
            '</svg>\n',
            'title': 'Get Rewarded',
            'message': 'Members Get Early Check In & Late Checkout Guaranteed!'
          },
          {
            'svg': '<svg xmlns="http://www.w3.org/2000/svg" width="77" height="105" viewBox="0 0 77 105">\n' +
            '  <g fill="#FFF" fill-opacity=".8" transform="translate(.414 .217)">\n' +
            '    <path d="M39.6731448 69.91123C38.2121456 71.3720267 38.2121456 73.7736756 39.6731448 75.2344724 41.134144 76.6952691 43.5361258 76.6952691 44.997125 75.2344724 46.4581243 73.7736756 46.4581243 71.3720267 44.997125 69.91123 43.5361258 68.4256739 41.134144 68.4256739 39.6731448 69.91123zM23.9537836 59.3491581C22.4927844 57.8847515 20.0908026 57.8847515 18.6298034 59.3491581 17.1688042 60.8135648 17.1688042 63.2211485 18.6298034 64.6855552 20.0908026 66.1499618 22.4927844 66.1499618 23.9537836 64.6855552 25.4147829 63.2211485 25.4147829 60.8383852 23.9537836 59.3491581z"/>\n' +
            '    <path d="M74.0121562,7.49471523 C73.0116981,5.10633608 69.9464647,1.08380278 60.6230465,1 C60.5166148,1 60.4314694,1 60.3250377,1 C54.5990115,1 47.7873817,2.4874993 41.0821837,5.21108955 C39.8475758,5.71390622 38.6555406,6.23767357 37.5060781,6.80334232 L37.4422191,6.74049024 C33.6106774,3.07411874 27.5014969,3.07411874 23.6699552,6.74049024 L4.89540076,24.6952353 C2.40489863,27.0626637 1,30.330972 1,33.7459352 L1,94.5658007 C1,99.4682632 5.04440516,103.448895 10.0254094,103.448895 L51.1080512,103.448895 C56.0890555,103.448895 60.1334606,99.4682632 60.1334606,94.5658007 L60.1334606,33.7459352 C60.1334606,32.0070276 59.7715928,30.2890706 59.0691435,28.7387193 C63.0496896,26.5388963 66.5193635,24.024813 69.1801564,21.3850256 C75.6937773,14.8693596 75.0126144,9.88309438 74.0121562,7.49471523 Z M12.2817618,60.8561336 C12.2817618,56.6240934 15.7940083,53.1672288 20.0938496,53.1672288 C24.3936909,53.1672288 27.9059375,56.6240934 27.9059375,60.8561336 C27.9059375,65.0881739 24.3936909,68.5450384 20.0938496,68.5450384 C15.7940083,68.5450384 12.3030481,65.1091246 12.2817618,60.8561336 Z M18.9231007,80.9688001 C18.1142197,80.2983779 18.007788,79.125139 18.6676646,78.3290127 L39.1876992,54.0052566 C39.8688622,53.2091302 41.0608974,53.1043767 41.8697784,53.7538482 C42.6786594,54.4242705 42.7850912,55.5975093 42.1252145,56.3936357 L21.60518,80.7173918 C20.924017,81.5135182 19.7319818,81.6182717 18.9231007,80.9688001 Z M40.7203159,81.5135182 C36.4204746,81.5135182 32.908228,78.0566536 32.908228,73.8246134 C32.908228,69.5925731 36.4204746,66.1357086 40.7203159,66.1357086 C45.0201572,66.1357086 48.5324038,69.5925731 48.5324038,73.8246134 C48.5324038,78.0566536 45.0201572,81.5135182 40.7203159,81.5135182 Z M49.3838575,25.0304464 C45.4671704,26.6226991 41.4440516,27.7540366 37.7828006,28.2987547 C37.7828006,28.4663602 37.8040869,28.6130151 37.8040869,28.7806206 C37.8040869,32.8450553 34.4621311,36.1343143 30.3325806,36.1343143 C26.20303,36.1343143 22.8610742,32.8450553 22.8610742,28.7806206 C22.8610742,24.7161859 26.20303,21.4269269 30.3325806,21.4269269 C32.8017963,21.4269269 34.9730033,22.6001658 36.3353293,24.4019255 C39.8050032,23.8153061 43.5513995,22.7468207 47.2339368,21.2593214 C48.5324038,20.735554 49.7457253,20.190836 50.8951878,19.6251672 L43.3598224,12.3971777 C43.5726859,12.3133749 43.7855493,12.2295721 43.9984127,12.1248187 C49.724439,9.79929161 55.6633286,8.47939786 60.3463241,8.47939786 C60.4101831,8.47939786 60.4953285,8.47939786 60.5591875,8.47939786 C65.0506059,8.52129925 66.732227,9.71548883 66.9876631,10.3440097 C67.7752578,12.2714735 62.7729672,19.6042165 49.3838575,25.0304464 Z"/>\n' +
            '  </g>\n' +
            '</svg>',
            'title': 'Lowest Rates',
            'message': 'Excelsior Members Receive a 10% Discount.'
          },
          {
            'svg': '<svg xmlns="http://www.w3.org/2000/svg" width="91" height="68" viewBox="0 0 91 68">\n' +
            '  <g fill="#FFF" fill-opacity=".7" transform="translate(.163 .676)">\n' +
            '    <path d="M69.2233215 27.0952413C68.4377942 27.0952413 67.7366321 27.414306 67.2008145 27.9080732 66.9148475 28.1699856 66.7012541 28.4800189 66.5356275 28.8082562 66.5175694 28.844382 66.4875196 28.8683719 66.4724241 28.9046389 66.3038349 29.2778924 66.2135444 29.6843083 66.2135444 30.1058237 66.2135444 30.5273391 66.3038349 30.933755 66.4724241 31.3070085 66.4875196 31.3431344 66.520532 31.3671242 66.5356275 31.4033912 66.6981504 31.7344508 66.9148475 32.0416617 67.2008145 32.3035742 67.736491 32.7973413 68.4407569 33.116406 69.2233215 33.116406 70.8817039 33.116406 72.2329575 31.7646498 72.2329575 30.1059648 72.2329575 28.4472798 70.8817039 27.0952413 69.2233215 27.0952413zM62.4302993 31.8179019C62.382108 31.7154749 62.3197295 31.6189816 62.2814466 31.5165547 62.1084983 31.0644632 61.9884703 30.5973962 61.9884703 30.1121042 61.9884703 29.6268123 62.1037692 29.159604 62.2814466 28.7076538 62.3199547 28.6052268 62.3823332 28.5087336 62.4302993 28.4063066 62.6079767 28.0355916 62.8338454 27.6829602 63.1124094 27.3454457 63.1509174 27.3002365 63.1651046 27.2489524 63.2038378 27.2037433 62.809975 27.1314086 62.4014746 27.0952413 61.9884703 27.0952413 59.3413248 27.0952413 57.1844247 28.4485489 57.1844247 30.1091374 57.1844247 32.0289721 60.2783535 33.5149403 63.2038378 33.0206065 63.1653298 32.9753973 63.1511426 32.9241132 63.1124094 32.8789041 62.8291164 32.5413895 62.6032477 32.18565 62.4302993 31.8179019z"/>\n' +
            '    <path d="M80.1928941,0 L23.6419823,0 C18.0758261,0 13.5436795,4.41722439 13.5436795,9.84223883 L13.5436795,24.0978266 C14.18177,23.8891084 14.8565933,23.75919 15.5634158,23.75919 C18.2051483,23.75919 20.5157175,25.3261457 21.3113425,27.6606163 L23.9691693,35.4320967 L31.7207381,35.4320967 C34.0311179,35.4320967 36.1720346,36.7430911 37.1780212,38.7745419 C38.1838184,40.8216788 37.8929855,43.2705662 36.4551044,45.0264941 L31.4018822,51.1799003 L80.1928941,51.1799003 C85.7590503,51.1799003 90.2911969,46.7626759 90.2911969,41.3376614 L90.2911969,9.84223883 C90.2911969,4.41722439 85.7590503,0 80.1928941,0 Z M64.0353825,11.8107604 L68.0746658,11.8107604 C69.1895254,11.8107604 70.0944021,12.692692 70.0944021,13.779282 C70.0944021,14.8658719 69.1895254,15.7478036 68.0746658,15.7478036 L64.0353825,15.7478036 C62.920523,15.7478036 62.0156463,14.8658719 62.0156463,13.779282 C62.0156463,12.692692 62.920523,11.8107604 64.0353825,11.8107604 Z M39.7993045,11.8107604 L43.8385877,11.8107604 C44.9534473,11.8107604 45.858324,12.692692 45.858324,13.779282 C45.858324,14.8658719 44.9534473,15.7478036 43.8385877,15.7478036 L39.7993045,15.7478036 C38.6844449,15.7478036 37.7795682,14.8658719 37.7795682,13.779282 C37.7795682,12.692692 38.6844449,11.8107604 39.7993045,11.8107604 Z M25.6617185,13.779282 C25.6617185,12.692692 26.5665952,11.8107604 27.6814548,11.8107604 L31.7207381,11.8107604 C32.8355976,11.8107604 33.7404743,12.692692 33.7404743,13.779282 C33.7404743,14.8658719 32.8355976,15.7478036 31.7207381,15.7478036 L27.6814548,15.7478036 C26.5664059,15.747619 25.6617185,14.8658719 25.6617185,13.779282 Z M47.8780603,39.3691398 L43.8387771,39.3691398 C42.7239175,39.3691398 41.8190408,38.4872082 41.8190408,37.4006183 C41.8190408,36.3140283 42.7239175,35.4320967 43.8387771,35.4320967 L47.8780603,35.4320967 C48.9929199,35.4320967 49.8977966,36.3140283 49.8977966,37.4006183 C49.8977966,38.4872082 48.9929199,39.3691398 47.8780603,39.3691398 Z M47.8780603,27.5583794 L31.7207381,27.5583794 C30.6058785,27.5583794 29.7010018,26.6764478 29.7010018,25.5898579 C29.7010018,24.5032679 30.6058785,23.6213363 31.7207381,23.6213363 L47.8780603,23.6213363 C48.9929199,23.6213363 49.8977966,24.5032679 49.8977966,25.5898579 C49.8977966,26.6764478 48.9929199,27.5583794 47.8780603,27.5583794 Z M49.8977966,13.779282 C49.8977966,12.692692 50.8026733,11.8107604 51.9175329,11.8107604 L55.9568161,11.8107604 C57.0716757,11.8107604 57.9765524,12.692692 57.9765524,13.779282 C57.9765524,14.8658719 57.0716757,15.7478036 55.9568161,15.7478036 L51.9175329,15.7478036 C50.8024839,15.747619 49.8977966,14.8658719 49.8977966,13.779282 Z M70.0944021,39.3691398 C68.6201669,39.3691398 67.2506391,38.9518878 66.0590951,38.2784899 C64.8311969,38.9793848 63.4455749,39.3691398 62.0156463,39.3691398 C57.5601841,39.3691398 53.9368905,35.8377225 53.9368905,31.4952381 C53.9368905,27.1527536 57.5601841,23.6213363 62.0156463,23.6213363 C63.4455749,23.6213363 64.8310075,24.0110914 66.0590951,24.7119862 C67.2508285,24.0387728 68.6199775,23.6213363 70.0944021,23.6213363 C74.5498642,23.6213363 78.1731578,27.1527536 78.1731578,31.4952381 C78.1731578,35.8377225 74.5498642,39.3691398 70.0944021,39.3691398 Z"/>\n' +
            '    <path d="M34.4220828,39.8531338 C34.09906,39.1696786 33.4261559,38.7375478 32.6878181,38.7375478 L22.5356731,38.7375478 L19.1286118,28.2971798 C18.6056826,26.6945951 16.0022126,26.6945951 15.4830688,28.2971798 L12.0760075,38.7375478 L1.92386256,38.7375478 C1.18552474,38.7375478 0.512620675,39.1694944 0.189597879,39.8490832 C-0.129639492,40.5325384 -0.0411326884,41.3376973 0.420328447,41.9268828 L7.49222035,50.9532055 L3.91986223,63.7267482 C3.69670251,64.5201234 3.98529598,65.3685505 4.63512699,65.8557333 C5.28892369,66.334999 6.16569985,66.3546999 6.83481849,65.9028682 L17.3060206,58.773723 L27.777403,65.9028682 C28.1004257,66.1228922 28.4695947,66.2328121 28.842549,66.2328121 C29.2425421,66.2328121 29.6385694,66.1070578 29.9770945,65.8557333 C30.6269255,65.3687347 30.9153387,64.5203075 30.6923592,63.7267482 L27.1200011,50.9532055 L34.1917127,41.9307493 C34.6528134,41.3417479 34.7411399,40.536589 34.4220828,39.8531338 Z"/>\n' +
            '  </g>\n' +
            '</svg>\n',
            'title': 'Free Beverages',
            'message': 'Members receive free complimentary refreshments.'
          }
        ],
        // @todo make this multi lingual
        'subNavLinks': [
          {
            'name': 'Points of interest',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel1a'
          },
          {
            'name': 'Meetings & events',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel5a'
          },
          {
            'name': 'Facilities',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel4a'
          },
          {
            'name': 'Rooms',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel2a'
          },
          {
            'name': 'Dining',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel3a'
          },
          {
            'name': 'FAQS',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court/faq'
          },
          {
            'name': 'Info',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court/faq'
          },
          {
            'name': 'Contact',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel6a'
          }
        ],
        'hotelInfo': {
          'descriptionGrid': 6,
          'sidebarGrid': 6,
          'images': {
            'width': '600',
            'height': '350'
          }
        }
      },
      'reservationDetails': {
        'useAltAddons': true
      },
      'roomDetails':{
        'hasViewMore': true,
        'hideBreadcrumbs': false,
        'showInclusions': false,
        'showTagline': false,
        'showSubNav': true,
        // @todo make this multi lingual
        'subNavLinks': [
          {
            'name': 'Points of interest',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel1a'
          },
          {
            'name': 'Meetings & events',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel5a'
          },
          {
            'name': 'Facilities',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel4a'
          },
          {
            'name': 'Rooms',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel2a'
          },
          {
            'name': 'Dining',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel3a'
          },
          {
            'name': 'FAQS',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court/faq'
          },
          {
            'name': 'Info',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court/faq'
          },
          {
            'name': 'Contact',
            'link': 'http://www.stgiles.com/hotels/united-states/new-york-city/the-court#panel6a'
          }
        ],
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
        'displayPropertyTitle': false,
        'displayStaticContent': false,
        'propertyHotDealsShowTitle': true
      },
      'locationMap':{
        'displayMainTitle': false,
        'displayGoogleMapsLink': true,
        'displayIcons': false,
        'displayContactInfo': false,
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
    'defaultCountryCode': 'us',
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
