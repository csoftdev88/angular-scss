'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'API': {
    'baseURL': 'http://private-00016-mobius1.apiary-mock.com/',
    'content': {
      'news': 'content/news',
      'loyalties': 'content/simpleloyalties',
      'offers': 'content/specialoffers',
      'abouts': 'content/abouts',
      'hightlighted': 'content?hightlighted'
    },

    'generics': {
      'currencies': 'generics/currencies',
      'languages': 'generics/languages'
    }
  },

  'UI': {
    'heroSlider': {
      // Timing settings in ms
      'autoplayDelay': 5000,
      'animationDuration': 700,
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
        'symbol': '€'
      }
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
    }
  }
});
