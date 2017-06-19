'use strict';
/*globals Raven */

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
  ])

.config(function($stateProvider, $locationProvider, $urlRouterProvider, growlProvider, Settings) {
  // Using this settings allows to run current
  // SPA without # in the URL
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  //Global config for growl messages
  growlProvider.globalTimeToLive(30000);
  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalPosition('top-center');
  //growlProvider.globalReversedOrder(true);

  // Determine which layouts to used based on engine type
  var aboutLayout = 'layouts/about/about.html';
  var indexLayout = 'layouts/index.html';
  var homeLayout = 'layouts/home/home.html';
  if (Settings.engine === 'loyalty') {
    aboutLayout = 'layouts/lbe/about/about.html';
    indexLayout = 'layouts/lbe/index.html';
    homeLayout = 'layouts/lbe/home/home.html';
  }

  $stateProvider
  // Default application layout
    .state('root', {
    abstract: true,
    templateUrl: indexLayout,
    controller: 'MainCtrl',
    // NOTE: These params are used by booking widget
    // Can be placed into induvidual state later if needed
    url: '?property&location&region&adults&children&dates&rate&rooms&room&promoCode&corpCode&groupCode&voucher&reservation&fromSearch&email&scrollTo&viewAllRates&resetcode&ch&meta&gclid&roomUpgrade'
  })

  // Home page
  .state('home', {
    parent: 'root',
    templateUrl: homeLayout,
    url: '/'
  })

  // Hotels
  .state('allHotels', {
    parent: 'root',
    templateUrl: 'layouts/hotels/hotels.html',
    url: '/hotels'
  })

  // 3rd Parties
  .state('thirdParties', {
    parent: 'root',
    templateUrl: 'layouts/home/home.html',
    controller: 'ThirdPartiesCtrl',
    url: '/corp/:code',
    params: {
      code: {
        value: null,
        squash: true
      }
    }
  });

  if (Settings.newUrlStructure) {
    $stateProvider
    // Regions
      .state('regions', {
      parent: 'root',
      templateUrl: 'layouts/regions/regions.html',
      controller: 'RegionsCtrl',
      url: '/locations/:regionSlug',
      params: {
        regionSlug: {
          value: null,
          squash: true
        }
      }
    })

    .state('hotels', {
      parent: 'root',
      templateUrl: 'layouts/hotels/hotels.html',
      url: '/locations/:regionSlug/:locationSlug/hotels',
      params: {
        regionSlug: {
          value: null,
          squash: true
        },
        locationSlug: {
          value: null,
          squash: true
        }
      }
    })

    .state('hotel', {
      parent: 'root',
      templateUrl: 'layouts/hotels/hotelDetails.html',
      controller: 'HotelDetailsCtrl',
      url: '/locations/:regionSlug/:locationSlug/hotels/:propertySlug',
      reloadOnSearch: false,
      data: {
        // Route is also used for reservation updates
        supportsEditMode: true,
        supportsMultiRoom: true,
        hasRateNotification: true
      },
      params: {
        regionSlug: {
          value: null,
          squash: true
        },
        locationSlug: {
          value: null,
          squash: true
        }
      }
    })

    .state('hotelInfo', {
      parent: 'root',
      templateUrl: 'layouts/hotels/hotelSubpage.html',
      controller: 'HotelSubpageCtrl',
      url: '/locations/:regionSlug/:locationSlug/hotels/:propertySlug/:infoSlug'
    })

    .state('locationInfo', {
      parent: 'root',
      templateUrl: 'layouts/hotels/hotelSubpage.html',
      controller: 'RegionsSubpageCtrl',
      url: '/locations/:regionSlug/:locationSlug/:infoSlug',
      params: {
        locationSlug: {
          value: null,
          squash: true
        }
      }
    })

    .state('room', {
      parent: 'root',
      templateUrl: 'layouts/hotels/roomDetails.html',
      controller: 'RoomDetailsCtrl',
      url: '/locations/:regionSlug/:locationSlug/hotels/:propertySlug/rooms/:roomSlug',
      reloadOnSearch: false,
      data: {
        supportsEditMode: true,
        supportsMultiRoom: true,
        hasRateNotification: true
      }
    });
  } else {
    $stateProvider
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
      reloadOnSearch: false,
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
      reloadOnSearch: false,
      data: {
        supportsEditMode: true,
        supportsMultiRoom: true,
        hasRateNotification: true
      }
    });
  }

  $stateProvider
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
    reloadOnSearch: false,
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

  .state('propertyOffers', {
    parent: 'root',
    templateUrl: 'layouts/offers/offers.html',
    url: '/hotels/:propertySlug/offers/:code',
    controller: 'OffersCtrl'
  });

  //Only allow hot deals urls if hot deals is enabled
  if(Settings.enableHotDeals){
    $stateProvider.state('hotDeals', {
      parent: 'root',
      templateUrl: 'layouts/offers/offers.html',
      url: '/hot-deals/',
      controller: 'OffersCtrl'
    });
    if(Settings.newUrlStructure){
      $stateProvider.state('propertyHotDeals', {
        parent: 'root',
        templateUrl: 'layouts/offers/offers.html',
        url: '/locations/:regionSlug/:locationSlug/hotels/:propertySlug/hot-deals/:code',
        controller: 'OffersCtrl'
      });
    }
  }

  // Rewards page
  $stateProvider.state('rewards', {
    parent: 'root',
    templateUrl: 'layouts/rewards/rewards.html',
    url: '/rewards',
    controller: 'RewardsCtrl'
  })

  // Rewards page
  .state('prestige', {
    parent: 'root',
    templateUrl: 'layouts/prestige/prestige.html',
    url: '/prestige',
    controller: 'PrestigeCtrl'
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
    templateUrl: aboutLayout,
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

  // static content for now will be about content but without /about url
  .state('staticContent', {
    parent: 'root',
    templateUrl: 'layouts/staticContent/staticContent.html',
    url: '/:contentSlug/',
    controller: 'StaticContentCtrl'
  })

  // Profile page
  .state('profile', {
    parent: 'root',
    templateUrl: 'layouts/profile/profile.html',
    url: '/profile',
    controller: 'ProfileCtrl',
    data: {
      authProtected: true
    }
  })

  // Profile page
  .state('register', {
    parent: 'root',
    templateUrl: 'layouts/register/register.html',
    url: '/register',
    controller: 'RegisterCtrl'
  })

  // Reset password page
  .state('resetPassword', {
    parent: 'root',
    templateUrl: 'layouts/resetPassword/resetPassword.html',
    url: '/changePassword',
    controller: 'ResetPasswordCtrl'
  })

  // Upgrade room page
  // Page containing a controller that validates room upgrades before sending users to booking flow with upgrade.
  .state('upgradeRoom', {
    parent: 'root',
    url: '/upgrade/:upgradeGuid/:roomID',
    controller: 'RoomUpgradesCtrl'
  })

  // 404 page
  .state('unknown', {
    parent: 'root',
    templateUrl: 'layouts/404.html',
    url: '/404'
  })

  // Error page
  .state('error', {
    parent: 'root',
    templateUrl: 'layouts/error.html',
    url: '/error/'
  });

  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('unknown');
  });
})

