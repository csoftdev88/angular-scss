'use strict';

angular.module('mobius.controllers.main', ['mobiusApp.services.offers'])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService', '$window',
    'contentService', 'Settings', 'user', '$controller', '_', 'propertyService', '$stateParams', '$timeout', 'scrollService',
    'metaInformationService','chainService', '$location', 'stateService', '$rootScope', 'cookieFactory', 'campaignsService',
    'locationService', 'bookingService', 'apiService', 'userObject', 'offers', 'DynamicMessages',
    function($scope, $state, $modal, orderByFilter, modalService, $window, contentService, Settings, user, $controller,
             _, propertyService, $stateParams, $timeout, scrollService, metaInformationService,chainService,$location,
             stateService,$rootScope, cookieFactory, campaignsService, locationService, bookingService, apiService,
             userObject, offers, DynamicMessages) {
      var activeThirdParty;
      $scope.chainCode = Settings.API.chainCode;
      $scope.regionConfig = Settings.UI.regions;

      var appLang = stateService.getAppLanguageCode();
      var dynamicMessages = appLang && DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang] : null;

      try {
        chainService.getChain($scope.chainCode).then(function (chain) {
          $scope.chain = chain;
          if ($scope.chain && $scope.chain.meta) {
            metaInformationService.setMetaDescription($scope.chain.meta.description);
            metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
            metaInformationService.setPageTitle($scope.chain.meta.pagetitle);
            $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
            metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
          }
        });
      } catch (err) {
        // FIXME: should we not do something on error here?
      }

      $scope.hotelViewSettings = Settings.UI.viewsSettings.hotelDetails;
      var singlePropertyCode = Settings.UI.generics.singleProperty && Settings.UI.generics.defaultPropertyCode;

      if (singlePropertyCode) {
        propertyService.getPropertyDetails(singlePropertyCode, {includes: 'amenities'})
          .then(function (details) {
            // FIXME: polluting the main scope with this feels wrong
            $scope.details = details;
            if (details.amenities) {
              $scope.filteredAmenities = propertyService.sanitizeAmenities(details.amenities); //Process our amenities and add to scope.
            }
          });
      }

      $scope.amenitiesSection = {
        show: false
      };

      contentService.getTitles().then(function(data) {
        $scope.registerTitles = data;
      });

      contentService.getContactMethods().then(function(data) {
        $scope.registerContacts = data;
      });

      contentService.getCountries().then(function(data) {
        $scope.registerCountries = data;
      });

      // TODO: move this into a new registerService and refactor register controller
      $scope.register = function(form, registerData) {
        $scope.clearErrorMsg();
        $scope.submitted = true;
        if (form.$valid) {
          if (registerData.localeId && angular.isDefined($scope.registerCountries)) {
            var selectedCountry = contentService.getCountryByID(registerData.localeId, $scope.registerCountries);
            registerData.localeCode = selectedCountry && selectedCountry.code;
          }
          registerData.external = true;
          apiService.post(apiService.getFullURL('customers.register'), registerData).then(function(response){
            userObject.id = response.id;
            user.loadProfile();
            $rootScope.showRegisterDialog = false;
            $state.reload();
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

      /**
       * Gate pressing Next on the register form
       * if the first part of the form is not valid.
       * Because of the confused scope hierarchy we need to pass-in
       * the stepsModel from the child scope.
       * */
      $scope.gatedRegisterNext = function(registerForm, formData) {
        registerForm.$setDirty();
        var requiredStep1 = [
          'registerEmail',
          'registerEmailConfirm',
          'registerPassword',
          'registerPasswordConfirm'
        ];
        var requiredStep2 = [
          'registerTitle',
          'registerFname',
          'registerLname',
          'country'
        ];
        var allOkay = true;

        var requiredFields = $scope.registerFormSteps.filledEmail ? requiredStep2 : requiredStep1;
        var otherFields = $scope.registerFormSteps.filledEmail ? requiredStep1 : requiredStep2;

        var i, fieldName;
        for (i = 0; i < requiredFields.length; i++) {
          fieldName = requiredFields[i];
          registerForm[fieldName].$setDirty();
          registerForm[fieldName].$setTouched();
          if (!registerForm[fieldName].$valid) {
            allOkay = false;
          }
        }
        for (i = 0; i < otherFields.length; i++) {
          fieldName = otherFields[i];
          registerForm[fieldName].$setPristine();
          registerForm[fieldName].$setUntouched();
        }
        if (allOkay) {
          if (!$scope.registerFormSteps.filledEmail) {
            $scope.registerFormSteps.filledEmail = true;
            // Trick to set the search placeholder inside the chosen drop-down
            angular
              .element('.chosen-container-single .chosen-search input')
              .attr('placeholder', 'Search countries');
            return;
          }
          $scope.register(registerForm, formData);
        }
      };

      /**
       * Return the most appropriate error message based on the state of the form
       * */
      $scope.getRegisterValidationMessage = function(registerForm) {
        if (!registerForm) {
          return;
        }
        var errorProperties = [
          '$touched',
          '$dirty',
          '$invalid'
        ];

        // Check if all conditions to show an error message are met for a named field
        function showFieldError(fieldName) {
          for (var i = 0; i < errorProperties.length; i++) {
            var prop = errorProperties[i];
            if (!registerForm[fieldName][prop]) {
              return false;
            }
          }
          return true;
        }

        // Grab message from the dynamicMessages service
        function getTranslatedMessage(key) {
          return dynamicMessages && dynamicMessages[key] ? dynamicMessages[key] : '';
        }

        var field2ErrStep1 = {
          registerEmail: 'invalid_email_message',
          registerEmailConfirm: 'email_match_error_message',
          registerPassword: 'password_pattern_error',
          registerPasswordConfirm: 'password_match_error_message'
        };

        var field2ErrStep2 = {
          registerTitle: 'missing_title',
          registerFname: 'missing_fname',
          registerLname: 'missing_lname',
          country: 'missing_country'
        };

        var fieldToErrorMessage = $scope.registerFormSteps.filledEmail ? field2ErrStep2 : field2ErrStep1;
        for (var field in fieldToErrorMessage) {
          if (!fieldToErrorMessage.hasOwnProperty(field)) { continue; }
          if (showFieldError(field)) {
            return getTranslatedMessage(fieldToErrorMessage[field]);
          }
        }
        return '';
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
      $scope.registerFormSteps = {
        filledEmail: false
      };
      $scope.registerData = {};
      if (Settings.UI.registerPage.defaultOptInNewsletter) {
        $scope.registerData.optedIn = true;
      }

      $scope.userObject = userObject;

      $scope.$on('$stateChangeSuccess', function () {
        $scope.$state = $state;
        $scope.updateHeroContent();
        if ($state.current.name === 'home') {
          $timeout(function () {
            scrollService.scrollTo('top');
          }, 0);
        }
      });

      // ScrollToTop btn
      $scope.scrollTopTrigger = 400;
      $scope.scrollToTop = function(){
        $timeout(function(){
          scrollService.scrollTo('top');
          if ($scope.loyaltyEngine) {
            $rootScope.$broadcast('OPEN_DATE_PICKER');
          }
        }, 0);
      };

      var heroSliderData;
      $scope.updateHeroContent = function(data, forceDefault) {
        if (Settings.forceCustomHeroContent === true && Settings.customHeroContent) {
          $rootScope.heroContent = Settings.customHeroContent;
          $rootScope.previewImages = Settings.customPreviewImages;
          return;
        }
        if ($rootScope.thirdparty) {
          $rootScope.heroContent = $rootScope.thirdparty.heroContent;
          return;
        }

        if (data && data.length) {
          $rootScope.heroContent = filterHeroContent(data);
          return;
        }

        // Hotel specific hero slider content is handled from within the controllers so don't update on stateChangeSuccess
        if ((!$state.includes('hotel') &&
            !$state.includes('propertyOffers') &&
            !$state.includes('propertyHotDeals') &&
            !$state.includes('hotelInfo') &&
            !$state.includes('locationInfo') &&
            !($state.includes('hotels') && $state.params.locationSlug) &&
            !(($state.includes('offers') ||
              $state.includes('propertyOffers') ||
              $state.includes('hotDeals') ||
              $state.includes('propertyHotDeals')) &&
              Settings.UI.offers.displayOfferImageInHeroSlider) &&
            !($state.includes('regions') &&
              $state.params.regionSlug) &&
            !$state.includes('staticContent') &&
            !$state.includes('aboutUs')) || forceDefault) {
          if (heroSliderData) {
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
      function filterHeroContent(data) {

        // Displaying the offers available on all the properties
        propertyService.getAll().then(function(properties) {
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

            data = _.filter(data, function(item) {
              if (item.link) {

                //offers adverts now have a CHAIN or PROPERTY CODE flag
                var linkCode = item.link.type === 'offers' ? item.link.code.split('-')[0] : item.link.code;

                return _.contains(filteredOffers, linkCode) || item.link.type !== 'offers';
              } else {
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
        if ($scope.loyaltyEngine) {
          angular.element('floating-bar').removeClass('hide').css('display', 'block');
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

      user.loadRewards(userObject.id)
        .then(function (rewards) {
          $scope.rewards = rewards;
          console.log('rewards', rewards);
        })
        .catch(function (err) {
          console.error(err);
        });

      //check if user is logged in and then get campaigns
      function onAuthorized(){
        if(Settings.UI.campaigns && Settings.UI.campaigns.display){
          var loggedIn = $scope.auth && $scope.auth.isLoggedIn();
          if(!$rootScope.thirdparty && _.isEmpty(activeThirdParty)){
            locationService.getLocations().then(function(locations){
              campaignsService.setCampaigns($scope.auth, loggedIn, locations);
            });
          }
        }
      }

      if ($scope.uiConfig.homePage && $scope.config.homePage.showOffer) {
        offers.getAvailableFeatured(1)
          .then(function (offers) {
            $scope.offers = offers;
            console.log('offers', offers);
          });

        $scope.gotoOffer = function (offer) {
          $state.go('offers', { code: offer.meta.slug });
        };
      }

      // For certain tenants (e.g. MeAndAll), we need to remap certain characters
      var germanCharactersMap = {
        'ä': 'ae',
        'Ä': 'AE',
        'ü': 'ue',
        'Ü': 'UE',
        'ö': 'oe',
        'Ö': 'OE',
        'ß': 'ss',
        'ẞ': 'SS'
      };
      $scope.remapGermanCharacters = function(registerData, key) {
        if (!registerData[key]) {
          return;
        }
        for (var char in germanCharactersMap) {
          registerData[key] = registerData[key].replace(new RegExp(char, 'g'), germanCharactersMap[char]);
        }
      };

      // Inheriting the following controllers
      $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
