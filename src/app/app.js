'use strict';

angular
  .module('mobiusApp', [
    'ui.router',
    // Bootstrap components
    'ui.bootstrap',
    'ngTouch',
    'ngMap',
    'ngSanitize',
    // Template cache
    'templates-main',

    // 3rd party components
    'localytics.directives',
    'underscore',
    'validation.match',
    'ui-rangeSlider',
    'angulike',

    // Controllers
    'mobius.controllers.common.sanitize',
    'mobius.controllers.common.preloader',
    'mobius.controllers.common.auth',
    'mobius.controllers.common.sso',
    'mobius.controllers.common.content',
    'mobius.controllers.common.price',
    'mobius.controllers.common.preference',
    'mobius.controllers.common.rates',
    'mobius.controllers.common.isoCountries',
    'mobius.controllers.common.autofillSync',

    'mobius.controllers.main',
    'mobius.controllers.about',
    'mobius.controllers.offers',
    'mobius.controllers.rewards',
    'mobius.controllers.news',
    'mobius.controllers.contacts',
    'mobius.controllers.reservations',
    'mobius.controllers.reservation',
    'mobius.controllers.reservationDetail',
    'mobius.controllers.reservationUpdate',
    'mobius.controllers.reservationLookup',
    'mobius.controllers.hotel.details',
    'mobius.controllers.hotel.subpage',
    'mobius.controllers.room.details',
    'mobius.controllers.reservationMultiRoom',

    'mobius.controllers.modals.generic',
    'mobius.controllers.modals.data',
    'mobius.controllers.modals.policy',
    'mobius.controllers.modals.loyalties.badges',
    'mobius.controllers.modals.addonDetail',
    'mobius.controllers.modals.locationDetail',
    'mobius.controllers.modals.confirmation',
    'mobius.controllers.common.cardExpiration',

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
    'mobiusApp.services.forms',
    'mobiusApp.services.adverts',
    'mobiusApp.services.reservation',
    'mobiusApp.services.breadcrumbs',
    'mobiusApp.services.rewards',
    'mobiusApp.services.preference',
    'mobiusApp.services.scroll',
    'mobiusApp.services.metaInformation',

    // Factories
    'mobiusApp.factories.template',
    'mobiusApp.factories.preloader',
    'mobiusApp.factories.cookie',

    // Custom components
    'mobiusApp.directives.layout',
    'mobiusApp.directives.slider',
    'mobiusApp.directives.best.offers',
    'mobiusApp.directives.best.hotels',
    'mobiusApp.directives.hotels',
    'mobiusApp.directives.room',
    'mobiusApp.directives.room.aside',
    'mobiusApp.directives.room.products',
    'mobiusApp.directives.reservation.data',
    'mobiusApp.directives.reservation.details',
    'mobiusApp.directives.equals',
    'mobiusApp.directives.resize.watcher',
    'mobiusApp.directives.dropdown.group',
    'mobiusApp.directives.datepicker',
    'mobiusApp.directives.chosenOptionsClass',
    'mobiusApp.directives.creditCardCheck',
    'mobiusApp.directives.hotelLocation',
    'mobiusApp.directives.emailCheck',
    'mobiusApp.directives.notifications',
    'mobiusApp.directives.markdownTextParser',
    // Common controllers
    'mobius.controllers.reservation.directive',
    'mobiusApp.directives.embeddedForm',
    'mobiusApp.directives.bindUnsafe',

    // Directive based on content data
    'mobiusApp.directives.menu',
    'mobiusApp.directives.siteMap',

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
    'mobiusApp.directives.breadcrumbs',
    'mobiusApp.directives.slugImg',
    'mobiusApp.directives.googleAnalyticsScript',
    'mobiusApp.directives.scrollPosition',
    'mobiusApp.directives.stickable',
    'internationalPhoneNumber',

    // Filters
    'mobiusApp.filters.list',
    'mobiusApp.filters.number',
    'mobiusApp.filters.currency',
    'mobiusApp.filters.pluralization',
    'mobiusApp.filters.dateTime',
    'mobiusApp.filters.checkInDate',
    'mobiusApp.filters.cloudinaryImage',
    'mobiusApp.filters.truncate',
    'mobiusApp.filters.wrapword',
    'mobiusApp.filters.mainHeaderStyle'
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
        url: '?property&location&region&children&adults&dates&rate&rooms&room&promoCode&corpCode&groupCode&reservation&fromSearch&email&scrollTo'
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
        url: '/hotels/:propertySlug',
        data: {
          // Route is also used for reservation updates
          supportsEditMode: true,
          supportsMultiRoom: true,
          hasRateNotification: true
        }
      })

      .state('hotelInfo', {
        parent: 'root',
        templateUrl: 'layouts/hotels/hotelSubpage.html',
        controller: 'HotelSubpageCtrl',
        url: '/hotels/:propertySlug/:infoSlug'
      })

      .state('room', {
        parent: 'root',
        templateUrl: 'layouts/hotels/roomDetails.html',
        controller: 'RoomDetailsCtrl',
        url: '/hotels/:propertySlug/rooms/:roomSlug',
        data: {
          supportsEditMode: true,
          supportsMultiRoom: true,
          hasRateNotification: true
        }
      })

      .state('reservations', {
        parent: 'root',
        templateUrl: 'layouts/reservations/reservations.html',
        url: '/reservations',
        controller: 'ReservationsCtrl',
        data: {
          authProtected: true
        }
      })

      .state('reservationDetail', {
        parent: 'root',
        templateUrl: 'layouts/reservations/reservationDetail.html',
        url: '/reservation/:reservationCode?view',
        controller: 'ReservationDetailCtrl',
        data: {
          authProtected: true
        }
      })

      // Room reservation
      .state('reservation', {
        parent: 'root',
        templateUrl: 'layouts/reservations/reservation/reservation.html',
        url: '/reservation/:roomID/:productCode',
        controller: 'ReservationCtrl',
        data: {
          supportsEditMode: true,
          supportsMultiRoom: true
        }
      })

      .state('reservation.details', {
        parent: 'reservation',
        templateUrl: 'layouts/reservations/reservation/details.html'
      })
      .state('reservation.billing', {
        parent: 'reservation',
        templateUrl: 'layouts/reservations/reservation/billing.html'
      })
      .state('reservation.confirmation', {
        parent: 'reservation',
        templateUrl: 'layouts/reservations/reservation/confirmation.html'
      })

      .state('offers', {
        parent: 'root',
        templateUrl: 'layouts/offers/offers.html',
        url: '/offers/:code',
        controller: 'OffersCtrl'
      })

      // Rewards page
      .state('rewards', {
        parent: 'root',
        templateUrl: 'layouts/rewards/rewards.html',
        url: '/rewards',
        controller: 'RewardsCtrl'
      })

      // News page
      .state('news', {
        parent: 'root',
        templateUrl: 'layouts/news/news.html',
        url: '/news/:code',
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
        url: '/about/:code',
        controller: 'AboutUsCtrl'
      })

      // Reservation Lookup page
      .state('lookup', {
        parent: 'root',
        templateUrl: 'layouts/lookup/lookup.html',
        url: '/lookup',
        controller: 'ReservationLookupCtrl'
      })

      // 404 page
      .state('unknown', {
        parent: 'root',
        templateUrl: 'layouts/404.html',
        url: '/404'
      })
    ;

    $urlRouterProvider.otherwise(function($injector) {
      $injector.get('$state').go('unknown');
    });
  })

  .run(function(user, $rootScope, $state, breadcrumbsService) {
    $rootScope.$on('$stateChangeSuccess', function() {
      breadcrumbsService.clear();
    });
    $rootScope.facebookAppId = '954663594591416';
  })

  .controller('BaseCtrl', function($scope, $controller, scrollService,
    metaInformationService){

    $controller('ReservationUpdateCtrl', {$scope: $scope});
    $controller('SSOCtrl', {$scope: $scope});
    $controller('ReservationMultiRoomCtrl', {$scope: $scope});

    // TODO: FIX THIS - scrolling should be done differently
    //$controller('HotelDetailsCtrl', {$scope: $scope});

    $scope.$on('$stateChangeStart', function() {
      $scope.sso.trackPageLeave();
      metaInformationService.reset();
    });

    $scope.$on('$stateChangeSuccess', function() {
      $scope.sso.trackPageView();
      $scope.$on('$viewContentLoaded', function() {
        scrollService.scrollTo();
      });
    });
  });