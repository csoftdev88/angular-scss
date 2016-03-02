'use strict';

angular.module('mobiusApp.directives.breadcrumbs', [])

  .directive('breadcrumbs', function( $state, $window, breadcrumbsService, _,
      modalService, scrollService, contentService, Settings) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/breadcrumbs/breadcrumbs.html',

      // Widget logic goes here
      link: function(scope) {
        // Show/Hide Alt nav
        scope.showAltNav = angular.isUndefined(Settings.UI.generics.showAltNav) ? true : Settings.UI.generics.showAltNav;
        scope.config = Settings.UI.viewsSettings.breadcrumbsBar;

        var EVENTS_SCROLL_RESIZE = 'scroll resize';

        var unWatchData = scope.$watch(function(){
          var breadcrumbs = breadcrumbsService.getBreadCrumbs() || [];
          if(scope.breadcrumbs !== breadcrumbs){
            scope.breadcrumbs = breadcrumbs;
          }

          var hrefs = breadcrumbsService.getHrefs() || [];
          if(scope.hrefs !== hrefs){
            scope.hrefs = hrefs;
          }

          var absHrefs = breadcrumbsService.getAbsHrefs() || [];
          if(scope.absHrefs !== absHrefs){
            scope.absHrefs = absHrefs;
          }

          var activeHref = breadcrumbsService.getActiveHref();
          if(scope.activeHref !== activeHref){
            scope.activeHref = activeHref;
          }
        });

        var onScrollDebounced = _.debounce(function(){
          var activeHref = breadcrumbsService.getVisibleHref();
          if(activeHref){
            activeHref = _.findWhere(scope.hrefs, {id: activeHref.id});
          }

          scope.$evalAsync(function(){
            scope.scrollActiveHref = activeHref || null;
          });
        }, 250);

        // Scroll listener
        angular.element($window).bind(EVENTS_SCROLL_RESIZE, onScrollDebounced);

        scope.$on('$destroy', function() {
          unWatchData();

          angular.element($window).unbind(EVENTS_SCROLL_RESIZE, onScrollDebounced);
        });

        // TODO: Unify across the app
        scope.scrollTo = function(href) {
          // TODO - handle this in a better way
          if(href === 'fnOpenLightBox'){
            modalService.openGallery(contentService.getLightBoxContent(scope.heroContent));
            return;
          } else if (href === 'fnOpenHotelLightBox'){
            modalService.openGallery(contentService.getLightBoxContent(scope.details.images));
            return;
          }

          scope.activeHref = _.find(scope.hrefs, {id: href}).name;
          var $item = angular.element('#' + href);
          if($item.length){
            scrollService.scrollTo(href, 20);
          }
        };

        scope.$state = $state;
      }
    };
  })
;
