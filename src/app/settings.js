'use strict';

angular.module('mobiusApp.config', [])

.constant('Settings', {
  'layout': {
    'index.home': [
      'best-offers',
      'best-hotels'
    ]
  },
/*
  'hotels': {
    'index.hotels': [
      'hotels'
    ]
  },
*/
  // Widgets name vs templates map
  'templates': {
    'best-offers': '<best-offers></best-offers>',
    'best-hotels': '<best-hotels></best-hotels>'
  }
});
