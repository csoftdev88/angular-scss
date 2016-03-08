'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.prestige', [])

  .controller('PrestigeCtrl', function($scope, breadcrumbsService, scrollService, $timeout) {

    breadcrumbsService.addBreadCrumb('Sutton Prestige');

    $scope.viewMode = 'recent';

    $timeout(function () {
      scrollService.scrollTo('prestige-account', 20);
    });

  });
