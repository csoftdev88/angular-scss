'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'API': {
    'chainCode': 'SAN',
    'baseURL': '/api/',
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
      'languages': 'generics/languages'
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
          all: 'properties/:propertyCode/rooms/:roomTypeCode/products',
          addons: 'properties/:propertyCode/rooms/:roomTypeCode/products/:productCode/addons/'
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
      'customer': 'customers/:customerId'
    },
    // NOTE: Loyalties API will change - check apiary specs
    'loyalties': {
      'all': 'customers/:customerId/loyalty'
    },
    'reservations': {
      'new': 'reservations',
      'modify': 'reservations/:reservationCode',
      'detail': 'reservations/:reservationCode',
      'cancel': 'reservations/:reservationCode/actions/cancel',
      // NOTE: Currently used for all/details - check the API
      'all': 'reservations/'
    },
    'headers': {
      // Auth header is set by a static server. See: config/environment/index.js
      'Mobius-chainId': '1',
      'Mobius-channelId': '6'
    }
  },

  'currencyParamName': 'currency',
  'defaultProductRateCode': 'Leisure Rates',

  'UI': {
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
      'singleProperty': false,
      'showOffers': true,
      'showAbout': true,
      'showNews': true,
      'showContact': true
    },
    // NOTE: This is a temporary solution. Real images will
    // be provided by the API.
    'heroStaticContent': {
      'default': [
        {
          'bannerSize': 'hero-advert',
          'uri': '/static/images/hero-image-1.jpg',
          'alt': 'picture1'
        }
      ]
    },
    'aboutHotel': {
      'benefits' : [
        {'name': 'Great offers', 'pictureUrl': '/static/images/v4/icon-offers.png', 'text': 'Take advantage of our great offers and promotions to make your stay even more enjoyable!'},
        {'name': 'Sutton Prestige', 'pictureUrl': '/static/images/v4/icon-discounts.png', 'text': 'Accumulate points for each dollar spent and earn bonus points. Redeem them for unique gifts & rewards with our reward program'},
        {'name': 'Exciting news', 'pictureUrl': '/static/images/v4/icon-news.png', 'text': 'Keep up to date with our latest news and read our interesting articles!'}
      ]
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
        'format': '{{amount}}{{symbol}}'
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
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      'includeAllPropertyOption': true,
      'adults': {
        'min': 1,
        'max': 6
      },
      'children': {
        'min': 0,
        'max': 8
      },
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
        'loyalities': true
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
      'mobile': {
        'maxWidth': 768
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
          format: 'dd'
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
    }
  }
});
