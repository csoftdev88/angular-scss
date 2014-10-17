'use strict';

angular.module('mobius.controllers.main', [])

.controller( 'MainCtrl',  function($scope, $state, orderByFilter, contentService, Settings) {
  // Application settings
  $scope.config = Settings.UI;

  $scope.$on('$stateChangeSuccess', function() {
    $scope.$state = $state;
  });

  $scope.heroContent = [];

  // Getting content hights
  contentService.getHighlightedItems().then(function(data){
    var heroContent = [];

    for(var key in data){
      var group = data[key];
      for(var i=0; i<group.length; i++){
        var item = group[i];
        if(key){
          // NOTE: updating the images manualy since server doesnt have proper images
          // TODO: remove. Only for QA
          item.image = '/static/images/hero.jpg';
          heroContent.push(item);
        }
      }
    }

    $scope.heroContent = orderByFilter(heroContent, '+order');
  });
});
