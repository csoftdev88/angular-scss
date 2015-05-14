'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'API': {
    'baseURL': 'http://52.6.221.79:3010/api/2.7.1/',
    'contents' : 'contents',
    'generics': {
      'currencies': 'generics/currencies',
      'languages': 'generics/languages'
    },

    'properties': {
      'all': 'properties'
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
      'index.hotels': [
        {
          'image': '/static/images/hero-image-1.jpg'
        }
      ],

      'index.hotel': [
        {
          'image': '/static/images/hero-image-2.jpg'
        }
      ],

      'index.room': [
        {
          'image': '/static/images/hero-image-2.jpg'
        }
      ]
    },
    // List of currencies and their display symbols
    'currencies': {
      'default': 'GBP',

      'GBP': {
        'symbol': '£'
      },

      'USD': {
        'symbol': '$'
      },

      'EUR': {
        'symbol': '€'
      },

      'CAD': {
        'symbol': '$'
      }
    },

    'languages': {
      'en-us': {
        'shortName': 'EN',
        'name': 'English (US)'
      },
      'en-ca': {
        'shortName': 'EN',
        'name': 'English (CAN)'
      },
      'cs-cz': {
        'shortName': 'CZ',
        'name': 'Čeština'
      }
    },

    // Settings related to booking process
    'bookingWidget': {
      'maxAdults': 6,
      'maxChildren': 8
    },

    // States layout
    'layout': {
      'index.home': [
        'best-offers',
        'best-hotels'
      ],
      'index.hotels': [
        'hotels'
      ],
      'index.room': [
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
    }
  }
});
