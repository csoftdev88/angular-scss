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

    'mobius.controllers.modals.generic',
    'mobius.controllers.modals.data',
    'mobius.controllers.modals.policy',
    'mobius.controllers.modals.loyalties.badges',
    'mobius.controllers.modals.addonDetail',
    'mobius.controllers.modals.locationDetail',
    'mobius.controllers.modals.confirmation',
    'mobius.controllers.common.cardExpiration',
    'mobius.controllers.modals.upsells',

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
    'mobiusApp.directives.scrollPosition',
    'mobiusApp.directives.stickable',
    'mobiusApp.directives.hoverTrigger',
    'mobiusApp.directives.scrollToTop',
    'mobiusApp.directives.growlAlerts',

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
    'mobiusApp.filters.trustAsHtml'
  ])

.config(function($stateProvider, $locationProvider, $urlRouterProvider, growlProvider, Settings) {
  // Using this settings allows to run current
  // SPA without # in the URL
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  //Global config for growl messages
  growlProvider.globalTimeToLive(30000);
  growlProvider.onlyUniqueMessages(false);
  growlProvider.globalPosition('top-center');
  //growlProvider.globalReversedOrder(true);

  $stateProvider
  // Default application layout
    .state('root', {
    abstract: true,
    templateUrl: 'layouts/index.html',
    controller: 'MainCtrl',
    // NOTE: These params are used by booking widget
    // Can be placed into induvidual state later if needed
    url: '?property&location&region&adults&children&dates&rate&rooms&room&promoCode&corpCode&groupCode&voucher&reservation&fromSearch&email&scrollTo&viewAllRates&resetcode&ch&meta'
  })

  // Home page
  .state('home', {
    parent: 'root',
    templateUrl: 'layouts/home/home.html',
    url: '/'
  })

  // Hotels
  .state('allHotels', {
    parent: 'root',
    templateUrl: 'layouts/hotels/hotels.html',
    url: '/hotels'
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
  })

  .state('hotDeals', {
    parent: 'root',
    templateUrl: 'layouts/offers/offers.html',
    url: '/:regionSlug/:locationSlug/hot-deals/:code',
    controller: 'OffersCtrl',
    params: {
      locationSlug: {
        value: null,
        squash: true
      },
      regionSlug: {
        value: null,
        squash: true
      }
    }
  })

  .state('propertyHotDeals', {
    parent: 'root',
    templateUrl: 'layouts/offers/offers.html',
    url: '/locations/:regionSlug/:locationSlug/hotels/:propertySlug/hot-deals/:code',
    controller: 'OffersCtrl'
  })

  // Rewards page
  .state('rewards', {
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

.run(function(user, $rootScope, $state, breadcrumbsService, stateService, apiService, $window, $location, Settings, propertyService, track404sService, sessionDataService) {

  $rootScope.$on('$stateChangeStart', function(event, next) {
    //This segment tracks any 404s and sends to our 404 tracking service
    if(Settings.API.track404s && Settings.API.track404s.enable && next.name === 'unknown')
    {
      var fromPath = null;
      if($location.search() && $location.search().fromDomain){
        fromPath = $location.search().fromDomain;
      }
      track404sService.track($location.host(), $location.path(), fromPath ? fromPath : null);
    }
    $rootScope.prerenderStatusCode = next.name === 'unknown' ? '404' : '200';
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $state.fromState = fromState;
    $state.fromParams = fromParams;
    breadcrumbsService.clear();

    $rootScope.requestId = sessionDataService.generateUUID();
    apiService.trackUsage($location.absUrl(), $rootScope.requestId);
    console.log($rootScope.requestId);
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
    var path = $location.path();
    var search = encodeQueryData($location.search());
    var hash = $location.hash();
    $window.location.replace((language_code ? '/' + language_code : '') + path + (search ? '?' + search : '') + (hash ? '#' + hash : ''));
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

  $rootScope.$on('$stateChangeSuccess', function() {
    breadcrumbsService.clear();
  });

  //Let's get property slug if single property and save it to settings for future use
  if (Settings.UI.generics.singleProperty) {
    if (!Settings.API.propertySlug) {
      propertyService.getAll().then(function(properties) {
        var code = properties[0].code;
        propertyService.getPropertyDetails(code).then(function(details) {
          var slug = details.meta.slug;
          Settings.API.propertySlug = slug;
          $rootScope.propertySlug = slug;
        });
      });
    }
  }
})

.controller('BaseCtrl', function($scope, $timeout, $location, $rootScope, $controller, $state, stateService, scrollService,
  metaInformationService, Settings, propertyService, channelService, $window, breadcrumbsService, user, cookieFactory) {

  $controller('ReservationUpdateCtrl', {
    $scope: $scope
  });
  $controller('SSOCtrl', {
    $scope: $scope
  });
  $controller('ReservationMultiRoomCtrl', {
    $scope: $scope
  });

  $scope.$on('$stateChangeStart', function(e, toState, toParams) {

    //If date is in past, remove from params and reload page
    if(toParams.dates)
    {
      var dates = toParams.dates.split('_');

      if(dates.length){

        var today = parseInt($window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').valueOf());
        var fromDate = parseInt($window.moment(dates[0]).valueOf());
        var toDate = parseInt($window.moment(dates[1]).valueOf());

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

      var userLang = user.getUserLanguage();
      var appLang = stateService.getAppLanguageCode();

      //If user language is french and URL does not contain quebec, switch back to english
      if ((appLang === 'fr' || userLang === 'fr') && toParams.regionSlug !== 'quebec') {
        user.storeUserLanguage('en-us');
        var nonFrenchUrl = $state.href(toState.name, toParams, {reload: true}).replace('/fr/','/');
        $window.location.replace(nonFrenchUrl);
      }
    }

    //if applyChainClassToBody, get property details and add its chain as body class for styling
    if (Settings.UI.generics.applyChainClassToBody) {
      var propertyCode = toParams.propertyCode || toParams.property;
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
    if (Settings.UI.generics.singleProperty && toState.name === 'home') {
      e.preventDefault();
      if (Settings.API.propertySlug) {
        $state.go('hotel', {
          propertySlug: Settings.API.propertySlug
        });
      } else {
        propertyService.getAll().then(function(properties) {
          var code = properties[0].code;
          propertyService.getPropertyDetails(code).then(function(details) {
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
      $scope.sso.trackPageLeave();
    }
    metaInformationService.reset();


  });

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
      $scope.sso.trackPageView();
      //Evolution
      if ($window.evolution) {
        $window.evolution('track', 'pageview');
      }
    }
  });
});
