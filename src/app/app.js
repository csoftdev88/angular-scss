'use strict';

angular.module('mobiusApp', [
  'ngRoute',
  'ui.router',
  // Bootstrap components
  'ui.bootstrap',
  // Template cache
  'templates-app',

  // Controllers
  'mobius.controllers.main',

  // 3rd party components
  'localytics.directives',

  // Application modules
  'mobiusApp.config',

  // Services
  'mobiusApp.services.state',
  'mobiusApp.services.api',
  'mobiusApp.services.content',

  // Custom components
  'mobiusApp.directives.layout',
  'mobiusApp.directives.slider',
  'mobiusApp.directives.booking',
  'mobiusApp.directives.best.offers',
  'mobiusApp.directives.best.hotels',
  'mobiusApp.directives.hotels',
  'mobiusApp.directives.room',
  'mobiusApp.directives.room.aside',

  // Directive based on content data
  'mobiusApp.directives.menu',
  // Directives for generic data
  'mobiusApp.directives.currency',
  'mobiusApp.directives.language'
])

.config(function ($stateProvider, $locationProvider) {
  // Using this settings allows to run current
  // SPA without # in the URL
  $locationProvider.html5Mode(true);

  $stateProvider
    // Default application layout
    .state('index', {
      templateUrl: 'layouts/index.html',
      controller: 'MainCtrl'
    })

    // Home page
    .state('index.home', {
      templateUrl: 'layouts/home/home.html',
      url: '/'
    })

    // Hotels
    .state('index.hotels', {
      templateUrl: 'layouts/hotels/hotels.html',
      url: '/hotels'
    })

    .state('index.hotel', {
      templateUrl: 'layouts/hotels/hotelDetails.html',
      url: '/hotels/:hotelID'
    })

    .state('index.room', {
      templateUrl: 'layouts/hotels/roomDetails.html',
      url: '/hotels/:hotelID/rooms/:roomID'
    })

    // Contact page
    .state('index.contacts', {
      templateUrl: 'layouts/contacts/contacts.html',
      url: '/contacts'
    })

    .state('otherwise', {
      url: '/'
    });
});
