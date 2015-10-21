'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',
  'defaultProductRateId': 1,
  'loginEndpoint': 'mobius',
  'API': {
    'defaultThrottleTimeout': 30,
    'cacheFlushInterval': 60,

    'GoogleAnalyticsID': 'UA-44368729-3',
    'ecommerceDataLayer': {
      'active': true,
      'trackUserId': true
    },
    'chainCode': 'DOCO',
    'baseURL': 'http://doco.mobiuswebservices.com/api/4.0/',
    'contents': {
      'contents': 'contents',
      'about': 'contents/about',
      'news': 'contents/news',
      'offers': 'contents/offers',
      'adverts': {
        'adverts': 'contents/adverts',
        'random': 'contents/adverts/random'
      }
    },
    'chain': {
      'get': 'chains/:chainCode/'
    },
    'generics': {
      'currencies': 'generics/currencies',
      'languages': 'generics/languages',
      'titles': 'generics/titles',
      'contactmethods': 'generics/contactmethods'
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
      'register':  'customers/'
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
      'action': 'reservations/:reservationCode/actions/:actionType'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-chainId': '354',
      'Mobius-channelId': '6'
    },
    'rewards': {
      // NOTE: Inconsistent API
      'all': 'rewards',
      // + BUY(post)
      'my': 'customers/:customerId/rewards'
    }
  },
  'UI': {
    'generics': {
      'singleProperty': true,
      'loyaltyProgramEnabled': false,
      'disableMainHeaderStyle': true,
      'showAltNav': false
    },
    'adverts' : {
      'randomMainPageAdvertSize' : 'homepage-advert',
      'heroAdverts': 'hero-advert'
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
      'showOffers': true,
      'showAbout': true,
      'showNews': false,
      'showContact': true,
      'offerSpecificToSelectedProperty': true,
      // Details: PT #102456878
      'hasSecondLevelDropdown': false
    },
    // Social links
    'socialLinks': [
      {'network': 'pinterest', 'link': 'https://pinterest.com/'},
      {'network': 'facebook', 'link': 'https://www.facebook.com/docohotel'},
      {'network': 'google', 'link': 'https://www.google.com'},
      {'network': 'twitter', 'link': 'https://twitter.com/docohotelvienna'},
      {'network': 'yelp', 'link': 'https://yelp.com'},
      {'network': 'flickr', 'link': 'https://flickr.com'}
    ],
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
      'chainPrefix': 'DO & CO Hotel Vienna',
      //List of rooms and their products
      'defaultNumberOfRooms': 2,
      'numberOfRoomsAddedOnMobile': 2,
      'rooms': {
        'defaultNumberOfAmenities': 3,
        'viewRatesButtonText': 'View Rates',
        // Loading rates when hovering over the room
        // in ms.
        'hoverTriggerDelay': 2000,
        // Room Rates
        'rates': {
          'bookNowButtonText': 'Book Now',
          'ratesPerRoomOnDesktop': 20,
          'ratesPerRoomOnMobile': 2,
          'showDescription': true
        }

      },
      // Cache timeout in seconds
      'ratesCacheTimeout': 30 * 60,
      'showLocalInfo': false
    },

    'roomDetails': {
      'hasReadMore': true
    },

    'reservations': {
      // Confirmation number display settings per hotel(code)
      'confirmationNumber': {
        'DOCO': {
          displayOnListView: true,
          displayOnDetailsView: true
        }
      }
    },

    'aboutHotel': {
      'benefits' : [
        {
          'name': 'Great <strong>Offers</strong>',
          'state': 'offers',
          'pictureUrl': '/static/images/v4/icon-offers.png',
          'text': 'Take advantage of our great offers and promotions to make your stay even more enjoyable!'
        },
        {
          'name': 'Sutton <strong>Prestige</strong>',
          'state': 'aboutUs({code: "prestige"})',
          'pictureUrl': '/static/images/v4/icon-discounts.png',
          'text': 'Accumulate points for each dollar spent and earn bonus points. Redeem them for unique gifts & rewards with our reward program'
        },
        {
          'name': 'Exciting <strong>News</strong>',
          'state': 'news',
          'pictureUrl': '/static/images/v4/icon-news.png',
          'text': 'Keep up to date with our latest news and read our interesting articles!'
        }
      ]
    },
    // toggle filters on hotels page
    'hotelFilters': {
      'stars': true,
      'tripAdvisor': true,
      'rates': true
    },
    // List of currencies and their display symbols
    'currencies': {
      'default': 'GBP',

      'GBP': {
        'symbol': '£',
        'format': '{{symbol}} {{amount}}'
      },

      'USD': {
        'symbol': '$',
        'format': '{{symbol}}{{amount}}'
      },

      'EUR': {
        'symbol': '€',
        'format': '{{symbol}}{{amount}}'
      },

      'CAD': {
        'symbol': '$',
        'format': '{{symbol}}{{amount}}'
      }
    },

    'languages': {
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
      'cs-cz': {
        'shortName': 'CZ',
        'name': 'Čeština',
        'decimalSeparator': ',',
        'groupSeparator': '\u00a0',
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
      'hasMutiroomTab': true,
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
          'value': -1,
          'type': 'month'
        },
        'to': {
          // Extra day/month added to a date
          'value': 1,
          'type': 'month'
        }
      }
    },

    'booking': {
      // Card types and validation expressions
      'cardTypes': {
        'visa': {
          'code': 'VI',
          'icon': 'visa',
          'regex': /^4[0-9]{12}(?:[0-9]{3})?$/
        },
        'master': {
          'code': 'MC',
          'icon': 'master',
          'regex': /^5[1-5][0-9]{14}$/
        },
        'amex': {
          'code': 'AX',
          'icon': 'amex',
          'regex': /^3[47][0-9]{13}$/
        },
        'discover': {
          'code': 'DS',
          'icon': 'discover',
          'regex': /^6(?:011|5[0-9]{2})[0-9]{3,}$/
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
      'hotel-location': '<hotel-location hotel-details="details"></hotel-location>'
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

    'viewsSettings': {
      'contacts': {
        'formGrid': 12,
        'hasContactDetails': false,
        'hasMap': true
      },
      'hotelDetails':{
        'hasViewMore': false,
        'hasAmenities': false
      },
      'userProfile':{
        'hasAvatar': false,
        'hasWelcomeMessage': true
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
      'prefix-hotel': '//res.cloudinary.com/dmh2cjswj/image/upload/v1444820062/Mobius/DOCO/properties_amenities/',
      'prefix-room': '//res.cloudinary.com/dmh2cjswj/image/upload/v1444820062/Mobius/DOCO/room_amenities/',
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
    }
  }
});
