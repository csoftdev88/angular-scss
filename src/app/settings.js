'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'layout': {
    'index.home': [
      'best-offers',
      'best-hotels'
    ],
    'index.hotels': [
      'hotels'
    ],
    'index.room': [
      'room'
    ]
  },

  // Widgets name vs templates map
  'templates': {
    'best-offers': '<best-offers></best-offers>',
    'best-hotels': '<best-hotels></best-hotels>',
    'hotels': '<hotels></hotels>',
    'room': '<room></room>'
  }
});
