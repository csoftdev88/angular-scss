'use strict';

angular.module('mobiusApp', [
  'ngRoute',
  'ui.router',
  // Bootstrap components
  'ui.bootstrap',
  // Template cache
  'templates-app',
  // 3rd party components
  'localytics.directives',

  // Application modules
  'mobiusApp.main',
  'mobiusApp.config',

  // Services
  'mobiusApp.services.state',

  // Custom components
  'mobiusApp.directives.layout',
  'mobiusApp.directives.slider',
  'mobiusApp.directives.booking',
  'mobiusApp.directives.best.offers',
  'mobiusApp.directives.best.hotels'
])

.config(function ($stateProvider, $locationProvider) {
  // Using this settings allows to run current
  // SPA without # in the URL
  $locationProvider.html5Mode(true);

  $stateProvider
    // Default application layout
    .state('index', {
      templateUrl: 'layouts/index.html',
      controller: 'MainCtrl'
    })

    // Home page
    .state('index.home', {
      templateUrl: 'layouts/home/home.html',
      url: '/'
    })

    .state('otherwise', {
      url: '/'
    });
})

.controller( 'MainCtrl',  function($scope, $state) {
  $scope.$on('$stateChangeSuccess', function() {
    $scope.$state = $state;
  });
});