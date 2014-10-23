'use strict';

angular.module('mobius.controllers.main', [])

.controller( 'MainCtrl',  function($scope, $state, $modal,
    $log, $controller, orderByFilter, modalService, contentService, Settings) {

  // Application settings
  $scope.config = Settings.UI;

  $scope.$on('$stateChangeSuccess', function() {
    $scope.$state = $state;

    updateHeroContent();
  });

  function updateHeroContent(){
    $scope.heroContent = [];
    var stateName = $scope.$state.current.name;

    if(stateName === 'index.home'){
      loadHighlights();
      return;
    }

    // Images for the rest of the states will be taken
    // from the configuration.
    var heroContent = Settings.UI.heroContent[stateName];
    if(heroContent){
      $scope.heroContent = heroContent;
    }else{
      // Showing demo logo
      $scope.heroContent = [
        {
          'image': '/static/images/hero.jpg'
        }
      ];
    }
  }

  function loadHighlights(){
    // Getting content hights
    contentService.getHighlightedItems().then(function(data){
      var heroContent = [];

      for(var key in data){
        var group = data[key];
        for(var i=0; i<group.length; i++){
          var item = group[i];
          if(item.showOnHomepage && item.image){
            heroContent.push(item);
          }
        }
      }

      $scope.heroContent = orderByFilter(heroContent, '+order');
    });
  }

  $scope.openLoginDialog = function(){
    modalService.openLoginDialog();
  };

  $scope.openRegisterDialog = function(){
    var registerModal = $modal.open({
      templateUrl: 'layouts/modals/registerDialog.html',
      controller: 'ModalCtrl'
    });

    registerModal.result.then(function() {
      $log.info('Register dialog closed');
    }, function() {
      $log.info('Register dialog dismissed');
    });
  };

  $scope.openPasswordResetDialog = function(){
    modalService.openPasswordResetDialog();
  };

  $scope.openEnterCodeDialog = function(){
    var enterCodeModal = $modal.open({
      templateUrl: 'layouts/modals/enterCodeDialog',
      controller: 'ModalCtrl'
    });

    enterCodeModal.result.then(function(){
      $log.info('Enter Code dialog closed');
    }, function(){
      $log.info('Enter Code dialog dismissed');
    });
  };


  $scope.openAdvancedOptionsDialog = function() {

  };

});
