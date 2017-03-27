'use strict';

angular.module('mobiusApp.directives.sectionImage', [])
  .directive('sectionImage', ['Settings', 'stateService',
    function(Settings, stateService) { 
      return {
        restrict: 'E',
        scope: {
          from: '=',
          to: '=',
          when: '=',
          section: '=',
          showLogo: '=',
          description: '=',
          roomOverview: '=',
          property: '='
        },
        templateUrl: 'directives/sectionImage/sectionImage.html',
        link: function(scope) {

          //Function to check the current viewport state and set the section image properties dependant on this
          function updateSectionImage(){
            //Store the previous state
            var isMobileBeforeCheck = scope.isMobile;
            //Retrieve the new state
            scope.isMobile = stateService.isMobile();

            //Only update if the state has changed
            if(isMobileBeforeCheck !== scope.isMobile){
              scope.section.height = scope.isMobile ? scope.section.mobile.height : scope.section.desktop.height;
              scope.section.position = scope.isMobile ? scope.section.mobile.position : scope.section.desktop.position;
              scope.section.url = scope.isMobile ? scope.section.mobile.url : scope.section.desktop.url;
            }
          }

          var EVENT_VIEWPORT_RESIZE = 'viewport:resize';        
          var headerConfig = Settings.UI.generics.header;

          //Link for logo that displays in the section
          scope.section.logoLink = headerConfig ? headerConfig.logoLink : null;
          
          updateSectionImage();

          scope.$on(EVENT_VIEWPORT_RESIZE, function(){
            updateSectionImage();
          });          
        }
      };
    }
  ]);
