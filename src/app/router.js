/**
 * Configuration function for the main mobiusApp module
 *
 * This configures all the routes for ui-router plus a few global configs. Mobius web currently has
 * 2 versions of the applications URL structure and this can be chosen per tenant using the newUrlStructure flag.
 */
(function () {
  "use strict";

  angular
    .module('mobiusApp')
    .config(Router);

  function Router($stateProvider, $locationProvider, $urlRouterProvider, growlProvider, Settings) {
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
        params: {
          showActionButtons: false
        },
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
  }
}());
