'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller', '$filter',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller, $filter) {

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

      $scope.toPoints = function(price) {
        var user = $scope.user.getUser();
        if (user && user.loyalties) {
          return $filter('i18nNumber')(price * user.loyalties.cashToPoints, 2);
        }
      };

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
