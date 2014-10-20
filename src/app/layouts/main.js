'use strict';

angular.module('mobius.controllers.main', [])

.controller( 'MainCtrl',  function($scope, $state, orderByFilter, contentService, Settings) {
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
});
