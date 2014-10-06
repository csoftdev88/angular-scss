'use strict';
angular.module('mobiusApp', [
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'templates-app',
  'localytics.directives',
  'mobiusApp.config',
  'mobiusApp.services.state',
  'mobiusApp.directives.layout',
  'mobiusApp.directives.slider',
  'mobiusApp.directives.booking',
  'mobiusApp.directives.best.offers',
  'mobiusApp.directives.best.hotels'
]).config([
  '$stateProvider',
  '$locationProvider',
  function ($stateProvider, $locationProvider) {
    // Using this settings allows to run current
    // SPA without # in the URL
    $locationProvider.html5Mode(true);
    $stateProvider.state('index', {
      templateUrl: 'layouts/index.html',
      controller: 'MainCtrl'
    }).state('index.home', {
      templateUrl: 'layouts/home/home.html',
      url: '/'
    }).state('otherwise', { url: '/' });
  }
]).controller('MainCtrl', [
  '$scope',
  '$state',
  function ($scope, $state) {
    $scope.$on('$stateChangeSuccess', function () {
      $scope.$state = $state;
    });
  }
]);