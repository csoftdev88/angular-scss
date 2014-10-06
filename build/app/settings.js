'use strict';
angular.module('mobiusApp.config', []).constant('Settings', {
  'layout': {
    'index.home': [
      'best-offers',
      'best-hotels'
    ]
  },
  'templates': {
    'best-offers': '<best-offers></best-offers>',
    'best-hotels': '<div class="grid-wrapper"><best-hotels></best-hotels></div>'
  }
});