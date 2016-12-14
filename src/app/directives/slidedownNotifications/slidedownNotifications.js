'use strict';

angular.module('mobiusApp.directives.slidedownNotifications', [])
  .directive('slidedownNotifications', [
    function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'directives/slidedownNotifications/slidedownNotifications.html',

        link: function(scope){
          var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
          var heroSliderEl = $('#main-container > div > hero-slider');
          scope.$on(EVENT_VIEWPORT_RESIZE, function(event, viewport){
            if(viewport.isMobile){
              var mainHeaderHeight = $('#main-header').height();
              heroSliderEl.css('margin-top', mainHeaderHeight);
            }
            else {
              heroSliderEl.css('margin-top', '');
            }
          });
        }
      };
    }
  ]);
