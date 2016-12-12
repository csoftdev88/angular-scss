'use strict';

angular.module('mobiusApp.directives.slidedownNotifications', [])
  .directive('slidedownNotifications', ['Settings','$rootScope',
    function(Settings,$rootScope) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'directives/slidedownNotifications/slidedownNotifications.html',

        link: function(scope, elem) {
          $rootScope.campaign = {
            backgroundColor:'#96adbf',
            fullScreen:true,
            transparentBackground:true,
            image:'/static/images/takeover-content@2x.png',
            callToAction:'BOOK NOW!',
            primaryColor:'#f76b1c',
            secondaryColor:'#fbda61',
            title:'<strong>$75 OFF</strong>&nbsp;YOUR STAY'
          };
          console.log(elem);
          console.log($rootScope.campaign);
          if(Settings.UI.campaigns && Settings.UI.campaigns.display && $rootScope.campaign)
          {
            console.log('show the campaign');
            scope.showCampaignBar = true;
            $('body').addClass('campaign-bar-active');
          }
        }
      };
    }
  ]);
