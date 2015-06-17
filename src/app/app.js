'use strict';

angular
  .module('mobiusApp', [
    'ui.router',
    // Bootstrap components
    'ui.bootstrap',
    'ngTouch',
    'ngMap',
    'ngSanitize',
    'ngCookies',
    // Template cache
    'templates-main',

    // 3rd party components
    'localytics.directives',
    'underscore',
    'validation.match',
    'ui-rangeSlider',

    // Controllers
    'mobius.controllers.common.sanitize',
    'mobius.controllers.common.preloader',

    'mobius.controllers.main',
    'mobius.controllers.about',
    'mobius.controllers.offers',
    'mobius.controllers.reservations',
    'mobius.controllers.modals.generic',
    'mobius.controllers.modals.data',
    'mobius.controllers.modals.reservation',
    'mobius.controllers.modals.policy',
    'mobius.controllers.modals.loyalties.loyalty',
    'mobius.controllers.modals.loyalties.badges',
    'mobius.controllers.modals.gallery',

    'mobius.controllers.hotel.details',
    'mobius.controllers.room.details',

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
    'mobiusApp.services.loyalty',
    'mobiusApp.services.locations',
    'mobiusApp.services.creditCardType',
    'mobiusApp.services.userMessagesService',
    'mobiusApp.services.chains',

    // Factories
    'mobiusApp.factories.template',
    'mobiusApp.factories.preloader',

    // Custom components
    'mobiusApp.directives.layout',
    'mobiusApp.directives.slider',
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
    'mobiusApp.directives.chosenOptionsClass',
    // Directive based on content data
    'mobiusApp.directives.menu',
    // Directives for generic data
    'mobiusApp.directives.currency',
    'mobiusApp.directives.language',
    // V4
    'mobiusApp.directives.aboutHotel',
    'mobiusApp.directives.floatingBar',
    'mobiusApp.directives.errSource',
    'mobiusApp.directives.localInfo',
    'mobiusApp.directives.userMessages',
    'mobiusApp.directives.imageCarousel',

    // Filters
    'mobiusApp.filters.list',
    'mobiusApp.filters.number',
    'mobiusApp.filters.currency',
    'mobiusApp.filters.pluralization'
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
        url: '?property&region&children&adults&dates&rate&rooms'
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
        url: '/hotels/:propertyCode'
      })

      .state('room', {
        parent: 'root',
        templateUrl: 'layouts/hotels/roomDetails.html',
        controller: 'RoomDetailsCtrl',
        url: '/hotels/:propertyCode/rooms/:roomID'
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
      })

      // About Us oage
      .state('aboutUs', {
        parent: 'root',
        templateUrl: 'layouts/about/about.html',
        url: '/about',
        controller: 'AboutUsCtrl'
      })
    ;

    $urlRouterProvider.otherwise(function($injector) {
      var $window = $injector.get('$window');
      $window.location.href = '/404';
    });
  })

  .run(function(user) {
    user.loadProfile();
  });

