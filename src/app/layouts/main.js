'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller) {

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
        var heroContent = Settings.UI.heroContent[stateName];
        if (heroContent) {
          $scope.heroContent = heroContent;
        } else {
          // Showing demo logo
          $scope.heroContent = [
            {
              'image': '/static/images/hero.jpg'
            }
          ];
        }
      };

      function loadHighlights() {
        // Getting content hights
        contentService.getHighlightedItems().then(function(data) {
          var heroContent = [];

          for (var key in data) {
            var group = data[key];
            for (var i = 0; i < group.length; i++) {
              var item = group[i];
              if (item.showOnHomepage && item.image) {
                heroContent.push(item);
              }
            }
          }

          $scope.heroContent = orderByFilter(heroContent, '+order');
        });
      }

      $scope.openLoginDialog = modalService.openLoginDialog;
      $scope.openPasswordResetDialog = modalService.openPasswordResetDialog;
      $scope.openEnterCodeDialog = modalService.openEnterCodeDialog;

      $scope.openCCVInfo = modalService.openCCVInfo;
      $scope.openPoliciesInfo = modalService.openPoliciesInfo;
      $scope.openPriceBreakdownInfo = modalService.openPriceBreakdownInfo;

      $scope.user = user;
      $scope.isUserLoggedIn = user.isLoggedIn;
      $scope.loyalties = user;

      modalService.openDialogIfPresent();

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
