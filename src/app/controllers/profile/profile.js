'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.profile', [])

  .controller('ProfileCtrl', function(breadcrumbsService){

    breadcrumbsService.addBreadCrumb('Profile');

    console.log('ProfileCtrl');
  });
