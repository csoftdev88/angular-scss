'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 9,
  'authType': 'mobius',
  'loyaltyProgramEnabled': false,
  'newUrlStructure': false,
  'inputValidationPattern':/^[\u0020-\u02AF\r\n]+$/i, //Using http://jrgraphix.net/research/unicode_blocks.php Allowed characters from Basic Latin to IPA Extensions
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
    'id': '',
    'bridge': '',
    'script': {
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
      'enableDuplication': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.2/infiniti-track2.min.js',
      'id':'meandall-development',
      'username': 'meandall',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'integration': {
      'enable':false,
      'enableDuplication': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.2/infiniti-track2.min.js',
      'id':'meandall-integration',
      'username': 'meandall',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'staging': {
      'enable':false,
      'enableDuplication': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.2/infiniti-track2.min.js',
      'id':'meandall-staging',
      'username': 'meandall',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk',
      'segmentWriteId': 'ufGF40hZthWnYEeH6q09RzrKiusmuWQe',
      'singlePageApp': true
    },
    'uat': {
      'enable':false,
      'enableDuplication': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.2/infiniti-track2.min.js',
      'id':'meandall-staging',
      'username': 'meandall',
      'password': 'nzLbJUo0h9Gg96NeNcT4Fu2+DyEgX7wk'
    },
    'live': {
      'enable':false,
      'enableDuplication': false,
      'endpoint':'https://xozl9li01g.execute-api.us-east-1.amazonaws.com/latest/ecommerce',
      'scriptUrl':'//apeiron.infiniti.io/apeiron/1.0.2/infiniti-track2.min.js',
      'id':'meandall-live',
      'username': 'meandall',
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
    'enable': false,
    'trackUserId': true,
    'id': ''
  },
  'hotjar': {
    'enable': false,
    'id': ''
  },
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,
    'chainCode': 'MEANDALL',
    'trackUsage': true,
    'languageInPath':true, //Temporary fix for cloudflare language caching issues
    'baseURL': {
      'development': '//integration-lindner-node.mobiuswebservices.com/api/4.0/',
      'integration': '//integration-www-meandall.mobiusbookingengine.com/api/4.0/',
      'staging': '//staging-www-meandall.mobiusbookingengine.com/api/4.0/',
      'uat': '//staging-lindner-node.mobiuswebservices.com/api/4.0/',
      'live': '//meandallhotels.com/api/4.0/'
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
      'checkVoucher': 'voucher'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-tenantId': '2',
      'Mobius-chainId': '1000',
      'Mobius-channelId': [{
        'name': 'mobileWeb',
        'channelID': 13,
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
      'expiry': 30,
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
    'previousSearches': {
      'enable':false,
      'searchDataCookieName':'MobiusPreviousSearchData',
      'searchDataCookieExpiry':259200, //180 days
      'searchDisplayCookieName':'MobiusPreviousSearchDisplay',
      'searchInSessionCookieName':'MobiusSearchInSession',
      'maxSearches':3
    },
    'infoBar': {
      'showForSingleBookings': true
    },
    'chains': ['LINDNER', 'MEANDALL'],
    'user': {
      'userPreferencesCookieExpiryDays': 30
    },
    'markdown':{
      'removeLinksWithString': ['Book Your Stay', 'Jetzt Buchen']
    },
    'datepicker': {
      'showToday': true,
      'dateFormat': 'DD. MMM YYYY'
    },
    'buttonSubmit': {
      'floatingBar': true,
      'continueBtn': true,
      'reservationData': true
    },
    'generics': {
      'singleProperty': true,
      'defaultPropertyCode': 'DUSIMM',
      'facebookAppId': '',
      'disableMainHeaderStyle': true,
      'applyChainClassToBody': true,
      'orderPropertiesByChain': true,
      'longDateFormat': 'Do MMM YYYY',
      'header': {
        'logoLink': 'https://meandallhotels.com',
        'logoText': 'me and all hotels',
        'telephone': '+49 211 54259 0',
        'loginAsLink': true,
        'hideMobileHeader': true,
        'mainMenuAsOverlay': true
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
      'showLoginTitle' : false
    },
    'heroSlider': {
      // All timing settings (autoplayDelay, animationDuration)
      // are specified in ms.

      // Use 0 value to disable automatic slide animation
      'autoplayDelay': 5000,
      'animationDuration': 800,
      'preloadImages': true,
      'slideWidth': 1680,
      'slideHeight': 530
    },
    'userMessages': {
      'image': {
        'display': true,
        'url': '/static/images/v4/icon-thumbs-up@2x.png'
      }
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
      'showHotDeals': false,
      'showMeetingsBanquets': false,
      'showOffers': false,
      'showAbout': false,
      'showNews': false,
      'showContact': false,
      'offerlimitedToChainWide': true,
      'offersKeepProperty': true,
      'offerSpecificToSelectedProperty': false,
      'maxOffersCount': 4,
      'maxAboutCount': 5,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false,
      'isLogoutInDropdown': true,
      'standalone': false,
      'externalRegionLinks':[],
      'customLinks': {
        'location':'https://duesseldorf.meandallhotels.com/en/location.html',
        'lounge':'https://duesseldorf.meandallhotels.com/en/lounge.html',
        'rooms':'https://duesseldorf.meandallhotels.com/en/rooms.html',
        'fitness':'https://duesseldorf.meandallhotels.com/en/fitness.html',
        'blog':'https://duesseldorf.meandallhotels.com/en/blog.html',
        'faq':'https://duesseldorf.meandallhotels.com/en/faq.html',
      }
    },
    // Social links
    'displaySocialLinks': true,
    'socialLinks': [
      {'network': 'facebook', 'link': 'https://www.facebook.com/meandallhotels/'},
      {'network': 'twitter', 'link': 'https://twitter.com/meandall_hotels'},
      {'network': 'instagram', 'link': 'https://www.instagram.com/meandallhotels/'},
      {'network': 'linkedin', 'link': 'https://www.linkedin.com/company/me-and-all-hotels-gmbh'},
      {'network': 'xing', 'link': 'https://www.xing.com/companies/meandallhotels'},
      {'network': 'youtube', 'link': 'https://www.youtube.com/channel/UCtXeM_SPaiWcLgJtQriX17A'}
    ],
    'shareLinks': {
      'facebook': true,
      'twitter': true,
      'googleplus': false,
      'mail': true,
      'twitterUsername': 'meandall_hotels'
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
    'lookUp':{
      'hideHeroSlider':true,
      'hideFooter':true,
      'hideFloatingBarOnEntry':true
    },
    'hotelDetails': {
      'chainPrefix': 'meandall Hotels',
      'breadcrumbs': {
        'hotels': false,
        'location': true
      },
      'scrollToRates': 20,
      //List of rooms and their products
      'defaultNumberOfRooms': 2,
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
          'bookNowButtonText': 'Book Now',
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
          'showInclusions': true
        },
        'upsells': {
          'display': true
        },
        'alternativeDisplays': {
          'dates':{
            'enable':false,
            'flexiRange':3, //The +/- range for alt dates. i.e. 3 returns 3 days before and 3 days after (7 in total)
          },
          'properties':{
            'enable':false
          }
        },
        'hideOrderSwitch':true
      },
      'offers': {
        'toState': 'propertyHotDeals'
      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': false,
      'removeScrollToRoomsOnFinish': true,
      'displayAmenitiesInHotelInfo': true,
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
        'hotelRoomsMobile': true,
        'hotelRoomsCompare': true,
        'hotelInfoMobile':true,
        'hotelOffers': false,
        'hotelLocation': false
      },
      'bookingStatistics':{
        'display':false,
        'displayDelay':5000,
        'displayTime':2000000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
      },
      'sectionImages':[
        {
          'desktop':{
            'height':'530px',
            'url':'/static/images/section-images/RS14544_DUSIMM_me_and_all_Fahrrad_012-lpr.jpg',
            'position':'center -200px'
          },
          'mobile':{
            'height':'370px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'335px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_2000,h_2000,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'150px',
            'url':'/static/images/section-images/RS13917_DUSIMM_Lounge_01-lpr.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'210px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'215px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_750,h_215,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          }
        }
      ]
    },
    //rate lookup teasers
    'showHotelDetailsTestimonials': true,
    'hotelDetailsTestimonialsMaxNumStars': 5,
    'hotelDetailsTestimonialsCarousel': true,
    'hotelDetailsTestimonialsCarouselDelay': 4000,
    'hotelDetailsTestimonials':[],
    'roomDetails': {
      'displayRoomSubtitle': true,
      'hasBreadcrumbsSecondaryNav': false,
      'hasReadMore': true,
      'numberOfRatesToShow': 5,
      'showDescription': false,
      'showDescriptionBottom': true,
      'showOtherRoomsTitle': true,
      //show room highlight before description
      'showRoomHighlight': true,
      'includeTripAdvisorPreloader': false,
      'rateInfoIsTabbed': true,
      'showLocalInfo': false,
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'otherRooms':{
        'hide':true,
        'useThumbnails': false,
        'thumbnails':{
          'width': 150,
          'height': 100
        },
        //displayPrice can be button or text
        'displayPrice': 'text'
      },
      'bookingStatistics':{
        'display':false,
        'displayDelay':5000,
        'displayTime':20000, //The length that you wish the alerts to appear for
        'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
      },
      'showSlashThrough': true,
      'upsells': {
        'display': true
      },
      'showProductImage':true,
      'productImages': {
        'height':160,
        'width':185
      },
      'displayAltProduct':false,
      'tileGallery':true,
      'ratesAsLinks':true,
      'sectionImages':[
        {
          'desktop':{
            'height':'1090px',
            'url':'/static/images/section-images/RS10634_me_and_all_duesseldorf_musterzimmer_3-lpr.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'370px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_750,h_740,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'215px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'150px',
            'url':'/static/images/section-images/RS13126_DUSIMM_Zimmer_813_SUPERIOR_13-lpr.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'210px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'215px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_750,h_740,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          }
        }
      ]
    },

    'reservations': {
      // temp hacks for meandall
      'tempHackGuestFormReorder': true,
      'tempHackBillingFormReorder': true,
      'tempHackInfoFormReorder': true,
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
        'socialSharing': false,
        'passbook': true,
        'print': true
      },
      'displayCancelConfirmedModal': true,
      'newCancelFormat': true,
      'cancelImg': '/static/images/v4/icon-thumbs-up@2x_black.png',
      'displayNewsletterCtaOnReservationDetail': false,
      'reservationDetailPriceBreakdownExtended': true,
      'displayAddonVoucherEntry': false,
      'displayAddonComments': false,
      'hideHeroSliderOnReservations':true,
      'hideHeader':true,
      'breakdownLinkAfterTotal':true,
      'displayActionsInDetails':true,
      'displayPoliciesInDetails':true,
      'useSingleRowData': true,
      'displayPropertyNameInDetails':true,
      'displayConfirmationNumberInDetails':true,
      'displayBookingDateInDetails': true,
      'addonNameAsDescriptionTitle':true,
      'modifyButtonsAfterDetails':false,
      'largeRoomImage': true,
      'largePropertyImage': true,
      'descriptionUnderTitle': true,
      'hideFooter':true,
      'sectionImages':[
        {
          'desktop':{
            'height':'955px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_2000,h_2000,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'90px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_750,h_215,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'215px',
            'url':'/static/images/section-images/RS12959_DUSIMM_Zimmer_STANDARD_05-scr.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'90px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'215px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'90px',
            'url':'/static/images/section-images/RS13917_DUSIMM_Lounge_01-lpr.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'215px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'90px',
            'url':'/static/images/section-images/RS12986_DUSIMM_Zimmer_321_SUPERIOR_16-scr.jpg',
            'position':'center center'
          }
        }
      ]
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
      'default': 'EUR',

      'GBP': {
        'code': 'GBP',
        'symbol': '£',
        'format': '{{symbol}} {{amount}}'
      },

      'USD': {
        'code': 'USD',
        'symbol': '$',
        'format': '{{symbol}} {{amount}}'
      },

      'EUR': {
        'code': 'EUR',
        'symbol': '€',
        'format': '{{symbol}} {{amount}}'
      }
    },

    'offers':{
      'discountCodeCookieExpiryDays': 5,
      'displayPageHeading': true,
      'includeOfferAvailabilityPropertyDropdown': true,
      'displayOfferImageInHeroSlider': false,
      'width': 307,
      'height': 200,
      //if number of words greater than [key], wrap the first [value] words in span for styling
      'offersThumbnailsTitlePattern':{
        '0': 1,
        '3': 2
      }
    },
    'regions':{
      'bookingStatistics':{
        'display':false,
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
      'hideHeroSlider': true,
      'hideBreadCrumbs': true
    },
    'profilePage':{
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'formRequirments': {
        'firstname': true,
        'lastname': true,
        'address_one': true,
        'postcode': true,
        'city': true,
        'state': true,
        'country': true,
        'phone': true,
        'contactMethod': false
      },
      'tempMeandallFormHack': true,
      'hideHeroSlider': true,
      'hideBreadCrumbs': true,
      'displaySummary': false,
      'displayMap': false,
      'allowPasswordChange': false
    },

    'languages': {
      'headerAlignment': 'right',
      'dropdown': false,
      'default': 'de',
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
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      'datePickerNumberOfMonths': 2,
      'datePickerHasCounter': true,
      'datePickerHasTitle': false,
      'datePickerCounterIncludeDates': true,
      'datePickerCloseOnDatesSelected': false,
      'checkAvailabilityOnChange': false,
      'checkOfferAvailabilityOnChange': false,
      'displayPropertiesMegamenu': false,
      'hasMultiroomTab': true,
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
      // Display an image for alerts?
      'alertImage': {
        'display': true,
        'url': '/static/images/v4/icon-eclaimation.png'
      },
      // Should we include company name as a field
      'includeCompanyForBilling': true,
      //Is billing state a required field?
      'billingStateRequired': true,
      //price breakdown
      'priceBreakdownExtended': true,
      //display hero slider on booking page
      'displayHeroSlider': false,
      //Display the overview items on single line (adults, children, check-in etc)
      'dataOverviewSingleLine': true,
      //Display policies link at bottom of reservation overview
      'policiesLinkBottom': true,
      //display back button in form
      'backButtonInForm': false,
      'backButtonUnderContinue': true,
      //Display ccv info as a tooltip
      'ccvAsTooltip': true,
      //display advanced header
      'headerPartial':{
        'display': false,
        'logo':{
          'src': '/static/images/hotelHeaderLogo.png',
          'alt': 'Worldhotels deluxe'
        }
      },
      'cancellationMessageImage': {
        'display': true,
        'url': '/static/images/v4/icon-thumbs-up@2x_black.png'
      },
      //Booking steps navigation
      'bookingStepsNav':{
        'display': true,
        'showInReservationWidget': false
      },
      //Display the details section above the form in DOM
      'detailsBeforeForm':true,
      //Default value for newsletter opt-in checkbox
      'newsLetterOptedIn': false,
      //Display the property name after room details in overview panel
      'propertyNameAfterDetails':true,
      //Hide newsletter checkbox if not on first step
      'hideNewsletterCheckboxIfSelected':true,
      //No scrolling on checkout desktop
      'checkoutNoScrollingDesktop':true,
      //Prompt to ask user to login
      'loginCta':{
        'display': false
      },
      'sectionImages':[
        {
          'desktop':{
            'height':'215px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_2000,h_2000,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'370px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'335px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_2000,h_2000,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'150px',
            'url':'/static/images/section-images/RS13917_DUSIMM_Lounge_01-lpr.jpg',
            'position':'center center'
          }
        },
        {
          'desktop':{
            'height':'210px',
            'url':'/static/images/section-images/csm_P1134913_0c41ebe4d0.jpg',
            'position':'center center'
          },
          'mobile':{
            'height':'215px',
            'url':'//res.cloudinary.com/dmh2cjswj/image/upload/w_750,h_215,c_fill/q_auto,f_auto/v1489397415/fan7xlxabwbgvrnftegi.jpg',
            'position':'center center'
          }
        }
      ],
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
      },
      'termsAndConditionsLink':'https://duesseldorf.meandallhotels.com/en/general-terms-and-conditions.html'
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
          'display':false,
          'displayDelay':3000,
          'displayTime':10000, //The length that you wish the alerts to appear for
          'positionReference':2 //The position of alert,  0=top, 1=top-right, 2=right-center, 3=top-left
        }
      },
      'hotelDetails':{
        'hasViewMore': false,
        'hasTitle': false,
        'hideHeroSlider': true,
        'hideBreadcrumbs': true,
        'defaultViewMode': 'compare',
        'scrollToOffset': 10,
        'showSubNav': false,
        'compareView':{
          'hideOnMobile':true,
          'headingTop':true,
          'amenitiesTop':true,
          'displayHeader':true,
          'slideWidth':'455',
          'slideHeight':'175',
          'thumbWidth':'110',
          'thumbHeight':'38'
        },
        'scrollToCompare': true, //Scroll to the compare view rather than top of entire container
        'hotelInfo': {
          'descriptionGrid': 7,
          'sidebarGrid': 5
        }
      },
      'roomDetails':{
        'hasViewMore': false,
        'showInclusions': true,
        'showAmenitiesTop': false,
        'showTagline': false,
        'hideHeroSlider': true,
        'hideBreadcrumbs': true,
        'roomInfo': {
          'descriptionGrid': 7,
          'sidebarGrid': 5
        },
        'fullWidthSections': true
      },
      'userProfile':{
        'hasAvatar': true,
        'hasWelcomeMessage': false,
        'hasPrestigeAccount': false,
        'hasRewards': false,
        'prestigeIsInfiniti': false,
        'infinitiPrestigeUrl': '',
        'hasLoyaltyInfo': false,
        'displayPointsWithUsername': true
      },
      'breadcrumbsBar':{
        'displayBreadcrumbs': false,
        'displayPropertyTitle': false,
        'displayStaticContent': false,
        'propertyHotDealsShowTitle': false
      },
      'locationMap':{
        'displayMainTitle': false,
        'displayGoogleMapsLink': true,
        'displayIcons': true,
        'directionsLink':{
          'display': false,
          'link': ''
        }
      },
      'reservationDetails':{
        'fullWidthSections':true
      },
      'reservationsOverview':{
        'fullWidthSections':true
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
      'defaultFormat': 'MMM. YYYY',
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
      'type': 'advanced'
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
    ]
  }
});
