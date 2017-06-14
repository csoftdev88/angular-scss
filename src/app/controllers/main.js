'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService', '$window',
    'contentService', 'Settings', 'user', '$controller', '_', 'propertyService', '$stateParams', '$timeout', 'scrollService',
    'metaInformationService','chainService', '$location', 'stateService', '$rootScope', 'cookieFactory', 'campaignsService',
    'locationService', 'bookingService', 'apiService', 'userObject',
    function($scope, $state, $modal, orderByFilter, modalService, $window, contentService, Settings, user, $controller,
             _, propertyService, $stateParams, $timeout, scrollService, metaInformationService,chainService,$location,
             stateService,$rootScope, cookieFactory, campaignsService, locationService, bookingService, apiService, userObject) {
      var activeThirdParty;
      $scope.chainCode = Settings.API.chainCode;

      try{

        chainService.getChain($scope.chainCode).then(function (chain) {
          $scope.chain = chain;
          if($scope.chain && $scope.chain.meta){
            metaInformationService.setMetaDescription($scope.chain.meta.description);
            metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
            metaInformationService.setPageTitle($scope.chain.meta.pagetitle);
            $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
            metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
          }
        });

      } catch(err){

      }

      contentService.getTitles().then(function(data) {
        $scope.registerTitles = data;
      });

      contentService.getContactMethods().then(function(data) {
        $scope.registerContacts = data;
      });

      contentService.getCountries().then(function(data) {
        $scope.registerCountries = data;
      });

      // @todo move this into registerService and refactor register controller
      $scope.register = function(form, registerData){
        $scope.clearErrorMsg();
        $scope.submitted = true;
        if (form.$valid) {
          if (registerData.localeId && angular.isDefined($scope.registerCountries)) {
            var selectedCountry = contentService.getCountryByID(registerData.localeId, $scope.registerCountries);
            registerData.localeCode = selectedCountry && selectedCountry.code;
          }
          apiService.post(apiService.getFullURL('customers.register'), registerData).then(function(response){
            userObject.id = response.id;
            user.loadProfile();
            $state.go('home');
          }, function(err){
            if(err.error.msg === 'User already registered'){
              $scope.userRegisteredError = true;
              $scope.error = true;
            }
            else{
              $scope.genericError = true;
              $scope.error = true;
            }
          });
        }
        else{
          $scope.missingFieldsError = true;
          $scope.error = true;
        }
      };

      $scope.clearErrorMsg = function () {
        $scope.loginDialogError = false;
        $scope.missingFieldsError = false;
        $scope.incorrectEmailPasswordError = false;
        $scope.notRegisteredEmailError = false;
        $scope.passwordResetSuccess = false;
        $scope.error = false;
        $scope.userRegisteredError = false;
        $scope.genericError = false;
        $scope.missingFieldsError = false;
        $scope.submitted = false;
      };

      var EVENT_VIEWPORT_RESIZE = 'viewport:resize';

      // Application settings
      $scope.config = Settings.UI;
      $scope.uiConfig = Settings.UI;
      $scope.loyaltyProgramEnabled = Settings.loyaltyProgramEnabled;

      $rootScope.showRegisterDialog = false;
      $scope.registerFormFilledEmail = false;

      $scope.$on('$stateChangeSuccess', function() {
        $scope.$state = $state;
        $scope.updateHeroContent();
        if($state.current.name === 'home')
        {
          $timeout(function(){
            scrollService.scrollTo('top');
          }, 0);
        }
      });

      //ScrollToTop btn
      $scope.scrollTopTrigger = 400;
      $scope.scrollToTop = function(){
        $timeout(function(){
          scrollService.scrollTo('top');
        }, 0);
      };

      var heroSliderData;
      $scope.updateHeroContent = function(data, forceDefault) {
        if ($rootScope.thirdparty) {
          $rootScope.heroContent = $rootScope.thirdparty.heroContent;
          return;
        }

        if(data && data.length){
          $rootScope.heroContent = filterHeroContent(data);
          return;
        }

        //Hotel specific hero slider content is handled from within the controllers so don't update on stateChangeSuccess
        if((!$state.includes('hotel') && !$state.includes('propertyOffers') && !$state.includes('propertyHotDeals') && !$state.includes('hotelInfo') && !$state.includes('locationInfo') && !($state.includes('hotels') && $state.params.locationSlug) && !(($state.includes('offers') || $state.includes('propertyOffers') || $state.includes('hotDeals') || $state.includes('propertyHotDeals')) && Settings.UI.offers.displayOfferImageInHeroSlider) && !($state.includes('regions') && $state.params.regionSlug) && !$state.includes('staticContent') && !$state.includes('aboutUs')) || forceDefault){
          if(heroSliderData) {
            $rootScope.heroContent = filterHeroContent(heroSliderData);
          }
          else {
            loadHighlights().then(function() {
              $rootScope.heroContent = filterHeroContent(heroSliderData);
            });
          }
        }

      };

      var propertyCodes;
      var filteredOffers = [];
      function filterHeroContent(data){

        // Displaying the offers available on all the properties
        propertyService.getAll().then(function(properties){
          propertyCodes = _.pluck(properties, 'code');

          contentService.getOffers().then(function(offers) {
            var propertySlug = bookingService.getParams().propertySlug;
            var propertyCode = null;
            if(propertySlug) {
              propertyCode = bookingService.getCodeFromSlug(propertySlug);
            }
            if(propertyCode && !Settings.UI.generics.singleProperty){
              filteredOffers = _.filter(offers, function(offer){
                var availability = _.find(offer.offerAvailability, function(availability){
                  return availability.property === propertyCode;
                });
                return availability;
              });
            }
            else{
              filteredOffers = offers;
            }

            filteredOffers = _.pluck(filteredOffers, 'code');

            data = _.filter(data, function(item){

              if(item.link){

                //offers adverts now have a CHAIN or PROPERTY CODE flag
                var linkCode = item.link.type === 'offers' ? item.link.code.split('-')[0] : item.link.code;

                return _.contains(filteredOffers, linkCode) || item.link.type !== 'offers';
              }
              else{
                return item;
              }

            });
            return data;
            //$rootScope.heroContent = data;

          });

        });

        return data;

      }

      function loadHighlights() {
        return contentService.getAdverts({bannerSize: Settings.UI.adverts.heroAdverts}).then(
          function (response) {
            heroSliderData = _.reduce(response, function(object, advert){
              if(!_.isEmpty(advert.images)) {
                var imageObject = advert.images[0];
                imageObject.link = advert.link;
                imageObject.title = advert.strapline;
                imageObject.subtitle = advert.subtitle;

                object.push(imageObject);
              }
              return object;
            }, []);
          }
        );
      }

      $scope.openBookingBar = function () {
        if (Settings.engine === 'loyalty') {
          angular.element('floating-bar').css('display', 'block');
        }
        $rootScope.$broadcast('BOOKING_BAR_OPEN_SRB_TAB');
      };

      $scope.openCCVInfo = modalService.openCCVInfo;
      $scope.openPoliciesInfo = modalService.openPoliciesInfo;
      $scope.openTiersListDialog = function(e){
        e.preventDefault();
        e.stopPropagation();

        modalService.openTiersListDialog();
      };

      modalService.openDialogIfPresent();


      //Login dialog
      $scope.loginFormStep = 1;
      contentService.getTitles().then(function(data) {
        $scope.registerTitles = data;
      });
      contentService.getContactMethods().then(function(data) {
        $scope.registerContacts = data;
      });


      $scope.isMobile = stateService.isMobile();
      $scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
        $scope.isMobile = viewport.isMobile;
        if(viewport.isMobile){
          $('.login-dialog-overlay').appendTo($('#main-header-inner'));
        }
        else{
          $('.login-dialog-overlay').appendTo($('.main-nav'));
        }
      });

      $scope.openMobileMenu = function(){
        $timeout(function(){
          document.body.classList.add('mobile-menu-active');
        }, 500);
      };

      //Footer
      $scope.footerConfig = Settings.UI.footer;

      activeThirdParty = cookieFactory('ActiveThirdParty');
      if (!_.isEmpty(activeThirdParty)) {
        $rootScope.thirdparty = JSON.parse(activeThirdParty);
        if($rootScope.thirdparty.code){
          $stateParams[$rootScope.thirdparty.code.type] = $rootScope.thirdparty.code.value;
        }
      }

      //check if user is logged in and then get campaigns
      function onAuthorized(){
        if(Settings.UI.campaigns && Settings.UI.campaigns.display){
          var loggedIn = $scope.auth.isLoggedIn();
          if(!$rootScope.thirdparty && _.isEmpty(activeThirdParty)){
            locationService.getLocations().then(function(locations){
              campaignsService.setCampaigns($scope.auth, loggedIn, locations);
            });
          }
        }
      }

      // Inheriting the following controllers
      $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
