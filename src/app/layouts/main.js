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
        if(item.showOnHomepage && item.image){
          heroContent.push(item);
        }
      }
    }

    $scope.heroContent = orderByFilter(heroContent, '+order');
  });
});
