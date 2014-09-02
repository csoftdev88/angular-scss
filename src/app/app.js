'use strict';

angular.module('mobiusApp', [
  'ngRoute',
  'ui.router',

  // Template cache
  'templates-app',

  'mobiusApp.main'
])

.config(function ($stateProvider, $locationProvider) {
  // Using this settings allows to run current
  // SPA without # in the URL
  $locationProvider.html5Mode(true);

  $stateProvider
    // Default application layout
    .state('default', {
      templateUrl: 'layouts/default.html',
    })

    // Home page
    .state('default.home', {
      templateUrl: 'home/home.html',
      url: '/'
    })

    .state('otherwise', {
      url: '/'
    });
});
