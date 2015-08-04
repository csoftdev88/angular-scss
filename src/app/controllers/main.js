'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller', '_',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller, _) {

      // Application settings
      $scope.config = Settings.UI;

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

      // TODO Seems like this function is used in roomDetails controller as well
      //$scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;

      $scope.user = user;
      $scope.isUserLoggedIn = user.isLoggedIn;

      modalService.openDialogIfPresent();

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
