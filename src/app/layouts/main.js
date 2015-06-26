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

      $scope.updateHeroContent = function(data){
        if(data && data.length){
          $scope.heroContent = data;
          return;
        }

        $scope.heroContent = [];
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
        }
      };

      function loadHighlights() {
        contentService.getAdverts({bannerSize: Settings.UI.adverts.randomMainPageAdvertSize}).then(
          function (response) {
            $scope.heroContent = _.reduce(response, function(object, advert){
              if(!_.isEmpty(advert.images)) {
                var imageObject = advert.images[0];
                imageObject.link = advert.link;
                object.push(imageObject);
              }
              return object;
            }, []);
          }
        );
      }

      $scope.openCCVInfo = modalService.openCCVInfo;
      $scope.openPoliciesInfo = modalService.openPoliciesInfo;
      $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;
      $scope.openLoginDialog = function() {
        angular.element('#loginButton')[0].click(); // need to use DOM event
      };

      $scope.user = user;
      $scope.isUserLoggedIn = user.isLoggedIn;

      modalService.openDialogIfPresent();

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
