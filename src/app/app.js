'use strict';

angular
  .module('mobiusApp', [
    'ui.router',
    // Bootstrap components
    'ui.bootstrap',
    'ngTouch',
    // Template cache
    'templates-main',

    // 3rd party components
    'localytics.directives',
    'underscore',
    'validation.match',

    // Controllers
    'mobius.controllers.main',
    'mobius.controllers.offers',
    'mobius.controllers.reservations',
    'mobius.controllers.modals.generic',
    'mobius.controllers.modals.login',
    'mobius.controllers.modals.register',
    'mobius.controllers.modals.advancedOptions',
    'mobius.controllers.modals.reservation',
    'mobius.controllers.hotel.details',

    // Application modules
    'mobiusApp.config',
    'mobiusApp.userobject',
    // Services
    'mobiusApp.services.state',
    'mobiusApp.services.api',
    'mobiusApp.services.content',
    'mobiusApp.services.modal',
    'mobiusApp.services.properties',
    'mobiusApp.services.query',
    'mobiusApp.services.validation',
    'mobiusApp.services.user',
    'mobiusApp.services.booking',
    'mobiusApp.services.filters',

    // Factories
    'mobiusApp.factories.template',

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
    'mobiusApp.directives.resize.watcher',
    'mobiusApp.directives.dropdown.group',
    'mobiusApp.directives.datepicker',
    'mobiusApp.directives.password',
    // Directive based on content data
    'mobiusApp.directives.menu',
    // Directives for generic data
    'mobiusApp.directives.currency',
    'mobiusApp.directives.language',
    // Filters
    'mobiusApp.filters.list',
    'mobiusApp.filters.number',
    'mobiusApp.filters.currency'
  ])

  .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    // Using this settings allows to run current
    // SPA without # in the URL
    $locationProvider.html5Mode(true);

    $stateProvider
      // Default application layout
      .state('root', {
        abstract: true,
        templateUrl: 'layouts/index.html',
        controller: 'MainCtrl',
        // NOTE: These params are used by booking widget
        // Can be placed into induvidual state later if needed
        // TODO: Unify hotelID/propery param
        url: '?property&children&adults&dates&rate&rooms'
      })

      // Home page
      .state('home', {
        parent: 'root',
        templateUrl: 'layouts/home/home.html',
        url: '/'
      })

      // Hotels
      .state('hotels', {
        parent: 'root',
        templateUrl: 'layouts/hotels/hotels.html',
        url: '/hotels'
      })

      .state('hotel', {
        parent: 'root',
        templateUrl: 'layouts/hotels/hotelDetails.html',
        controller: 'HotelDetailsCtrl',
        url: '/hotels/:hotelID'
      })

      .state('room', {
        parent: 'root',
        templateUrl: 'layouts/hotels/roomDetails.html',
        url: '/hotels/:hotelID/rooms/:roomID'
      })

      // Room reservation
      .state('reservation', {
        parent: 'root',
        templateUrl: 'layouts/reservation/reservation.html',
        url: '/reservation',
        controller: 'ReservationsCtrl'
      })

      .state('reservation.details', {
        parent: 'reservation',
        templateUrl: 'layouts/reservation/reservationDetails.html',
        url: '/details'
      })

      .state('reservation.billing', {
        parent: 'reservation',
        templateUrl: 'layouts/reservation/reservationBilling.html',
        url: '/billing'
      })

      .state('reservation.confirmation', {
        parent: 'reservation',
        templateUrl: 'layouts/reservation/reservationConfirmation.html',
        url: '/confirmation'
      })

      .state('offers', {
        parent: 'root',
        templateUrl: 'layouts/offers/offers.html',
        url: '/offers/:category/:offerID',
        controller: 'OffersCtrl'
      })

      // Contact page
      .state('contacts', {
        parent: 'root',
        templateUrl: 'layouts/contacts/contacts.html',
        url: '/contacts'
      });

    $urlRouterProvider.otherwise(function($injector) {
      var $window = $injector.get('$window');
      $window.location.href = '/404';
    });
  })
;