.run(function(user, $rootScope, $state, breadcrumbsService, stateService, apiService, $window, $location, Settings, propertyService, track404sService, sessionDataService, infinitiApeironService, _) {

  $rootScope.$on('$stateChangeStart', function(event, next) {
    if(next.name === 'unknown'){ //If the page we are navigating to is not recognised
      if(Settings.API.track404s && Settings.API.track404s.enable) {  //This segment tracks any 404s and sends to our 404 tracking service
        var fromPath = null;
        if($location.search() && $location.search().fromDomain) {
          fromPath = $location.search().fromDomain;
        }
        track404sService.track($location.host(), $location.path(), fromPath ? fromPath : null);
      }
      //This variable is used to tell prerender.io that this page is a 404
      $rootScope.prerenderStatusCode = '404';
    } else if (next.parent === 'reservation' || next.name === 'reservationDetail' || next.name === 'reservations') {
      //Otherwise if page is recognised and the page is in the reservation flow or is /reservations, set the status code to 403
      $rootScope.prerenderStatusCode = '403';
    } else { //Otherwise set as 200 ok
      $rootScope.prerenderStatusCode = '200';
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $state.fromState = fromState;
    $state.fromParams = fromParams;
    breadcrumbsService.clear();

    $rootScope.requestId = sessionDataService.generateUUID();
    apiService.trackUsage($location.absUrl(), $rootScope.requestId);
    if(infinitiApeironService.isSinglePageApp){
      infinitiApeironService.trackPageView($location.path() + $window.location.search);
    }
  });
  //Facebook
  $rootScope.facebookAppId = Settings.UI.generics.facebookAppId;
  //Sentry
  if ($window.Raven && Settings.sentry.enable) {
    var env = document.querySelector('meta[name=environment]').getAttribute('content');
    Raven.config(Settings.sentry[env]).install();
  }

  if(Settings.inputValidationPattern)
  {
    $rootScope.generalValidationPattern = Settings.inputValidationPattern;
  }

  function encodeQueryData(data) {
    var ret = [];
    for (var d in data) {
      if (data.hasOwnProperty(d)) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }
    }
    return ret.join('&');
  }

  var userLang = user.getUserLanguage();
  var appLang = stateService.getAppLanguageCode();

  if (userLang && userLang !== appLang && Settings.UI.languages[userLang]) {
    var language_code = userLang;
    //Only make this change if the new language code isn't default
    if(Settings.UI.languages.default !== language_code){
      var path = $location.path();
      var search = encodeQueryData($location.search());
      var hash = $location.hash();
      $window.location.replace((language_code ? '/' + language_code : '') + path + (search ? '?' + search : '') + (hash ? '#' + hash : ''));
    }
  }

  //Set default language header
  var langObj = {};
  langObj['mobius-languagecode'] = appLang;
  apiService.setHeaders(langObj);

  //Set default currency header
  var currencyObj = {};
  currencyObj['mobius-currencycode'] = stateService.getCurrentCurrency().code;
  apiService.setHeaders(currencyObj);

  //localize moment.js
  $window.moment.locale(appLang);

  //Let's get property slug if single property and save it to settings for future use
  if (Settings.UI.generics.singleProperty && Settings.UI.generics.defaultPropertyCode) {
    if (!Settings.API.propertySlug) {
      propertyService.getAll().then(function(properties) {
        var singleProperty = _.find(properties, function(property){
          return property.code === Settings.UI.generics.defaultPropertyCode;
        });
        if(singleProperty && singleProperty.code){
          propertyService.getPropertyDetails(singleProperty.code).then(function(details) {
            var slug = details.meta.slug;
            Settings.API.propertySlug = slug;
            $rootScope.propertySlug = slug;
          });
        }
      });
    }
  }
})

