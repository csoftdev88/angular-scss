'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.prestige', [])

  .controller('PrestigeCtrl', function($scope, breadcrumbsService) {

    console.log('PrestigeCtrl');

    
    breadcrumbsService.addBreadCrumb('Sutton Prestige');

    $scope.viewMode = 'recent';

  });
