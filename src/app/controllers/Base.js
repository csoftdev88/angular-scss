/**
 * Base controller that each angular controller will inherit
 */
(function () {
  "use strict";
  angular
    .module('mobiusApp')
    .controller('BaseCtrl', BaseCtrl);

  function BaseCtrl($scope, $timeout, $location, $rootScope, $controller, $state, $stateParams, stateService,
                    scrollService, previousSearchesService, funnelRetentionService, metaInformationService, Settings,
                    notificationService, propertyService, channelService, $window, breadcrumbsService, user,
                    cookieFactory, apiService, CookieLawService, bookingService, _, DynamicMessages) {

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
  }
}());