.controller('BaseCtrl', function($scope, $timeout, $location, $rootScope, $controller, $state, $stateParams, stateService, scrollService, previousSearchesService, funnelRetentionService,
  metaInformationService, Settings, notificationService, propertyService, channelService, $window, breadcrumbsService, user, cookieFactory, apiService, CookieLawService, bookingService, _, DynamicMessages) {

  $controller('ReservationUpdateCtrl', {
    $scope: $scope
  });
  $controller('ReservationMultiRoomCtrl', {
    $scope: $scope
  });
  $controller('AuthCtrl', {
    $scope: $scope,
    config: {}
  });

  $scope.uiConfig = Settings.UI;
  $scope.menuOverlayEnabled = $scope.uiConfig.generics.header && $scope.uiConfig.generics.header.mainMenuAsOverlay;
  $scope.userLang = user.getUserLanguage();
  $scope.appLang = stateService.getAppLanguageCode();
  $scope.scrollService = scrollService;
  $scope.floatingBarMobileTopRight = Settings.UI.bookingWidget.mobileTopRight;

  //If menu overlay is enabled, add the event handlers to open and close the menu
  if($scope.menuOverlayEnabled){
    $scope.toggleMenuOverlay = function(){
      $timeout(function(){
        $('body').toggleClass('main-menu-active');
      }, 0);
    };

    $scope.hideMenuOverlay = function(){
      $timeout(function(){
        $('body').removeClass('main-menu-active');
      }, 0);
    };
  }

  $scope.$on('$stateChangeStart', function(e, toState, toParams) {

    //If date is in past, remove from params and reload page
    if(toParams.dates)
    {
      var dates = toParams.dates.split('_');

      if(dates.length){

        var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
        var fromDate = parseInt($window.moment.tz(dates[0],Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
        var toDate = parseInt($window.moment.tz(dates[1],Settings.UI.bookingWidget.timezone).startOf('day').valueOf());

        if(fromDate < today || toDate < today)
        {
          console.log('This date is in the past, removed from booking parameters');
          console.log('From Date: ' + dates[0]);
          console.log('To Date: ' + dates[1]);
          console.log('Today: ' + today);
          toParams.dates = undefined;
        }
      }
    }

    //Sandman specific HACK to intercept French if NOT on a quebec page
    if (Settings.sandmanFrenchOverride) {
      console.log('to name', toState.name);
      // @todo work out why we need to perform check and sometime dont get a name
      //If user language is french and URL does not contain quebec, switch back to english
      if (($scope.appLang === 'fr' || $scope.userLang === 'fr') && toParams.regionSlug !== 'quebec' && toState.name !== 'reservation') {
        if (toState.name && toState.name.indexof('reservation') === -1) {
          user.storeUserLanguage('en-us');
          var nonFrenchUrl = $state.href(toState.name, toParams, {reload: true}).replace('/fr/','/');
          $window.location.replace(nonFrenchUrl);
        }
      }
    }

    //if applyChainClassToBody, get property details and add its chain as body class for styling
    if (Settings.UI.generics.applyChainClassToBody) {
      var propertyCode = toParams.propertyCode || toParams.property || bookingService.getCodeFromSlug(toParams.propertySlug);
      if (propertyCode && (toState.name === 'hotel' || toState.name === 'hotelInfo' || toState.name === 'room' || toState.name === 'reservation' || toState.name === 'reservation.details' || toState.name === 'reservation.billing' || toState.name === 'reservation.confirmation') || toState.name === 'propertyHotDeals') {
        propertyService.getPropertyDetails(propertyCode).then(function(details) {
          propertyService.applyPropertyChainClass(details.chainCode);
          propertyService.applyPropertyClass(propertyCode);
        });
      } else {
        propertyService.removePropertyChainClass();
        propertyService.removePropertyClass();
      }
    }

    //breadcrumbs
    if (Settings.UI.viewsSettings.breadcrumbsBar.displayPropertyTitle && (toState.name === 'hotel' || toState.name === 'hotelInfo' || toState.name === 'room' || toState.name === 'propertyHotDeals')) {
      breadcrumbsService.isProperty(true);
    } else {
      breadcrumbsService.isProperty(false);
    }

    //if single property redirect home state to hotel page
    if (Settings.UI.generics.singleProperty &&
        Settings.UI.generics.defaultPropertyCode &&
        Settings.UI.generics.redirectSinglePropertyHome &&
        toState.name === 'home') {
      e.preventDefault();
      if (Settings.API.propertySlug) {
        $state.go('hotel', {
          propertySlug: Settings.API.propertySlug
        });
      } else {
        propertyService.getAll().then(function(properties) {
          var singleProperty = _.find(properties, function(property){
            return property.code === Settings.UI.generics.defaultPropertyCode;
          });
          propertyService.getPropertyDetails(singleProperty.code).then(function(details) {
            var slug = details.meta.slug;
            $state.go('hotel', {
              propertySlug: slug
            });
            Settings.API.propertySlug = slug;
            $rootScope.propertySlug = slug;
          });
        }, function() {
          $state.go('error');
        });
      }
    }
    if (Settings.authType === 'infiniti') {
      if ($window.infiniti && $window.infiniti.api) {
        $window.infiniti.api.trackPageLeave();
      }
    }
    metaInformationService.reset();

    $scope.user = user;
    $scope.isUserLoggedIn = $scope.auth.isLoggedIn;

    $rootScope.$on('MOBIUS_USER_LOGIN_EVENT', function(){
      $scope.isUserLoggedIn = $scope.auth.isLoggedIn;
      if($state.current.name === 'reservation.details')
      {
        $state.reload();
      }
    });

    //If menu overlay is enabled, close it before navigating to the next page.
    if($scope.menuOverlayEnabled){
      $scope.hideMenuOverlay();
    }

    $scope.isMobile = stateService.isMobile();

    if (Settings.UI.infoBar && Settings.UI.infoBar.showForSingleBookings) {
      //Get our dynamic translations
      var appLang = stateService.getAppLanguageCode();
      if(toState.name !== 'reservation.details' && toParams.adults && toParams.dates && !toParams.rooms && !stateService.isMobile()) {
        notificationService.show(
          '<div class="singleroom-notification">' +
          '<div class="details">' +
          '<p>' + toParams.adults + ' ' + DynamicMessages[appLang].adults + '</p>' +
          '<p>' + toParams.children + ' ' + DynamicMessages[appLang].children + '</p>' +
          '</div>' +
          '<div class="dates">' +
          '<p>' + getStartDate(toParams.dates) + '</p>' +
          '<p>' + getEndDate(toParams.dates) + '</p>' +
          '</div>' +
          '</div>'
        );
      }
    }

  });

  function getStartDate(dates) {
    return $window.moment(dates.substring(0, dates.indexOf('_'))).format(Settings.UI.generics.longDateFormat);
  }

  function getEndDate(dates) {
    return $window.moment(dates.substring(dates.indexOf('_') + 1, dates.length)).format(Settings.UI.generics.longDateFormat);
  }

  $scope.$on('$stateChangeSuccess', function() {
    //Sandman specific HACK to display french on quebec pages
    if (Settings.sandmanFrenchOverride) {

      //If current URL contains /locations/quebec show language options and display alert if not already shown
      if ($state.params && $state.params.regionSlug === 'quebec') {
        $rootScope.showLanguages = true;
        if (!cookieFactory('languageAlertDisplay')) {
          $timeout(function() {
            $scope.$broadcast('LANGUAGE_GROWL_ALERT');
            $window.document.cookie = 'languageAlertDisplay=true; path=/';
          }, 2000);
        }
      } else {
        $rootScope.showLanguages = false;
      }
    }
    else {
      $rootScope.showLanguages = true;
    }

    if (Settings.authType === 'infiniti') {
      if ($window.infiniti && $window.infiniti.api) {
        $timeout(function(){
          $window.infiniti.api.trackPageView();
        }, 1000);
      }
      //Evolution
      if ($window.evolution) {
        $window.evolution('track', 'pageview');
      }
    }

    //If on the allHotels page, store the search
    if($state.current.name === 'allHotels'){
      previousSearchesService.addSearch($state.current.name, $stateParams);
    }

    //Display our previous searches if not in reservation flow
    if($state.current.name !== 'reservation.details' && $state.current.name !== 'reservation.billing' && $state.current.name !== 'reservation.confirmation') {
      previousSearchesService.displaySearches();
    }

    $scope.hideFooter = false;

    //If on a reservations page and config says to hide footer, then hide footer
    if($state.current.parent === 'reservation' && $scope.uiConfig.reservations && $scope.uiConfig.reservations.hideFooter){
      $scope.hideFooter = true;
    }

    //If on a lookup page and config says to hide footer, then hide footer
    if($state.current.name === 'lookup' && $scope.uiConfig.lookUp && $scope.uiConfig.lookUp.hideFooter){
      $scope.hideFooter = true;
    }
  });

  if(funnelRetentionService.isFunnelRetentionActive()){
    funnelRetentionService.init($scope);

    funnelRetentionService.addExitHandler();

    $scope.retentionClick = function(){
      funnelRetentionService.retentionClickCheck();
    };

    $scope.$on('RETENTION_GROWL_ALERT_EMIT', function(event, retentionMessage) {
      $scope.$broadcast('RETENTION_GROWL_ALERT_BROADCAST', retentionMessage);
    });
  }

  //If EU cookie disclaimer enabled
  if(Settings.showEUCookieDisclaimer) {
    //Re-request the HTML so that we can intercept the page headers (this is the only way you can get page headers in js)
    var client = new XMLHttpRequest();
    client.open('GET', document.location, true);
    client.send();
    client.onreadystatechange = function() {
      if(this.readyState === this.HEADERS_RECEIVED) {
        var isEUHeader = client.getResponseHeader('CF-isEU');
        var isEU = isEUHeader === 'true' ? true : false;
        if(isEU){
          $scope.showEUCookieDisclaimer = true;
          $rootScope.euCookieDisclaimerVisible = !CookieLawService.isEnabled();

          if(cookieFactory('cookieDisclaimer')) {
            $scope.showEUCookieDisclaimer = false;
            $rootScope.euCookieDisclaimerVisible = false;
          }

          var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
          var heroSliderEl = $('#main-container > div > hero-slider');

          $scope.$on('cookieLaw.accept', function() {
            $rootScope.euCookieDisclaimerVisible = false;

            var cookieExpiryDate = null;
            if(Settings.UI.user.userPreferencesCookieExpiryDays && Settings.UI.user.userPreferencesCookieExpiryDays !== 0){
              cookieExpiryDate = new Date();
              cookieExpiryDate.setDate(cookieExpiryDate.getDate() + Settings.UI.user.userPreferencesCookieExpiryDays);
            }
            $window.document.cookie = 'cookieDisclaimer=true' + (!cookieExpiryDate ? '' : '; expires=' + cookieExpiryDate.toUTCString()) + '; path=/';

            //Re-position hero-slider after cookie law accepted on mobile
            if(stateService.isMobile()){
              $timeout(function(){
                repositionHeroSlider(heroSliderEl);
              },500);
            }
          });

          if($rootScope.euCookieDisclaimerVisible){
            if(stateService.isMobile()){
              $timeout(function(){
                repositionHeroSlider(heroSliderEl);
              },500);
            }
            $scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
              if(viewport.isMobile && $rootScope.euCookieDisclaimerVisible){
                repositionHeroSlider(heroSliderEl);
              }
              else {
                heroSliderEl.css('margin-top', '');
              }
            });
          }
        }
      }
    };
  }

  //Growl alerts for when a promoCode / corpCode / groupCode is prefilled
  if(Settings.UI.bookingWidget.prefillGrowlAlert){
    $scope.$on('CODE_ADDED_GROWL_ALERT_EMIT', function(event, type) {
      $scope.$broadcast('CODE_ADDED_GROWL_ALERT_BROADCAST', type);
    });
  }

  function repositionHeroSlider(heroSliderEl){
    var mainHeaderHeight = $('#main-header').height();
    heroSliderEl.css('margin-top', mainHeaderHeight);
  }
});


//IE11 Custom Event Polyfill
(function () {
  if ( typeof window.CustomEvent === 'function' ) {return false;}
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
