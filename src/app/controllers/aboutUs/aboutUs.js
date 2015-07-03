'use strict';
/*
 * This module controlls reservations
 */
angular.module('mobius.controllers.about', [])

  .controller('AboutUsCtrl', function($scope, $controller, contentService, chainService,
         $state, $stateParams, _, Settings, modalService, breadcrumbsService) {

    $controller('MainCtrl', {$scope: $scope});

    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;

      breadcrumbsService.clear()
        .addBreadCrumb('About Us')
        .addBreadCrumb(chain.nameLong);
      $scope.openGallery = modalService.openGallery.bind(modalService,
        chain.images.map(function(image) {
          return image.uri;
        })
      );
    });

    $controller('MainCtrl', {$scope: $scope});

    var NUMBER_OF_RELEVANT_ABOUT_US = 3;

    var selectedAboutIndex;

    $scope.showDetail = $stateParams.code ? true : false;

    contentService.getAbout().then(function(response) {
      $scope.aboutList = _.sortBy(response, 'prio').reverse();
      if ($stateParams.code) {
        selectAbout($stateParams.code);
      }
    });

    $scope.getRelevant = function(about, index) {
      var offset = selectedAboutIndex < NUMBER_OF_RELEVANT_ABOUT_US ? 1 : 0;
      return selectedAboutIndex !== index && NUMBER_OF_RELEVANT_ABOUT_US + offset > parseInt(index, 10);
    };

    $scope.goToDetail = function(code) {
      $state.go('aboutUs', {code: code});
    };

    $scope.goToAboutList = function() {
      $state.go('aboutUs', {code: ''}, {reload: true});
    };

    function selectAbout(code) {
      selectedAboutIndex = _.findIndex($scope.aboutList, {code: code});
      if (selectedAboutIndex < 0) {
        return $state.go('aboutUs', {code: null});
      }
      $scope.selectedAbout = $scope.aboutList[selectedAboutIndex];
      breadcrumbsService.clear()
        .addBreadCrumb('About Us', 'aboutUs', {code: null})
        .addBreadCrumb($scope.selectedAbout.title);
    }
  });
