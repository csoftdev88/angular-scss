'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'API': {
    'baseURL': '/api/',
    'contents' : 'contents',
    'generics': {
      'currencies': 'generics/currencies',
      'languages': 'generics/languages'
    },
    'filters': {
      'products': 'filters/products',
      'rooms': 'filters/rooms'
    },
    'properties': {
      'all': 'properties',
      'details': 'properties/:propertyCode/',
      'availability': 'properties/:propertyCode/availabilities',
      'room': {
        'details': 'properties/:propertyCode/rooms/:roomTypeCode',
        'productDetails': 'properties/:propertyCode/rooms/:roomTypeCode/products'
      }
    },
    'customers': {
      'login': 'customers/actions/login',
      'customers': 'customers'
    },

    'headers': {
      'Authorization': 'Basic ZGllZ286ZGllZ28=',
      'Mobius-chainId': '1',
      'Mobius-channelId': '6'
    }
  },

  'currencyParamName': 'currency',
  'bestAvailableRateCode': 'Best Available Rate',

  'UI': {
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
    'heroContent': {
      'hotels': [
        {
          'image': '/static/images/hero-image-1.jpg'
        }
      ],

      'hotel': [
        {
          'image': '/static/images/hero-image-2.jpg'
        }
      ],

      'room': [
        {
          'image': '/static/images/hero-image-2.jpg'
        }
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
      'adults': {
        'min': 1,
        'max': 6
      },
      'children': {
        'min': 0,
        'max': 8
      },
      'advanced': {
        'maxRooms': 4
        // NOTE: maxAdults and maxChildren
        // settings are defined above
      },
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

    // States layout
    'layout': {
      'home': [
        'best-offers',
        'best-hotels'
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
    }
  }
});
