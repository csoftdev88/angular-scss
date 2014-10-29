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
  'mobius.controllers.offers',
  'mobius.controllers.reservations',
  'mobius.controllers.modals.generic',
  'mobius.controllers.modals.loginRegister',
  'mobius.controllers.modals.advancedOptions',
  'mobius.controllers.modals.reservation',

  // Application modules
  'mobiusApp.config',

  // Services
  'mobiusApp.services.state',
  'mobiusApp.services.api',
  'mobiusApp.services.content',
  'mobiusApp.services.modal',

  // Custom components
  'mobiusApp.directives.layout',
  'mobiusApp.directives.slider',
  'mobiusApp.directives.booking',
  'mobiusApp.directives.best.offers',
  'mobiusApp.directives.best.hotels',
  'mobiusApp.directives.hotels',
  'mobiusApp.directives.room',
  'mobiusApp.directives.room.aside',
  'mobiusApp.directives.reservation.data',
  'mobiusApp.directives.equals',

  // Directive based on content data
  'mobiusApp.directives.menu',
  // Directives for generic data
  'mobiusApp.directives.currency',
  'mobiusApp.directives.language',

  // 3rd party components
  'localytics.directives',
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

    // Room reservation
    .state('index.reservation', {
      templateUrl: 'layouts/reservation/reservation.html',
      url: '/reservation',
      controller: 'ReservationsCtrl'
    })

    .state('index.reservation.details', {
      templateUrl: 'layouts/reservation/reservationDetails.html',
      url: '/details'
    })

    .state('index.reservation.billing', {
      templateUrl: 'layouts/reservation/reservationBilling.html',
      url: '/billing'
    })

    .state('index.reservation.confirmation', {
      templateUrl: 'layouts/reservation/reservationConfirmation.html',
      url: '/confirmation'
    })

    .state('index.offers', {
      templateUrl: 'layouts/offers/offers.html',
      url: '/offers/:category/:offerID',
      controller: 'OffersCtrl'
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
