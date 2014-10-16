'use strict';

angular.module('mobius.controllers.main', [])

.controller( 'MainCtrl',  function($scope, $state, contentService, Settings) {
  $scope.$on('$stateChangeSuccess', function() {
    $scope.$state = $state;
  });

  // Application settings
  $scope.config = Settings.UI;

  // Getting content hights
  contentService.getHighlightedItems().then(function(data){
    $scope.highlightedItems = data;
  });

  $scope.heroContent = [
    {
      image: '/static/images/hero.jpg',
      title: 'First slide',
      subtitle: 'Some great text goes here'
    },
    {
      image: 'https://www.salsitasoft.com/static/assets/img/heading-solutions.jpg',
      title: 'Second slide',
      subtitle: 'Some great text goes here'
    },
    {
      image: '/static/images/hero.jpg',
      title: 'Another slide',
      subtitle: 'Some great text goes here'
    }
  ];
});
