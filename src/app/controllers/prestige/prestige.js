'use strict';
/*
 * This module controlls offers page
 */
angular.module('mobius.controllers.prestige', [])

  .controller('PrestigeCtrl', function($scope, breadcrumbsService, scrollService, $timeout, stateService) {

    breadcrumbsService.addBreadCrumb('Sutton Prestige');

    $scope.viewMode = 'recent';

    $scope.fakeRecent = [
      {'date': '01 Nov 2015'},
      {'date': '02 Nov 2015'},
      {'date': '03 Nov 2015'},
      {'date': '04 Nov 2015'},
      {'date': '05 Nov 2015'},
      {'date': '06 Nov 2015'},
      {'date': '07 Nov 2015'},
      {'date': '08 Nov 2015'},
      {'date': '09 Nov 2015'},
      {'date': '10 Nov 2015'},
      {'date': '11 Nov 2015'},
      {'date': '12 Nov 2015'},
      {'date': '13 Nov 2015'},
      {'date': '14 Nov 2015'},
      {'date': '15 Nov 2015'},
    ];

    $timeout(function () {
      scrollService.scrollTo('prestige-account', 20);
    });

    $scope.isMobile = function(){
      return stateService.isMobile();
    };

    $scope.onPageChange = function(){
      $timeout(function () {
        scrollService.scrollTo('prestige-account', 20);
      });
    };

  });
