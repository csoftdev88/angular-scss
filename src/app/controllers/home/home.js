'use strict';
/*
 * This module controlls news page
 */
angular.module('mobius.controllers.home', [])

  .controller('HomeCtrl', function($scope, $controller) {

    $controller('MainCtrl', {$scope: $scope});

  });
