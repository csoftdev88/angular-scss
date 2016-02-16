'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller', '_', 'propertyService', '$stateParams', '$timeout', 'scrollService', 'metaInformationService','chainService', '$location',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller, _, propertyService, $stateParams, $timeout, scrollService, metaInformationService,chainService,$location) {

      try{

        chainService.getChain(Settings.API.chainCode).then(function (chain) {
          $scope.chain = chain;
          metaInformationService.setMetaDescription($scope.chain.meta.description);
          metaInformationService.setMetaKeywords($scope.chain.meta.keywords);
          metaInformationService.setPageTitle($scope.chain.meta.pagetitle);
          $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
          metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
        });

      } catch(err){

      }


      var EVENT_VIEWPORT_RESIZE = 'viewport:resize';

      // Application settings
      $scope.config = Settings.UI;
      $scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;

      $scope.$on('$stateChangeSuccess', function() {
        $scope.$state = $state;
        $scope.updateHeroContent();
      });

      //ScrollToTop btn
      $scope.scrollTopTrigger = 400;
      $scope.scrollToTop = function(){
        $timeout(function(){
          scrollService.scrollTo('top');
        }, 0);
      };

      var heroSliderData;
      $scope.updateHeroContent = function(data){
        if(data && data.length){
          $scope.heroContent = filterHeroContent(data);
          return;
        }

        //Hotel specific hero slider content is handled from within the controllers so don't update on stateChangeSuccess
        if(!$state.includes('hotel') && !$state.includes('propertyOffers') && !$state.includes('hotelInfo')){
          if(heroSliderData) {
            $scope.heroContent = filterHeroContent(heroSliderData);
          }
          else {
            loadHighlights().then(function() {
              $scope.heroContent = filterHeroContent(heroSliderData);
            });
          }
        }

        /* this is hidden in case they will decide keep hero slider only on some pages
        var stateName = $scope.$state.current.name;

        if (stateName === 'home') {
          loadHighlights();
          return;
        }

        // Images for the rest of the states will be taken
        // from the configuration.
        var heroContent = Settings.UI.heroStaticContent[stateName];
        if (heroContent) {
          $scope.heroContent = heroContent;
        } else {
          $scope.heroContent = Settings.UI.heroStaticContent['default'];
        }*/
      };

      var propertyCodes;
      var filteredOffers = [];
      function filterHeroContent(data){

        // Displaying the offers available on all the properties
        propertyService.getAll().then(function(properties){
          propertyCodes = _.pluck(properties, 'code');

          contentService.getOffers().then(function(offers) {

            if($stateParams.property){
              filteredOffers = _.filter(offers, function(offer){
                var availability = _.find(offer.offerAvailability, function(availability){
                  return availability.property === $stateParams.property;
                });
                return availability;
              });
            }
            else{
              filteredOffers = offers;
              /*
              _.each(offers, function(offer){

                if(offer.showAtChainLevel){
                  filteredOffers.push(offer);
                }
              });
              */
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
            
            $scope.heroContent = data;

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

      $scope.openCCVInfo = modalService.openCCVInfo;
      $scope.openPoliciesInfo = modalService.openPoliciesInfo;
      $scope.openTiersListDialog = function(e){
        e.preventDefault();
        e.stopPropagation();

        modalService.openTiersListDialog();
      };


      // TODO Seems like this function is used in roomDetails controller as well
      //$scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;

      $scope.user = user;
      $scope.isUserLoggedIn = user.isLoggedIn;

      //this should be no longer needed as we don't storae user token to localStorage anymore (double check)
      /*
      if(Settings.authType === 'mobius'){
        user.loadProfile();
      }
      */

      $scope.$on('MOBIUS_USER_LOGIN_EVENT', function(){
        $scope.isUserLoggedIn = user.isLoggedIn;
      });

      modalService.openDialogIfPresent();


      //Login dialog
      $scope.loginFormStep = 1;
      contentService.getTitles().then(function(data) {
        $scope.registerTitles = data;
      });
      contentService.getContactMethods().then(function(data) {
        $scope.registerContacts = data;
      });
      
      $scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
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

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
