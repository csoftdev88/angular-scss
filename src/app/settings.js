'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'API': {
    'baseURL': 'http://private-00016-mobius1.apiary-mock.com/'
  },

  'layout': {
    'index.home': [
      'best-offers',
      'best-hotels'
    ]
  },

  'UI': {
    // Menu settings - showing/hidding menu items
    'menu': {
      'singleProperty': false,
      'showOffers': true,
      'showAbout': true,
      'showNews': true,
      'showContact': true
    },

    // States layout
    'layout': {
      'index.home': [
        'best-offers',
        'best-hotels'
      ]
    },

    // Widget names and their templates
    'templates': {
      'best-offers': '<best-offers></best-offers>',
      'best-hotels': '<div class="grid-wrapper"><best-hotels></best-hotels></div>'
    }
  }

});