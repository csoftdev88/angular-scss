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
    .state('default', {
      templateUrl: 'controllers/main.html',
      controller: 'MainCtrl',
      url: '/'
    })
    .state('otherwise', {
      url: '/'
    });
});
