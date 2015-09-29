'use strict';

angular.module('mobius.controllers.main', [])

  // TODO: add ng-min into a build step
  .controller('MainCtrl', ['$scope', '$state', '$modal', 'orderByFilter', 'modalService',
    'contentService', 'Settings', 'user', '$controller', '_', 'propertyService', '$stateParams',
    function($scope, $state, $modal, orderByFilter, modalService,
      contentService, Settings, user, $controller, _, propertyService, $stateParams) {

      // Application settings
      $scope.config = Settings.UI;
      $scope.loyaltyProgramEnabled = $scope.config.generics.loyaltyProgramEnabled;

      $scope.$on('$stateChangeSuccess', function() {
        $scope.$state = $state;

        $scope.updateHeroContent();
      });

      var heroSliderData;
      $scope.updateHeroContent = function(data){
        if(data && data.length){
          $scope.heroContent = filterHeroContent(data);
          return;
        }

        if(heroSliderData) {
          $scope.heroContent = filterHeroContent(heroSliderData);
        }
        else {
          loadHighlights().then(function() {
            $scope.heroContent = filterHeroContent(heroSliderData);
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

      var propertyCodes;
      var filteredOffers = [];
      function filterHeroContent(data){

        // Displaying the offers available on all the properties
        propertyService.getAll().then(function(properties){
          propertyCodes = _.pluck(properties, 'code');

          contentService.getOffers().then(function(offers) {

            if($stateParams.property){
              filteredOffers = _.filter(offers, function(offer){
                return _.contains(offer.limitToPropertyCodes, $stateParams.property) || !offer.limitToPropertyCodes.length;
              });
            }
            else{
              _.each(offers, function(offer){
                if(offer.limitToPropertyCodes && offer.limitToPropertyCodes.length === propertyCodes.length){
                  filteredOffers.push(offer);
                }
              });
            }

            filteredOffers = _.pluck(filteredOffers, 'code');

            data = _.filter(data, function(item){
              if(item.link){
                return _.contains(filteredOffers, item.link.code) || item.link.type !== 'offers';
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

      modalService.openDialogIfPresent();

      // Inheriting the following controllers
      $controller('PreloaderCtrl', {$scope: $scope});
      $controller('SanitizeCtrl', {$scope: $scope});
    }]);
