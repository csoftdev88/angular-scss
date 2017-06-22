/**
 * Main application module
 *
 * Please don't add anything to this file other than module dependencies
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp', [
      'ui.router',
      // Bootstrap components
      'ui.bootstrap',
      'ngTouch',
      'ngMap',
      'ngSanitize',
      'btford.markdown',
      'ngAnimate',
      // Template cache
      'templates-main',

      // 3rd party components
      'angular.chosen',
      'underscore',
      'validation.match',
      'ui-rangeSlider',
      'angulike',
      '720kb.tooltips',
      'angularUtils.directives.dirPagination',
      'angular-growl',
      'ng.deviceDetector',
      'angular.vertilize',
      'angular-cookie-law',

      // Controllers
      'mobius.controllers.common.sanitize',
      'mobius.controllers.common.preloader',
      'mobius.controllers.common.auth',
      'mobius.controllers.common.content',
      'mobius.controllers.common.price',
      'mobius.controllers.common.preference',
      'mobius.controllers.common.rates',
      'mobius.controllers.common.isoCountries',
      'mobius.controllers.common.autofillSync',

      'mobius.controllers.main',
      'mobius.controllers.about',
      'mobius.controllers.offers',
      'mobius.controllers.regions',
      'mobius.controllers.regions.subpage',
      'mobius.controllers.rewards',
      'mobius.controllers.news',
      'mobius.controllers.contacts',
      'mobius.controllers.reservations',
      'mobius.controllers.reservation',
      'mobius.controllers.reservationDetail',
      'mobius.controllers.reservation.confirmationNumber',
      'mobius.controllers.reservationUpdate',
      'mobius.controllers.reservationLookup',
      'mobius.controllers.hotel.details',
      'mobius.controllers.hotel.subpage',
      'mobius.controllers.room.details',
      'mobius.controllers.reservationMultiRoom',
      'mobius.controllers.profile',
      'mobius.controllers.register',
      'mobius.controllers.resetPassword',
      'mobius.controllers.prestige',
      'mobius.controllers.staticContent',
      'mobius.controllers.thirdParties',
      'mobius.controllers.roomUpgrades',

      'mobius.controllers.modals.generic',
      'mobius.controllers.modals.data',
      'mobius.controllers.modals.policy',
      'mobius.controllers.modals.loyalties.badges',
      'mobius.controllers.modals.addonDetail',
      'mobius.controllers.modals.locationDetail',
      'mobius.controllers.modals.confirmation',
      'mobius.controllers.common.cardExpiration',
      'mobius.controllers.modals.upsells',
      'mobius.controllers.modals.campaign',
      'mobius.controllers.modals.password',
      'mobius.controllers.modals.previousSearches',
      'mobius.controllers.modals.funnelRetentionExit',
      'mobius.controllers.modals.altProducts',

      // Application modules
      'mobiusApp.config',
      'mobiusApp.dynamicMessages',
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
      'mobiusApp.services.dataLayer',
      'mobiusApp.services.exceptionHandler',
      'mobiusApp.services.userPreferenceService',
      'mobiusApp.services.sessionDataService',
      'mobiusApp.services.mobiusTrackingService',
      'mobiusApp.services.infinitiEcommerceService',
      'mobiusApp.services.infinitiApeironService',
      'mobiusApp.services.channelService',
      'mobiusApp.services.router',
      'mobiusApp.services.track404s',
      'mobiusApp.services.campaigns',
      'mobiusApp.services.thirdPartiesService',
      'mobiusApp.services.previousSearches',
      'mobiusApp.services.funnelRetention',
      'mobiusApp.services.roomUpgrades',
      'mobiusApp.services.polls',

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
      'mobiusApp.directives.room.otaProducts',
      'mobiusApp.directives.room.altRoomDates',
      'mobiusApp.directives.room.altRoomProperties',
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
      'mobiusApp.directives.socialLinks',
      'mobiusApp.directives.taTeaser',
      'mobiusApp.directives.stickyHeader',

      // Common controllers
      'mobius.controllers.reservation.directive',
      'mobiusApp.directives.embeddedForm',
      'mobiusApp.directives.bindUnsafe',

      // Directive based on content data
      'mobiusApp.directives.menu',
      'mobiusApp.directives.megaMenu',
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
      'mobiusApp.directives.hotjarScript',
      'mobiusApp.directives.evolutionInfinitiScript',
      'mobiusApp.directives.googleTagManagerScript',
      'mobiusApp.directives.infinitiScript',
      'mobiusApp.directives.infinitiApeironScript',
      'mobiusApp.directives.rumScript',
      'mobiusApp.directives.scrollPosition',
      'mobiusApp.directives.stickable',
      'mobiusApp.directives.hoverTrigger',
      'mobiusApp.directives.scrollToTop',
      'mobiusApp.directives.growlAlerts',
      'mobiusApp.directives.optionsDisabled',
      'mobiusApp.directives.slidedownNotifications',
      'mobiusApp.directives.inclusions',
      'mobiusApp.directives.sectionImage',
      'mobiusApp.directives.lbe.recommendation',
      'mobiusApp.directives.lbe.questionnaire',
      'mobiusApp.directives.lbe.bookingBar',
      'mobiusApp.directives.lbe.highlight',
      'mobiusApp.directives.lbe.instagramFeed',
      'mobiusApp.directives.lbe.offers',
      'mobiusApp.directives.lbe.tagline',
      'mobiusApp.directives.lbe.hotelIntro',
      'mobiusApp.directives.lbe.subNav',
      'mobiusApp.directives.lbe.tripAdviserQuote',
      'mobiusApp.directives.lbe.membersRate',
      'mobiusApp.directives.lbe.localAttractions',

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
      'mobiusApp.filters.mainHeaderStyle',
      'mobiusApp.filters.stringLocaleReplace',
      'mobiusApp.filters.content',
      'mobiusApp.filters.trustAsHtml',
      'mobiusApp.filters.byNameOrZip',
      'mobiusApp.filters.trustAsUrl'
    ]);
}());
