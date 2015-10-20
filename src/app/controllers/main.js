'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller', '_',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller, _) {

      var EVENT_VIEWPORT_RESIZE = 'viewport:resize';

      // Application settings
      $scope.config = Settings.UI;
      $scope.loyaltyProgramEnabled = Settings.authType === 'infiniti' ? true : false;

      $scope.$on('$stateChangeSuccess', function() {
        $scope.$state = $state;

        $scope.updateHeroContent();
      });

      var heroSliderData;
      $scope.updateHeroContent = function(data){
        if(data && data.length){
          $scope.heroContent = data;
          return;
        }

        if(heroSliderData) {
          $scope.heroContent = heroSliderData;
        }
        else {
          loadHighlights().then(function() {
            $scope.heroContent = heroSliderData;
          });
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

      if(Settings.authType === 'mobius'){
        user.loadProfile();
      }

      $scope.$on('USER_LOGIN_EVENT', function(){
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

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
