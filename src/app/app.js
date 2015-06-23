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
    'mobius.controllers.news',
    'mobius.controllers.contacts',
    'mobius.controllers.reservations',
    'mobius.controllers.reservation',
    'mobius.controllers.modals.generic',
    'mobius.controllers.modals.data',
    'mobius.controllers.modals.policy',
    'mobius.controllers.modals.loyalties.badges',
    'mobius.controllers.room.details',
    'mobius.controllers.modals.associatedRoom',
    'mobius.controllers.modals.addonDetail',

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
    'mobiusApp.services.reservation',

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
    'mobiusApp.directives.reservation.details',
    'mobiusApp.directives.equals',
    'mobiusApp.directives.resize.watcher',
    'mobiusApp.directives.dropdown.group',
    'mobiusApp.directives.datepicker',
    'mobiusApp.directives.chosenOptionsClass',
    'mobiusApp.directives.creditCardCheck',
    'mobiusApp.directives.monthPicker',
    'mobiusApp.directives.hotelLocation',
    'mobiusApp.directives.emailCheck',
    // Common controllers
    'mobius.controllers.reservation.directive',

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
    'mobiusApp.filters.pluralization',
    'mobius.filters.dateTime',
    'mobius.filters.checkInDate'
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
        url: '?property&region&children&adults&dates&rate&rooms',
        data: {},
        resolve: {
          userObject: function(user) {
            return user.loadProfile().then(function(userObject) {
              return userObject;
            }, function() {
              return {};
            });
          }
        }
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

      .state('reservations', {
        parent: 'root',
        templateUrl: 'layouts/reservations/reservations.html',
        url: '/reservations',
        controller: 'ReservationsCtrl',
        data: {
          private: true
        }
      })

      // Room reservation
      .state('reservation', {
        parent: 'root',
        template: '<ui-view></ui-view>',
        url: '/reservation/:roomID/:productCode',
        controller: 'ReservationCtrl'
      })

      .state('reservation.process', {
        parent: 'reservation',
        templateUrl: 'layouts/reservations/reservation/reservation.html',
        abstract: true
      })
      .state('reservation.details', {
        parent: 'reservation.process',
        templateUrl: 'layouts/reservations/reservation/details.html'
      })
      .state('reservation.billing', {
        parent: 'reservation.process',
        templateUrl: 'layouts/reservations/reservation/billing.html'
      })
      .state('reservation.confirmation', {
        parent: 'reservation.process',
        templateUrl: 'layouts/reservations/reservation/confirmation.html'
      })

      .state('reservation.after', {
        parent: 'reservation',
        templateUrl: 'layouts/reservations/reservation/after.html'
      })

      .state('offers', {
        parent: 'root',
        templateUrl: 'layouts/offers/offers.html',
        url: '/offers/:category/:offerID',
        controller: 'OffersCtrl'
      })

      // News page
      .state('news', {
        parent: 'root',
        templateUrl: 'layouts/news/news.html',
        url: '/news/',
        controller: 'NewsCtrl'
      })

      // Contact page
      .state('contacts', {
        parent: 'root',
        templateUrl: 'layouts/contacts/contacts.html',
        url: '/contacts',
        controller: 'ContactsCtrl'
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

  .run(function(user, $rootScope, $state) {
    // $stateChangeSuccess is used because resolve on controller is ready
    $rootScope.$on('$stateChangeSuccess', function(event, next) {
      if (next.data.private) {
        var loggedIn = user.isLoggedIn();
        if (!loggedIn) {
          // Redirect to home page
          event.preventDefault();
          $state.go('home');
        }
      }
    });
  })
;
